import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function parseCSV(text: string): string[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];

  // Try to find a matric number column in the header
  const header = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
  const matricColIndex = header.findIndex((h) =>
    ["matricnumber", "matric_number", "matric number", "matric no", "matricno", "matric"].includes(h)
  );

  // If header row looks like a data row (no recognised column), start from row 0
  const dataStartIndex = matricColIndex >= 0 || isNaN(Number(lines[0].split(",")[0].trim())) ? 1 : 0;
  const colIndex = matricColIndex >= 0 ? matricColIndex : 0;

  const matrics: string[] = [];
  for (let i = dataStartIndex; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const value = cols[colIndex];
    if (value) matrics.push(value);
  }
  return matrics;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "File must be a CSV" }, { status: 400 });
    }

    const text = await file.text();
    const matricNumbers = parseCSV(text);

    if (matricNumbers.length === 0) {
      return NextResponse.json({ error: "No matric numbers found in CSV" }, { status: 400 });
    }

    // Look up all matric numbers in one query
    const members = await prisma.member.findMany({
      where: { matricNumber: { in: matricNumbers } },
      select: { id: true, matricNumber: true, isAlumni: true },
    });

    const foundMatrics = new Set(members.map((m) => m.matricNumber));
    const notFound = matricNumbers.filter((m) => !foundMatrics.has(m));
    const alreadyAlumni = members.filter((m) => m.isAlumni).map((m) => m.matricNumber);
    const toUpdate = members.filter((m) => !m.isAlumni).map((m) => m.id);

    // Bulk update
    if (toUpdate.length > 0) {
      await prisma.member.updateMany({
        where: { id: { in: toUpdate } },
        data: { isAlumni: true, alumniSince: new Date() },
      });
    }

    return NextResponse.json({
      data: {
        total: matricNumbers.length,
        updated: toUpdate.length,
        alreadyAlumni: alreadyAlumni.length,
        notFound,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}

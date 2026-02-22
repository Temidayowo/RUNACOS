import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, matricNumber } = await req.json();

    const checks: { field: string; exists: boolean }[] = [];

    if (email) {
      const existing = await prisma.member.findUnique({ where: { email } });
      checks.push({ field: "email", exists: !!existing });
    }

    if (matricNumber) {
      const existing = await prisma.member.findUnique({ where: { matricNumber } });
      checks.push({ field: "matricNumber", exists: !!existing });
    }

    const duplicates = checks.filter((c) => c.exists);

    return NextResponse.json({
      data: {
        hasDuplicate: duplicates.length > 0,
        duplicates: duplicates.map((d) => d.field),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to check duplicates" }, { status: 500 });
  }
}

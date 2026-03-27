import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pastQuestionSchema } from "@/lib/validations/past-questions";
import { deleteFile } from "@/lib/upload";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pq = await prisma.pastQuestion.findUnique({
      where: { id: params.id },
    });

    if (!pq) {
      return NextResponse.json({ error: "Past question not found" }, { status: 404 });
    }

    return NextResponse.json({ data: pq });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch past question" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = pastQuestionSchema.parse(body);

    const pq = await prisma.pastQuestion.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: pq });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update past question" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.pastQuestion.findUnique({ where: { id: params.id } });
    await prisma.pastQuestion.delete({ where: { id: params.id } });
    if (existing?.fileUrl) await deleteFile(existing.fileUrl);
    return NextResponse.json({ message: "Past question deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete past question" }, { status: 500 });
  }
}

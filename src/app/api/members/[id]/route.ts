import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteFile } from "@/lib/upload";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ data: member });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.member.findUnique({ where: { id: params.id } });
    await prisma.member.delete({ where: { id: params.id } });
    if (existing?.passportUrl) await deleteFile(existing.passportUrl);

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}

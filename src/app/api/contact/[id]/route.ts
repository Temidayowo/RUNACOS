import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submission = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: { isRead: true },
    });

    return NextResponse.json({ data: submission });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
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

    await prisma.contactSubmission.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Submission deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}

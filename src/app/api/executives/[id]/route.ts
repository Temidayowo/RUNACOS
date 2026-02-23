import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Admin PUT — update executive
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
    const { name, position, image, email, phone, bio, order, active, memberId, impeach, impeachReason, linkedin, twitter, instagram } = body;

    // Handle impeachment
    if (impeach) {
      const executive = await prisma.executive.update({
        where: { id: params.id },
        data: {
          active: false,
          impeachedAt: new Date(),
          impeachReason: impeachReason || null,
        },
      });
      return NextResponse.json({ data: executive });
    }

    // Validate memberId if provided
    if (memberId) {
      const member = await prisma.member.findUnique({ where: { id: memberId } });
      if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }
    }

    const executive = await prisma.executive.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(position !== undefined && { position }),
        ...(image !== undefined && { image: image || null }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(linkedin !== undefined && { linkedin: linkedin || null }),
        ...(twitter !== undefined && { twitter: twitter || null }),
        ...(instagram !== undefined && { instagram: instagram || null }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
        ...(memberId !== undefined && { memberId: memberId || null }),
      },
    });

    return NextResponse.json({ data: executive });
  } catch {
    return NextResponse.json(
      { error: "Failed to update executive" },
      { status: 500 }
    );
  }
}

// Admin DELETE — remove executive
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.executive.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Executive deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete executive" },
      { status: 500 }
    );
  }
}

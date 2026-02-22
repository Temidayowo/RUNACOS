import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateFaultSchema } from "@/lib/validations/frms";
import { sendFaultNotification } from "@/lib/email";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fault = await prisma.fault.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        assignedStaff: { select: { id: true, name: true, email: true } },
        statusHistory: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!fault) {
      return NextResponse.json({ error: "Fault not found" }, { status: 404 });
    }

    return NextResponse.json({ data: fault });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fault" }, { status: 500 });
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
    const validated = updateFaultSchema.parse(body);

    const existing = await prisma.fault.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Fault not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (validated.status) updateData.status = validated.status;
    if (validated.adminNotes !== undefined) updateData.adminNotes = validated.adminNotes;
    if (validated.assignedStaffId !== undefined) updateData.assignedStaffId = validated.assignedStaffId;

    const fault = await prisma.fault.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true },
    });

    // Create status history entry if status changed
    if (validated.status && validated.status !== existing.status) {
      await prisma.faultStatusHistory.create({
        data: {
          faultId: params.id,
          status: validated.status,
          note: validated.note || `Status changed to ${validated.status}`,
          changedBy: session.user?.id,
        },
      });

      // Send notification email
      await sendFaultNotification({
        referenceId: fault.referenceId,
        email: fault.email,
        name: fault.name,
        status: validated.status,
      });
    }

    return NextResponse.json({ data: fault });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update fault" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.fault.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Fault deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete fault" }, { status: 500 });
  }
}

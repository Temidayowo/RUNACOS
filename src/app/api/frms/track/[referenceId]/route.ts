import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { referenceId: string } }
) {
  try {
    const fault = await prisma.fault.findUnique({
      where: { referenceId: params.referenceId },
      include: {
        category: true,
        statusHistory: {
          orderBy: { createdAt: "asc" },
        },
        assignedStaff: {
          select: { name: true },
        },
      },
    });

    if (!fault) {
      return NextResponse.json({ error: "Fault report not found" }, { status: 404 });
    }

    return NextResponse.json({ data: fault });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fault report" }, { status: 500 });
  }
}

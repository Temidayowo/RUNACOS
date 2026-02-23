import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — single payment detail
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await prisma.duesPayment.findUnique({
      where: { id: params.id },
      include: { member: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ data: payment });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 });
  }
}

// PATCH — admin: manually verify payment
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentStatus } = body;

    if (!paymentStatus || !["VERIFIED", "FAILED"].includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }

    const payment = await prisma.duesPayment.update({
      where: { id: params.id },
      data: {
        paymentStatus,
        paymentMethod: "MANUAL",
        verifiedAt: paymentStatus === "VERIFIED" ? new Date() : null,
        verifiedBy: paymentStatus === "VERIFIED" ? session.user?.id : null,
      },
      include: { member: true },
    });

    return NextResponse.json({ data: payment });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}

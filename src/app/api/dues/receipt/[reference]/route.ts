import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — lookup payment by reference for receipt generation
export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const payment = await prisma.duesPayment.findUnique({
      where: { paymentRef: params.reference },
      include: { member: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ data: payment });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch receipt" }, { status: 500 });
  }
}

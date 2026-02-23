import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Legacy route — kept for backwards compatibility, redirects logic to /api/dues

// POST - Initiate payment (redirects to /api/dues flow)
export async function POST(req: NextRequest) {
  try {
    const { email, matricNumber } = await req.json();

    if (!email && !matricNumber) {
      return NextResponse.json(
        { error: "Email or matric number is required" },
        { status: 400 }
      );
    }

    // Find member
    const member = await prisma.member.findFirst({
      where: email ? { email } : { matricNumber },
      include: {
        duesPayments: {
          where: { paymentStatus: "VERIFIED" },
          take: 1,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "No member found with the provided details" },
        { status: 404 }
      );
    }

    if (member.duesPayments.length > 0) {
      return NextResponse.json(
        { error: "Dues already paid", data: { memberId: member.memberId, alreadyPaid: true } },
        { status: 409 }
      );
    }

    return NextResponse.json({
      data: {
        memberId: member.memberId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        redirect: "/dues/pay",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}

// GET - Look up member details
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const matricNumber = searchParams.get("matricNumber");

    if (!email && !matricNumber) {
      return NextResponse.json(
        { error: "Email or matric number is required" },
        { status: 400 }
      );
    }

    const member = await prisma.member.findFirst({
      where: email ? { email } : { matricNumber: matricNumber! },
      include: {
        duesPayments: {
          where: { paymentStatus: "VERIFIED" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "No member found with the provided details" },
        { status: 404 }
      );
    }

    const hasVerifiedPayment = member.duesPayments.length > 0;

    return NextResponse.json({
      data: {
        memberId: member.memberId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        matricNumber: member.matricNumber,
        level: member.level,
        department: member.department,
        passportUrl: member.passportUrl,
        paymentStatus: hasVerifiedPayment ? "VERIFIED" : "PENDING",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to look up member" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// POST - Look up member and initiate payment
export async function POST(req: NextRequest) {
  try {
    const { email, matricNumber } = await req.json();

    if (!email && !matricNumber) {
      return NextResponse.json(
        { error: "Email or matric number is required" },
        { status: 400 }
      );
    }

    // Find member by email or matric number
    const member = await prisma.member.findFirst({
      where: email ? { email } : { matricNumber },
    });

    if (!member) {
      return NextResponse.json(
        { error: "No member found with the provided details" },
        { status: 404 }
      );
    }

    if (member.paymentStatus === "VERIFIED") {
      return NextResponse.json(
        { error: "Dues already paid", data: { memberId: member.memberId, alreadyPaid: true } },
        { status: 409 }
      );
    }

    // Get membership fee from settings
    const feeSetting = await prisma.siteSetting.findUnique({
      where: { key: "membership_fee" },
    });
    const amount = feeSetting ? parseInt(feeSetting.value) : 5000;

    // Generate payment reference
    const paymentRef = `PAY-${nanoid(12)}`;

    // Update member with payment reference
    await prisma.member.update({
      where: { id: member.id },
      data: { paymentRef, amountPaid: amount },
    });

    return NextResponse.json({
      data: {
        memberId: member.memberId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        paymentRef,
        amount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}

// GET - Look up member details (without initiating payment)
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
    });

    if (!member) {
      return NextResponse.json(
        { error: "No member found with the provided details" },
        { status: 404 }
      );
    }

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
        paymentStatus: member.paymentStatus,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to look up member" }, { status: 500 });
  }
}

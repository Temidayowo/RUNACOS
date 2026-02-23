import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const { reference } = params;

    // Find payment by reference
    const payment = await prisma.duesPayment.findUnique({
      where: { paymentRef: reference },
      include: { member: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const member = payment.member;

    // Fetch badge template setting
    const badgeTemplateSetting = await prisma.siteSetting.findUnique({
      where: { key: "badge_template" },
    });
    const badgeTemplateUrl = badgeTemplateSetting?.value || null;

    // If already verified, return member data
    if (payment.paymentStatus === "VERIFIED") {
      return NextResponse.json({
        data: {
          memberId: member.memberId,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          matricNumber: member.matricNumber,
          level: member.level,
          passportUrl: member.passportUrl,
          paidAt: payment.verifiedAt?.toISOString() || payment.createdAt.toISOString(),
          paymentStatus: "VERIFIED",
          gender: member.gender,
          department: member.department,
          faculty: member.faculty,
          stateOfOrigin: member.stateOfOrigin,
          academicSession: member.academicSession,
          semester: member.semester,
          badgeTemplateUrl,
        },
      });
    }

    // Verify payment with Paystack
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.status && verifyData.data.status === "success") {
      // Update payment status
      await prisma.duesPayment.update({
        where: { paymentRef: reference },
        data: {
          paymentStatus: "VERIFIED",
          verifiedAt: new Date(),
        },
      });

      return NextResponse.json({
        data: {
          memberId: member.memberId,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          matricNumber: member.matricNumber,
          level: member.level,
          passportUrl: member.passportUrl,
          paidAt: new Date().toISOString(),
          paymentStatus: "VERIFIED",
          gender: member.gender,
          department: member.department,
          faculty: member.faculty,
          stateOfOrigin: member.stateOfOrigin,
          academicSession: member.academicSession,
          semester: member.semester,
          badgeTemplateUrl,
        },
      });
    } else {
      // Mark as failed
      await prisma.duesPayment.update({
        where: { paymentRef: reference },
        data: { paymentStatus: "FAILED" },
      });

      return NextResponse.json(
        { error: "Payment verification failed", data: { paymentStatus: "FAILED" } },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}

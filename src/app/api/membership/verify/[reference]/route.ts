import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const { reference } = params;

    // Find member by payment reference
    const member = await prisma.member.findUnique({
      where: { paymentRef: reference },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Fetch badge template setting
    const badgeTemplateSetting = await prisma.siteSetting.findUnique({
      where: { key: "badge_template" },
    });
    const badgeTemplateUrl = badgeTemplateSetting?.value || null;

    // If already verified, return member data
    if (member.paymentStatus === "VERIFIED") {
      return NextResponse.json({ data: { ...member, badgeTemplateUrl } });
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
      // Update member payment status
      const updatedMember = await prisma.member.update({
        where: { paymentRef: reference },
        data: {
          paymentStatus: "VERIFIED",
          paidAt: new Date(),
        },
      });

      return NextResponse.json({ data: { ...updatedMember, badgeTemplateUrl } });
    } else {
      // Mark as failed
      await prisma.member.update({
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

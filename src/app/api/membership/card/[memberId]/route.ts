import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params;

    const member = await prisma.member.findUnique({
      where: { memberId },
      include: {
        duesPayments: {
          where: { paymentStatus: "VERIFIED" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (member.duesPayments.length === 0) {
      return NextResponse.json(
        { error: "No verified payment found for this member" },
        { status: 403 }
      );
    }

    const latestPayment = member.duesPayments[0];

    // Fetch badge template from settings
    const badgeTemplateSetting = await prisma.siteSetting.findUnique({
      where: { key: "badge_template" },
    });

    return NextResponse.json({
      data: {
        memberId: member.memberId,
        firstName: member.firstName,
        lastName: member.lastName,
        matricNumber: member.matricNumber,
        level: member.level,
        passportUrl: member.passportUrl,
        paidAt: latestPayment.verifiedAt || latestPayment.createdAt,
        gender: member.gender,
        department: member.department,
        faculty: member.faculty,
        stateOfOrigin: member.stateOfOrigin,
        academicSession: member.academicSession,
        semester: member.semester,
        badgeTemplateUrl: badgeTemplateSetting?.value || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch member card data" }, { status: 500 });
  }
}

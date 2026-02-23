import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

// GET — list payments (admin: all; public: by member email)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const matricNumber = searchParams.get("matricNumber");
    const session = searchParams.get("session");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const authSession = await auth();
    const where: any = {};

    if (!authSession) {
      // Public: must filter by email or matric number
      if (!email && !matricNumber) {
        return NextResponse.json({ error: "Email or matric number is required" }, { status: 400 });
      }
      const member = email
        ? await prisma.member.findUnique({ where: { email } })
        : await prisma.member.findUnique({ where: { matricNumber: matricNumber! } });
      if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }
      where.memberId = member.id;
    } else {
      // Admin: optional filters
      if (email) {
        const member = await prisma.member.findUnique({ where: { email } });
        if (member) where.memberId = member.id;
      } else if (matricNumber) {
        const member = await prisma.member.findUnique({ where: { matricNumber } });
        if (member) where.memberId = member.id;
      }
    }

    if (session) where.academicSession = session;
    if (status) where.paymentStatus = status;

    const [data, total] = await Promise.all([
      prisma.duesPayment.findMany({
        where,
        include: { member: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.duesPayment.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST — initiate dues payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, matricNumber } = body;

    if (!email && !matricNumber) {
      return NextResponse.json(
        { error: "Email or matric number is required" },
        { status: 400 }
      );
    }

    // Look up member
    const member = email
      ? await prisma.member.findUnique({ where: { email } })
      : await prisma.member.findUnique({ where: { matricNumber } });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Get current session and dues amount from settings
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["academic_session", "dues_amount", "paystack_prefix"] } },
    });
    const settingsMap: Record<string, string> = {};
    for (const s of settings) settingsMap[s.key] = s.value;

    const academicSession = settingsMap.academic_session;
    const duesAmount = parseInt(settingsMap.dues_amount || "5000");
    const prefix = settingsMap.paystack_prefix || "RUNACOS";

    if (!academicSession) {
      return NextResponse.json(
        { error: "Academic session not configured. Contact admin." },
        { status: 400 }
      );
    }

    // Check if already paid for this session
    const existing = await prisma.duesPayment.findUnique({
      where: { memberId_academicSession: { memberId: member.id, academicSession } },
    });

    if (existing && existing.paymentStatus === "VERIFIED") {
      return NextResponse.json(
        { error: "Dues already paid for this session", data: existing },
        { status: 409 }
      );
    }

    // Generate payment reference
    const paymentRef = `${prefix}-${academicSession.replace("/", "")}-${nanoid(8).toUpperCase()}`;

    // Create or update DuesPayment record
    const duesPayment = existing
      ? await prisma.duesPayment.update({
          where: { id: existing.id },
          data: { paymentRef, paymentStatus: "PENDING", amount: duesAmount },
        })
      : await prisma.duesPayment.create({
          data: {
            memberId: member.id,
            academicSession,
            amount: duesAmount,
            paymentRef,
            paymentStatus: "PENDING",
            paymentMethod: "PAYSTACK",
          },
        });

    // Initialize Paystack payment
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
    }

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: member.email,
        amount: duesAmount * 100,
        reference: paymentRef,
        callback_url: `${process.env.NEXTAUTH_URL}/dues/receipt/${paymentRef}`,
        metadata: {
          member_id: member.memberId,
          member_name: `${member.firstName} ${member.lastName}`,
          academic_session: academicSession,
          type: "dues_payment",
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: {
        payment: duesPayment,
        member: {
          id: member.id,
          memberId: member.memberId,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          matricNumber: member.matricNumber,
          level: member.level,
          admissionYear: member.admissionYear,
        },
        paystack: {
          authorizationUrl: paystackData.data.authorization_url,
          accessCode: paystackData.data.access_code,
          reference: paystackData.data.reference,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}

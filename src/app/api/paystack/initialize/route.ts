import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, amount, reference, callbackUrl } = await req.json();

    if (!email || !amount || !reference) {
      return NextResponse.json(
        { error: "Email, amount, and reference are required" },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        reference,
        callback_url: callbackUrl || `${process.env.NEXTAUTH_URL}/membership/verify`,
      }),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({
        data: {
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference,
        },
      });
    } else {
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}

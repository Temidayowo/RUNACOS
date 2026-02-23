import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", paystackSecret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      // Find DuesPayment by paymentRef
      const duesPayment = await prisma.duesPayment.findUnique({
        where: { paymentRef: reference },
      });

      if (duesPayment && duesPayment.paymentStatus !== "VERIFIED") {
        await prisma.duesPayment.update({
          where: { paymentRef: reference },
          data: {
            paymentStatus: "VERIFIED",
            verifiedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

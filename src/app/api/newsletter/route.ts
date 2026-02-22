import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // In production, integrate with email marketing service (e.g., Resend audiences)
    // For now, just acknowledge the subscription
    console.log("Newsletter subscription:", email);

    return NextResponse.json({ message: "Successfully subscribed to newsletter" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

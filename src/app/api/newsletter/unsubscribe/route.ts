import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (!subscriber) {
      // Return success anyway to avoid email enumeration
      return NextResponse.json({ message: "Unsubscribed successfully" });
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { active: false, unsubscribedAt: new Date() },
    });

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}

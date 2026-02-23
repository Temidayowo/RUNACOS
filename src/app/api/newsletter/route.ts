import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST — subscribe email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true, unsubscribedAt: null, name: name || undefined },
      create: { email, name: name || null },
    });

    return NextResponse.json({ message: "Successfully subscribed to newsletter", data: subscriber });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

// GET — admin: list subscribers
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });

    return NextResponse.json({ data: subscribers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

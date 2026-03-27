import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { registrationId } = await req.json();
    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: { event: { select: { title: true, eventDate: true, location: true } } },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.checkedIn) {
      return NextResponse.json(
        { error: "Already checked in", data: registration },
        { status: 409 }
      );
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { checkedIn: true, checkedInAt: new Date() },
      include: { event: { select: { title: true, eventDate: true, location: true } } },
    });

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}

// Look up a registration by ID (for scanner preview before confirming)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const registrationId = searchParams.get("id");
    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: { event: { select: { title: true, eventDate: true, location: true } } },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ data: registration });
  } catch {
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 });
  }
}

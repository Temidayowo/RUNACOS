import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { sendRegistrationEmail } from "@/lib/brevo";
import { format } from "date-fns";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: params.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: registrations });
  } catch {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({ where: { id: params.id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const eventEnd = event.endDate ?? event.eventDate;
    if (new Date(eventEnd) < new Date()) {
      return NextResponse.json({ error: "Registration is closed — this event has already taken place." }, { status: 410 });
    }

    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if already registered
    const existing = await prisma.eventRegistration.findFirst({
      where: { eventId: params.id, email: validated.email },
    });

    if (existing) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 409 });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: params.id,
        ...validated,
      },
    });

    // Send confirmation email with QR code (non-blocking)
    sendRegistrationEmail({
      to: validated.email,
      name: validated.name,
      eventTitle: event.title,
      eventDate: format(new Date(event.eventDate), "MMMM dd, yyyy 'at' h:mm a"),
      eventLocation: event.location,
      registrationId: registration.id,
    }).catch(console.error);

    return NextResponse.json({ data: registration }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

    return NextResponse.json({ data: registration }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}

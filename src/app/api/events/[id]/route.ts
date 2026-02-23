import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { eventSchema } from "@/lib/validations/content";
import { slugify } from "@/lib/utils";
import { sendBulkEmail, getMailingRecipients, buildContentEmail } from "@/lib/brevo";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ data: event });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = eventSchema.parse(body);

    const existing = await prisma.event.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const slug = slugify(validated.title);
    let finalSlug = slug;
    if (slug !== existing.slug) {
      const duplicate = await prisma.event.findUnique({ where: { slug } });
      if (duplicate && duplicate.id !== params.id) {
        finalSlug = `${slug}-${Date.now()}`;
      }
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: validated.title,
        slug: finalSlug,
        description: validated.description,
        coverImage: validated.coverImage,
        location: validated.location,
        eventDate: new Date(validated.eventDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        status: validated.status,
      },
    });

    // Send email notification if newly published
    if (validated.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      getMailingRecipients().then((recipients) => {
        if (recipients.length > 0) {
          const html = buildContentEmail("event", event.title, event.description.substring(0, 200), event.slug);
          sendBulkEmail(recipients, `RUNACOS Event: ${event.title}`, html).catch(console.error);
        }
      }).catch(console.error);
    }

    return NextResponse.json({ data: event });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}

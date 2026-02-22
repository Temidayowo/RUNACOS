import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { eventSchema } from "@/lib/validations/content";
import { slugify } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE));
    const type = searchParams.get("type"); // upcoming | past
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    const session = await auth();
    if (!session) {
      where.status = "PUBLISHED";
    } else if (status) {
      where.status = status;
    }

    if (type === "upcoming") {
      where.eventDate = { gte: new Date() };
    } else if (type === "past") {
      where.eventDate = { lt: new Date() };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { eventDate: type === "past" ? "desc" : "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = eventSchema.parse(body);

    const slug = slugify(validated.title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const event = await prisma.event.create({
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

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

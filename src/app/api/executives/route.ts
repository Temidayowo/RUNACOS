import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Public GET — returns active executives ordered by position
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const session = all ? await auth() : null;

    const executives = await prisma.executive.findMany({
      where: all && session ? {} : { active: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ data: executives });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch executives" },
      { status: 500 }
    );
  }
}

// Admin POST — create new executive
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, position, image, email, phone, bio, order, active } = body;

    if (!name || !position) {
      return NextResponse.json(
        { error: "Name and position are required" },
        { status: 400 }
      );
    }

    const count = await prisma.executive.count();

    const executive = await prisma.executive.create({
      data: {
        name,
        position,
        image: image || null,
        email: email || null,
        phone: phone || null,
        bio: bio || null,
        order: order ?? count,
        active: active ?? true,
      },
    });

    return NextResponse.json({ data: executive }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create executive" },
      { status: 500 }
    );
  }
}

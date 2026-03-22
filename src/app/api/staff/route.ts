import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Public GET — returns active staff ordered by position
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const session = all ? await auth() : null;

    const staff = await prisma.staff.findMany({
      where: all && session ? {} : { active: true },
      orderBy: { order: "asc" },
    });

    const res = NextResponse.json({ data: staff });
    if (!session) {
      res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
    }
    return res;
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

// Admin POST — create new staff member
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, title, specialty, department, email, phone, image, bio, order, active } = body;

    if (!name || !title) {
      return NextResponse.json(
        { error: "Name and title are required" },
        { status: 400 }
      );
    }

    const count = await prisma.staff.count();

    const staff = await prisma.staff.create({
      data: {
        name,
        title,
        specialty: specialty || null,
        department: department || null,
        email: email || null,
        phone: phone || null,
        image: image || null,
        bio: bio || null,
        order: order ?? count,
        active: active ?? true,
      },
    });

    return NextResponse.json({ data: staff }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create staff member" },
      { status: 500 }
    );
  }
}

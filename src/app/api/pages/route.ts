import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const PAGE_HEROES_KEY = "page_heroes";

// Public GET — returns full page_heroes map
export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: PAGE_HEROES_KEY },
    });

    if (!setting) {
      return NextResponse.json({ data: {} });
    }

    return NextResponse.json({ data: JSON.parse(setting.value) });
  } catch {
    return NextResponse.json({ data: {} });
  }
}

// Admin PUT — save a single page config
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, config } = await req.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    if (!config || typeof config !== "object") {
      return NextResponse.json({ error: "Invalid config" }, { status: 400 });
    }

    // Read existing map
    const setting = await prisma.siteSetting.findUnique({
      where: { key: PAGE_HEROES_KEY },
    });

    const heroes: Record<string, any> = setting
      ? JSON.parse(setting.value)
      : {};

    // Merge the single page config
    heroes[slug] = {
      heading: config.heading || "",
      subheading: config.subheading || "",
      backgroundImage: config.backgroundImage || "",
    };

    await prisma.siteSetting.upsert({
      where: { key: PAGE_HEROES_KEY },
      update: { value: JSON.stringify(heroes) },
      create: { key: PAGE_HEROES_KEY, value: JSON.stringify(heroes) },
    });

    return NextResponse.json({ message: "Page hero updated" });
  } catch {
    return NextResponse.json(
      { error: "Failed to update page hero" },
      { status: 500 }
    );
  }
}

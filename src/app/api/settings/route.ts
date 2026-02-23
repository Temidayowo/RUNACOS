import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json({ data: settingsMap });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updates: { key: string; value: string }[] = body.settings;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    for (const { key, value } of updates) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    // Return updated settings so client can verify
    const allSettings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of allSettings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ message: "Settings updated successfully", data: settingsMap });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

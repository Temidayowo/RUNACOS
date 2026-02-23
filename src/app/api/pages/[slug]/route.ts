import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_HEROES_KEY = "page_heroes";

// In-memory cache (shared across requests in the same server process)
let cachedHeroes: Record<string, any> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60 seconds

async function getHeroesMap() {
  const now = Date.now();
  if (cachedHeroes && now - cacheTimestamp < CACHE_TTL) {
    return cachedHeroes;
  }

  const setting = await prisma.siteSetting.findUnique({
    where: { key: PAGE_HEROES_KEY },
  });

  cachedHeroes = setting ? JSON.parse(setting.value) : {};
  cacheTimestamp = now;
  return cachedHeroes;
}

// Public GET — returns hero config for one page
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const heroes = await getHeroesMap();
    return NextResponse.json(
      { data: heroes![slug] || null },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json({ data: null });
  }
}

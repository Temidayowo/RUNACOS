import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CAROUSEL_KEY = "hero_carousel";

const defaultSlides = [
  {
    id: "default-1",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/41658/41658-720.mp4",
    title: "Empowering the Future of",
    highlight: "Technology & Innovation",
    subtitle:
      "The official body representing the brilliant minds of the Department of Computer Science at Redeemer\u2019s University.",
    duration: 10,
    order: 0,
    active: true,
  },
  {
    id: "default-2",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80&fit=crop",
    title: "Building Tomorrow's",
    highlight: "Tech Leaders",
    subtitle:
      "Join a community of passionate computer science students pushing the boundaries of innovation.",
    duration: 4,
    order: 1,
    active: true,
  },
  {
    id: "default-3",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80&fit=crop",
    title: "Collaborate, Learn &",
    highlight: "Grow Together",
    subtitle:
      "From hackathons to workshops, we create opportunities for every student to thrive.",
    duration: 4,
    order: 2,
    active: true,
  },
  {
    id: "default-4",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80&fit=crop",
    title: "Excellence in",
    highlight: "Computer Science",
    subtitle:
      "Redeemer\u2019s University Department of Computer Science \u2014 fully accredited and nationally recognized.",
    duration: 4,
    order: 3,
    active: true,
  },
  {
    id: "default-5",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80&fit=crop",
    title: "Your Gateway to the",
    highlight: "Tech Industry",
    subtitle:
      "Career fairs, internship connections, and industry partnerships to launch your career.",
    duration: 4,
    order: 4,
    active: true,
  },
];

// Public GET — returns active carousel slides
export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: CAROUSEL_KEY },
    });

    if (!setting) {
      const res = NextResponse.json({ data: defaultSlides });
      res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
      return res;
    }

    const slides = JSON.parse(setting.value);
    const active = slides
      .filter((s: any) => s.active)
      .sort((a: any, b: any) => a.order - b.order);

    const res = NextResponse.json({ data: active.length > 0 ? active : defaultSlides });
    res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
    return res;
  } catch {
    const res = NextResponse.json({ data: defaultSlides });
    res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
    return res;
  }
}

// Admin PUT — save all carousel slides (including inactive)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slides } = await req.json();

    if (!Array.isArray(slides)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await prisma.siteSetting.upsert({
      where: { key: CAROUSEL_KEY },
      update: { value: JSON.stringify(slides) },
      create: { key: CAROUSEL_KEY, value: JSON.stringify(slides) },
    });

    return NextResponse.json({ message: "Carousel updated" });
  } catch {
    return NextResponse.json({ error: "Failed to update carousel" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { newsSchema } from "@/lib/validations/content";
import { slugify } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Support lookup by id or slug
    const news = await prisma.news.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ data: news });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
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
    const validated = newsSchema.parse(body);

    const existing = await prisma.news.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const slug = slugify(validated.title);
    let finalSlug = slug;
    if (slug !== existing.slug) {
      const duplicate = await prisma.news.findUnique({ where: { slug } });
      if (duplicate && duplicate.id !== params.id) {
        finalSlug = `${slug}-${Date.now()}`;
      }
    }

    const news = await prisma.news.update({
      where: { id: params.id },
      data: {
        ...validated,
        slug: finalSlug,
        publishedAt:
          validated.status === "PUBLISHED" && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
      },
    });

    return NextResponse.json({ data: news });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
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

    await prisma.news.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "News deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}

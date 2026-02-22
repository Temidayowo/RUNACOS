import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { articleSchema } from "@/lib/validations/content";
import { slugify } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ data: article });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
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
    const validated = articleSchema.parse(body);

    const existing = await prisma.article.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const slug = slugify(validated.title);
    let finalSlug = slug;
    if (slug !== existing.slug) {
      const duplicate = await prisma.article.findUnique({ where: { slug } });
      if (duplicate && duplicate.id !== params.id) {
        finalSlug = `${slug}-${Date.now()}`;
      }
    }

    const article = await prisma.article.update({
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

    return NextResponse.json({ data: article });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
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

    await prisma.article.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Article deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}

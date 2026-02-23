import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { articleSchema } from "@/lib/validations/content";
import { slugify } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { sendBulkEmail, getMailingRecipients, buildContentEmail } from "@/lib/brevo";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE));
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    const session = await auth();
    if (!session) {
      where.status = "PUBLISHED";
    } else if (status) {
      where.status = status;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const res = NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    if (!session) {
      res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    }
    return res;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = articleSchema.parse(body);

    const slug = slugify(validated.title);
    const existing = await prisma.article.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const article = await prisma.article.create({
      data: {
        ...validated,
        slug: finalSlug,
        publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Send email notification if published directly
    if (article.status === "PUBLISHED") {
      getMailingRecipients().then((recipients) => {
        if (recipients.length > 0) {
          const html = buildContentEmail("article", article.title, article.excerpt, article.slug);
          sendBulkEmail(recipients, `RUNACOS: ${article.title}`, html).catch(console.error);
        }
      }).catch(console.error);
    }

    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      const messages = error.errors.map((e: any) => e.message).join(", ");
      return NextResponse.json({ error: messages, details: error.errors }, { status: 400 });
    }
    console.error("Article creation error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

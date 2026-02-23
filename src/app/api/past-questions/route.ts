import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pastQuestionSchema } from "@/lib/validations/past-questions";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE));
    const department = searchParams.get("department");
    const course = searchParams.get("course");
    const year = searchParams.get("year");
    const search = searchParams.get("search");

    const where: any = {};

    if (department) {
      where.department = department;
    }

    if (course) {
      where.course = { contains: course };
    }

    if (year) {
      where.year = parseInt(year);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { course: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.pastQuestion.findMany({
        where,
        orderBy: { year: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pastQuestion.count({ where }),
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
    res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
    return res;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch past questions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = pastQuestionSchema.parse(body);

    const pq = await prisma.pastQuestion.create({
      data: validated,
    });

    return NextResponse.json({ data: pq }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create past question" }, { status: 500 });
  }
}

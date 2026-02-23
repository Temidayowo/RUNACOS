import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — list alumni (public: active alumni; admin: all with eligibility)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await auth();

    if (session) {
      // Admin: return all members with alumni info and eligibility
      const sessionSetting = await prisma.siteSetting.findUnique({
        where: { key: "academic_session" },
      });
      const currentSession = sessionSetting?.value || "";
      const sessionStart = parseInt(currentSession.split("/")[0]) || new Date().getFullYear();

      const members = await prisma.member.findMany({
        orderBy: { firstName: "asc" },
        include: {
          executive: { select: { id: true, position: true, active: true } },
        },
      });

      const data = members.map((m) => ({
        ...m,
        eligible: m.admissionYear ? sessionStart - m.admissionYear >= 4 : false,
      }));

      return NextResponse.json({ data });
    } else {
      // Public: return active alumni only
      const alumni = await prisma.member.findMany({
        where: { isAlumni: true },
        orderBy: { firstName: "asc" },
        include: {
          executive: { select: { id: true, position: true, active: true } },
        },
      });

      const res = NextResponse.json({ data: alumni });
      res.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
      return res;
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 });
  }
}

// PATCH — admin: toggle alumni status for a member
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { memberId, isAlumni } = body;

    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }

    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        isAlumni: !!isAlumni,
        alumniSince: isAlumni ? new Date() : null,
      },
    });

    return NextResponse.json({ data: member });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update alumni status" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalFaults,
      openFaults,
      inProgressFaults,
      resolvedFaults,
      totalNews,
      totalEvents,
      totalArticles,
      totalPastQuestions,
      totalUsers,
      unreadContacts,
      recentFaults,
      totalMembers,
      verifiedMembers,
      totalExecutives,
    ] = await Promise.all([
      prisma.fault.count(),
      prisma.fault.count({ where: { status: "OPEN" } }),
      prisma.fault.count({ where: { status: "IN_PROGRESS" } }),
      prisma.fault.count({ where: { status: "RESOLVED" } }),
      prisma.news.count(),
      prisma.event.count(),
      prisma.article.count(),
      prisma.pastQuestion.count(),
      prisma.user.count(),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.fault.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      prisma.member.count(),
      prisma.member.count({ where: { paymentStatus: "VERIFIED" } }),
      prisma.executive.count({ where: { active: true } }),
    ]);

    return NextResponse.json({
      data: {
        faults: {
          total: totalFaults,
          open: openFaults,
          inProgress: inProgressFaults,
          resolved: resolvedFaults,
        },
        content: {
          news: totalNews,
          events: totalEvents,
          articles: totalArticles,
          pastQuestions: totalPastQuestions,
          executives: totalExecutives,
        },
        users: totalUsers,
        unreadContacts,
        recentFaults,
        members: {
          total: totalMembers,
          verified: verifiedMembers,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

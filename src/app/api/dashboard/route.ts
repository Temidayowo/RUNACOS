import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current academic session from settings
    const sessionSetting = await prisma.siteSetting.findUnique({
      where: { key: "academic_session" },
    });
    const currentSession = sessionSetting?.value || "";

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
      totalExecutives,
      totalAlumni,
      totalPayments,
      verifiedPayments,
      sessionPayments,
      totalRevenue,
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
      prisma.executive.count({ where: { active: true } }),
      prisma.member.count({ where: { isAlumni: true } }),
      prisma.duesPayment.count(),
      prisma.duesPayment.count({ where: { paymentStatus: "VERIFIED" } }),
      currentSession
        ? prisma.duesPayment.count({
            where: { academicSession: currentSession, paymentStatus: "VERIFIED" },
          })
        : Promise.resolve(0),
      prisma.duesPayment.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: "VERIFIED" },
      }),
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
          alumni: totalAlumni,
        },
        payments: {
          total: totalPayments,
          verified: verifiedPayments,
          thisSession: sessionPayments,
          totalRevenue: totalRevenue._sum.amount || 0,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

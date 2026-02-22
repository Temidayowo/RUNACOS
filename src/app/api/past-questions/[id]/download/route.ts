import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pq = await prisma.pastQuestion.update({
      where: { id: params.id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json({ data: { url: pq.fileUrl, downloads: pq.downloads } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 });
  }
}

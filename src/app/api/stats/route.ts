import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { StatsPeriod } from "@/lib/stats";

function periodStart(period: StatsPeriod): Date | null {
  if (period === "all") return null;
  const d = new Date();
  if (period === "today") {
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "7d") {
    d.setDate(d.getDate() - 7);
    return d;
  }
  d.setDate(d.getDate() - 30);
  return d;
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "today") as StatsPeriod;
  const partnerParam = searchParams.get("partnerId");
  const since = periodStart(period);

  let partnerId: number | null | undefined = undefined;
  if (partnerParam === "null") partnerId = null;
  else if (partnerParam) partnerId = Number(partnerParam);

  const types = await prisma.visitEvent.groupBy({
    by: ["eventType"],
    where: {
      ...(since ? { createdAt: { gte: since } } : {}),
      ...(partnerParam !== null && partnerParam !== ""
        ? { partnerId: partnerId ?? undefined }
        : {}),
    },
    _count: { id: true },
  });

  return NextResponse.json(
    types.map((t) => ({ eventType: t.eventType, count: t._count.id }))
  );
}

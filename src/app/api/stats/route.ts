import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { queryStatsDashboard, type StatsPeriod } from "@/lib/stats";
import type { AnalyticsSite } from "@/lib/analytics-blob";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "today") as StatsPeriod;
  const partnerParam = searchParams.get("partnerId");
  const siteParam = searchParams.get("site");
  const site: AnalyticsSite | undefined =
    siteParam === "main" || siteParam === "landing" ? siteParam : undefined;

  let partnerId: number | null | undefined = undefined;
  if (partnerParam === "null") partnerId = null;
  else if (partnerParam) partnerId = Number(partnerParam);

  const dashboard = await queryStatsDashboard({
    period,
    site,
    ...(partnerParam !== null && partnerParam !== "" ? { partnerId } : {}),
  });

  return NextResponse.json(dashboard);
}

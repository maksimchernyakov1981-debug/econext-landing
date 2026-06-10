import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { queryEventCounts, type StatsPeriod } from "@/lib/stats";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "today") as StatsPeriod;
  const partnerParam = searchParams.get("partnerId");

  let partnerId: number | null | undefined = undefined;
  if (partnerParam === "null") partnerId = null;
  else if (partnerParam) partnerId = Number(partnerParam);

  const rows = await queryEventCounts({
    period,
    ...(partnerParam !== null && partnerParam !== "" ? { partnerId } : {}),
  });

  return NextResponse.json(rows);
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminMedia } from "@/lib/admin-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getAdminMedia();
  return NextResponse.json({ items, count: items.length });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminMedia } from "@/lib/admin-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getAdminMedia();
    return NextResponse.json({ items, count: items.length });
  } catch (e) {
    console.error("[media-list]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка загрузки списка" },
      { status: 500 }
    );
  }
}

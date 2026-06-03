import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * One-time: POST /api/setup — creates tables + seed (after deploy).
 * Requires admin session. Call once from browser console on /admin after login.
 */
export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await prisma.partner.count();
    if (count > 0) {
      return NextResponse.json({ ok: true, message: "Already initialized", partners: count });
    }
  } catch {
    // tables may not exist
  }

  return NextResponse.json({
    ok: false,
    message:
      "Run locally: DATABASE_URL=your_neon_url npx prisma db push && npx prisma db seed",
  });
}

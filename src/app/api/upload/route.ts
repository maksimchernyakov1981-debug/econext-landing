import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const type = String(form.get("type") ?? "misc");

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const maxBytes = env.uploadMaxMb() * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const name = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", type);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);

  const url = `/uploads/${type}/${name}`;
  return NextResponse.json({ url });
}

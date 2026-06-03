import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const partner = await prisma.partner.findUnique({
    where: { id: Number(id) },
  });
  if (!partner) return new NextResponse("Not found", { status: 404 });

  const url = `${env.baseUrl().replace(/\/$/, "")}/gift/${partner.slug}`;
  const png = await QRCode.toBuffer(url, { width: 512, margin: 2 });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${partner.slug}.png"`,
    },
  });
}

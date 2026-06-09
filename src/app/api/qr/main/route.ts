import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { mainLandingUrlAsync } from "@/lib/public-site-url";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const url = await mainLandingUrlAsync();
  const png = await QRCode.toBuffer(url, { width: 512, margin: 2, errorCorrectionLevel: "M" });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="qr-main.png"',
      "Cache-Control": "private, max-age=60",
    },
  });
}

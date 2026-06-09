import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminPartner } from "@/lib/admin-data";
import { partnerLandingUrlAsync } from "@/lib/public-site-url";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const partnerId = Number(id);
  if (!Number.isFinite(partnerId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const partner = await getAdminPartner(partnerId);
  if (!partner) return new NextResponse("Not found", { status: 404 });

  const url = await partnerLandingUrlAsync(partner.slug);
  const png = await QRCode.toBuffer(url, { width: 512, margin: 2, errorCorrectionLevel: "M" });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${partner.slug}.png"`,
      "Cache-Control": "private, max-age=60",
    },
  });
}

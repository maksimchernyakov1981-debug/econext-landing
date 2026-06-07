import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminPartner, getAdminSettings } from "@/lib/admin-data";
import { partnerLandingUrl } from "@/lib/public-site-url";
import { PartnerPrintView } from "@/components/admin/PartnerPrintView";

export default async function PartnerPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ format?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { format: fmt } = await searchParams;
  const format = fmt === "a6" ? "a6" : "a4";

  const partner = await getAdminPartner(Number(id));
  if (!partner) notFound();

  const { qr } = await getAdminSettings();
  const landingUrl = partnerLandingUrl(partner.slug);
  const qrImageUrl = `/api/partners/${partner.id}/qr`;

  return (
    <PartnerPrintView
      partner={partner}
      qr={qr}
      landingUrl={landingUrl}
      qrImageUrl={qrImageUrl}
      format={format}
    />
  );
}

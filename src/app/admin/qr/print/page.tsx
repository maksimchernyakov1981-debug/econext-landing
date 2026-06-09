import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { mainLandingUrlAsync } from "@/lib/public-site-url";
import { PartnerPrintView } from "@/components/admin/PartnerPrintView";

export default async function MainQrPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string }>;
}) {
  await requireAdmin();
  const { format: fmt } = await searchParams;
  const format = fmt === "a8" ? "a8" : fmt === "a4" ? "a4" : "a6";

  const { qr } = await getAdminSettings();
  const landingUrl = await mainLandingUrlAsync();

  return (
    <PartnerPrintView
      variant="main"
      qr={qr}
      landingUrl={landingUrl}
      qrImageUrl="/api/qr/main"
      format={format}
    />
  );
}

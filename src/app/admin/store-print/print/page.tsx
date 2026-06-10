import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { PartnerPrintView } from "@/components/admin/PartnerPrintView";

export default async function StorePrintPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string }>;
}) {
  await requireAdmin();
  const { format: fmt } = await searchParams;
  const format = fmt === "a4" ? "a4" : "a6";

  const { qr } = await getAdminSettings();

  return <PartnerPrintView variant="store" qr={qr} format={format} />;
}

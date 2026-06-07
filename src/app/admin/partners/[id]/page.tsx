import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminPartner } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { PartnerEditor } from "./PartnerEditor";
import { PartnerStats } from "./PartnerStats";
import { partnerLandingUrl } from "@/lib/public-site-url";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const partner = await getAdminPartner(Number(id));
  if (!partner) notFound();

  const landingUrl = partnerLandingUrl(partner.slug);

  return (
    <AdminShell title={partner.name}>
      <div className="space-y-6">
        <PartnerEditor partner={partner} landingUrl={landingUrl} qrUrl={`/api/partners/${partner.id}/qr`} />
        <PartnerStats partnerId={partner.id} />
      </div>
    </AdminShell>
  );
}

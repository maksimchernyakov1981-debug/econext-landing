import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminPartner } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { PartnerEditor } from "./PartnerEditor";
import { PartnerStats } from "./PartnerStats";
import { partnerLandingUrlAsync, resolvePublicSiteUrl } from "@/lib/public-site-url";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const partner = await getAdminPartner(Number(id));
  if (!partner) notFound();

  const [landingUrl, publicSiteUrl] = await Promise.all([
    partnerLandingUrlAsync(partner.slug),
    resolvePublicSiteUrl(),
  ]);

  return (
    <AdminShell title={partner.name}>
      <div className="space-y-6">
        <PartnerStats partnerId={partner.id} partnerName={partner.name} />
        <PartnerEditor
          partner={partner}
          landingUrl={landingUrl}
          qrUrl={`/api/partners/${partner.id}/qr`}
          publicSiteUrl={publicSiteUrl}
        />
      </div>
    </AdminShell>
  );
}

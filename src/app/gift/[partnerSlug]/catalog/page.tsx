export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { CatalogScreen } from "@/components/landing/screens/CatalogScreen";

export default async function PartnerCatalogPage({
  params,
}: {
  params: Promise<{ partnerSlug: string }>;
}) {
  const { partnerSlug } = await params;
  const { data, partnerId } = await loadLandingViewProps(partnerSlug);
  return (
    <CatalogScreen data={data} partnerSlug={partnerSlug} partnerId={partnerId} />
  );
}

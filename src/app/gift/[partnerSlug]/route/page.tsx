export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { RouteScreen } from "@/components/landing/screens/RouteScreen";

export default async function PartnerRoutePage({
  params,
}: {
  params: Promise<{ partnerSlug: string }>;
}) {
  const { partnerSlug } = await params;
  const { data, partnerId } = await loadLandingViewProps(partnerSlug);
  return (
    <RouteScreen data={data} partnerSlug={partnerSlug} partnerId={partnerId} />
  );
}

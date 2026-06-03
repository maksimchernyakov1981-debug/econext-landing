export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { DiscountScreen } from "@/components/landing/screens/DiscountScreen";

export default async function PartnerDiscountPage({
  params,
}: {
  params: Promise<{ partnerSlug: string }>;
}) {
  const { partnerSlug } = await params;
  const { data, partnerId } = await loadLandingViewProps(partnerSlug);
  return (
    <DiscountScreen data={data} partnerSlug={partnerSlug} partnerId={partnerId} />
  );
}

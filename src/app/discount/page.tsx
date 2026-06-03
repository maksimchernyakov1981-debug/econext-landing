export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { DiscountScreen } from "@/components/landing/screens/DiscountScreen";

export default async function DiscountPage() {
  const { data, partnerId } = await loadLandingViewProps(null);
  return <DiscountScreen data={data} partnerSlug={null} partnerId={partnerId} />;
}

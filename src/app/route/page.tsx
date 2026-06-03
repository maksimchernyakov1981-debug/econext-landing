export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { RouteScreen } from "@/components/landing/screens/RouteScreen";

export default async function RoutePage() {
  const { data, partnerId } = await loadLandingViewProps(null);
  return <RouteScreen data={data} partnerSlug={null} partnerId={partnerId} />;
}

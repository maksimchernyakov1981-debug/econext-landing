export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { CatalogScreen } from "@/components/landing/screens/CatalogScreen";

export default async function CatalogPage() {
  const { data, partnerId } = await loadLandingViewProps(null);
  return <CatalogScreen data={data} partnerSlug={null} partnerId={partnerId} />;
}

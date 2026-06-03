export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { LandingHome } from "@/components/landing/LandingHome";
import { PageTracker } from "@/components/landing/PageTracker";

export default async function HomePage() {
  const { data, partnerId } = await loadLandingViewProps(null);

  return (
    <>
      <PageTracker partnerId={partnerId} />
      <LandingHome data={data} partnerSlug={null} />
    </>
  );
}

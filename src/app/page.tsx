export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { LandingAccordion } from "@/components/landing/LandingAccordion";
import { PageTracker } from "@/components/landing/PageTracker";

export default async function HomePage() {
  const { data, partnerId } = await loadLandingViewProps(null);

  return (
    <>
      <PageTracker partnerId={partnerId} />
      <LandingAccordion data={data} />
    </>
  );
}

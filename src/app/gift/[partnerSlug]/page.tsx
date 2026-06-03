export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { LandingAccordion } from "@/components/landing/LandingAccordion";
import { PageTracker } from "@/components/landing/PageTracker";

export default async function GiftPage({
  params,
}: {
  params: Promise<{ partnerSlug: string }>;
}) {
  const { partnerSlug } = await params;
  const { data, partnerId } = await loadLandingViewProps(partnerSlug);

  return (
    <>
      <PageTracker partnerId={partnerId} />
      <LandingAccordion data={data} />
    </>
  );
}

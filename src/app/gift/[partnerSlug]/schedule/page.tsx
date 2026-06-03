export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { ScheduleScreen } from "@/components/landing/screens/ScheduleScreen";

export default async function PartnerSchedulePage({
  params,
}: {
  params: Promise<{ partnerSlug: string }>;
}) {
  const { partnerSlug } = await params;
  const { data, partnerId } = await loadLandingViewProps(partnerSlug);
  return (
    <ScheduleScreen data={data} partnerSlug={partnerSlug} partnerId={partnerId} />
  );
}

export const dynamic = "force-dynamic";

import { loadLandingViewProps } from "@/lib/load-landing-page";
import { ScheduleScreen } from "@/components/landing/screens/ScheduleScreen";

export default async function SchedulePage() {
  const { data, partnerId } = await loadLandingViewProps(null);
  return <ScheduleScreen data={data} partnerSlug={null} partnerId={partnerId} />;
}

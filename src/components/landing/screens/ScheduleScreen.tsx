import { landingHomeHref } from "@/lib/landing-paths";
import { ContactFooter } from "../ContactFooter";
import { LandingScreenLayout } from "../LandingScreenLayout";
import { ScreenTracker } from "../ScreenTracker";
import type { LandingViewProps } from "../types";

export function ScheduleScreen({
  data,
  partnerSlug,
  partnerId,
}: {
  data: LandingViewProps;
  partnerSlug: string | null;
  partnerId: number | null;
}) {
  return (
    <LandingScreenLayout
      title={data.landing.scheduleBlockTitle}
      backLabel={data.buttons.backButtonText}
      backHref={landingHomeHref(partnerSlug)}
    >
      <ScreenTracker eventType="click_schedule" partnerId={partnerId} />
      {data.specialDay?.description && (
        <p className="text-sm font-medium text-amber-800 rounded-xl bg-amber-50 border border-amber-100 p-3">
          {data.landing.scheduleSpecialDayPrefix} {data.specialDay.description}
        </p>
      )}
      <pre className="text-sm mt-4 whitespace-pre-wrap font-sans leading-relaxed">
        {data.fullScheduleText}
      </pre>
      <ContactFooter data={data} />
    </LandingScreenLayout>
  );
}

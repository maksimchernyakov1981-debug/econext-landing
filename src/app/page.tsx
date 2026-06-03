import { getLandingContext } from "@/lib/landing-data";
import { LandingView } from "@/components/landing/LandingView";
import { PageTracker } from "@/components/landing/PageTracker";

export default async function HomePage() {
  const ctx = await getLandingContext(null);

  return (
    <>
      <PageTracker partnerId={null} />
      <LandingView
        data={{
          partner: null,
          landing: ctx.landing,
          buttons: ctx.buttons,
          map: ctx.map,
          catalog: ctx.catalog,
          contacts: ctx.contacts,
          workStatus: ctx.workStatus,
          fullScheduleText: ctx.fullScheduleText,
          specialDay: ctx.specialDay,
        }}
      />
    </>
  );
}

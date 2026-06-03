export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { getLandingContext, getPartnerBySlug } from "@/lib/landing-data";
import { LandingView } from "@/components/landing/LandingView";
import { PageTracker } from "@/components/landing/PageTracker";
export default async function GiftPage({
  params,
}: {
  params: Promise<{ partnerSlug: string }>;
}) {
  const { partnerSlug } = await params;
  const partner = await getPartnerBySlug(partnerSlug);

  if (!partner) notFound();

  if (!partner.isActive) {
    redirect("/");
  }

  const ctx = await getLandingContext(partner);

  return (
    <>
      <PageTracker partnerId={partner.id} />
      <LandingView
        data={{
          partner,
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

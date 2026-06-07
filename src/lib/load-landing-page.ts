import { notFound, redirect } from "next/navigation";
import type { LandingViewProps } from "@/components/landing/types";
import { getLandingContext, getPartnerBySlug } from "./landing-data";
import { resolveSchemeImageUrl } from "./media-url";

export async function loadLandingViewProps(
  partnerSlug: string | null
): Promise<{ data: LandingViewProps; partnerId: number | null }> {
  let partner = null;
  if (partnerSlug) {
    partner = await getPartnerBySlug(partnerSlug);
    if (!partner) notFound();
    if (!partner.isActive) redirect("/");
  }

  const ctx = await getLandingContext(partner);

  return {
    partnerId: partner?.id ?? null,
    data: {
      partner,
      landing: ctx.landing,
      buttons: ctx.buttons,
      map: ctx.map,
      catalog: ctx.catalog,
      contacts: ctx.contacts,
      workStatus: {
        ...ctx.workStatus,
        schemeImageUrl: resolveSchemeImageUrl(ctx.workStatus.schemeImageUrl),
      },
      fullScheduleText: ctx.fullScheduleText,
      specialDay: ctx.specialDay,
      storeMedia: ctx.storeMedia,
    },
  };
}

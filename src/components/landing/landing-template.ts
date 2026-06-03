import { replaceTemplateVars } from "@/lib/templates";
import type { LandingViewProps } from "./types";

export function buildTemplateContext(data: LandingViewProps) {
  const p = data.partner;
  return {
    partner_name: p?.name ?? "",
    store_name: data.map.storeName,
    address: data.workStatus.address,
    landmark: data.workStatus.landmark ?? "",
    today_schedule: data.workStatus.todaySchedule,
    work_status: data.workStatus.title,
  };
}

export function landingHeroTexts(data: LandingViewProps) {
  const p = data.partner;
  const ctx = buildTemplateContext(data);
  return {
    heroTitle: replaceTemplateVars(
      p?.customHeroTitle || data.landing.heroTitle,
      ctx
    ),
    heroSubtitle: replaceTemplateVars(
      p?.customHeroSubtitle || data.landing.heroSubtitle,
      ctx
    ),
    heroDesc: replaceTemplateVars(
      p?.customHeroDescription || data.landing.heroDescription,
      ctx
    ),
    partnerLine: p
      ? replaceTemplateVars(data.landing.partnerLineTemplate, ctx)
      : null,
    ctx,
  };
}

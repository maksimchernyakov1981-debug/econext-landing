export type LandingSection = "discount" | "catalog" | "route" | "schedule";

export function landingBasePath(partnerSlug: string | null | undefined): string {
  return partnerSlug ? `/gift/${partnerSlug}` : "";
}

export function landingSectionHref(
  partnerSlug: string | null | undefined,
  section: LandingSection
): string {
  const base = landingBasePath(partnerSlug);
  return base ? `${base}/${section}` : `/${section}`;
}

export function landingHomeHref(partnerSlug: string | null | undefined): string {
  return landingBasePath(partnerSlug) || "/";
}

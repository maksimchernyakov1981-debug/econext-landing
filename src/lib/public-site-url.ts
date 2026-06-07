const DEFAULT_PRODUCTION_SITE = "https://econext-landing.vercel.app";

function cleanUrl(value: string | undefined): string {
  if (!value) return "";
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v.replace(/\/$/, "");
}

function isLocalUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Публичный URL сайта для QR, ссылок партнёров и печати (не localhost в админке). */
export function getPublicSiteUrl(): string {
  const base = cleanUrl(process.env.BASE_URL);
  const production = cleanUrl(process.env.PRODUCTION_URL) || DEFAULT_PRODUCTION_SITE;
  const vercel = process.env.VERCEL_URL
    ? cleanUrl(`https://${process.env.VERCEL_URL}`)
    : "";

  if (base && !isLocalUrl(base)) {
    return base.startsWith("http") ? base : `https://${base}`;
  }
  if (vercel && !isLocalUrl(vercel)) return vercel;
  return production.startsWith("http") ? production : `https://${production}`;
}

export function partnerLandingUrl(slug: string): string {
  return `${getPublicSiteUrl()}/gift/${slug}`;
}

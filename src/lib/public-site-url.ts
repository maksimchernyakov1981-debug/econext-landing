/** Боевой сайт — всегда Vercel, никогда localhost. */
export const PRODUCTION_SITE_URL = "https://econext-landing.vercel.app";

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

function normalizeHttp(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

/**
 * Публичный URL для QR, ссылок партнёров и печати.
 * Никогда не возвращает localhost — только боевой домен.
 */
export function getPublicSiteUrl(): string {
  const candidates = [
    cleanUrl(process.env.PRODUCTION_URL),
    cleanUrl(process.env.BASE_URL),
    process.env.VERCEL_URL ? cleanUrl(`https://${process.env.VERCEL_URL}`) : "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? cleanUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
      : "",
  ];

  for (const raw of candidates) {
    if (raw && !isLocalUrl(raw)) {
      return normalizeHttp(raw);
    }
  }

  return PRODUCTION_SITE_URL;
}

export function partnerLandingUrl(slug: string): string {
  return `${getPublicSiteUrl()}/gift/${slug}`;
}

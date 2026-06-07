/**
 * Публичный домен лендинга для QR и ссылок партнёров.
 * Важно: никогда не использовать VERCEL_URL — это URL конкретного деплоя
 * с «Vercel Authentication», гости видят экран «войти в Vercel».
 */
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

/** URL вида *-git-* или *-team.vercel.app часто защищены Vercel Authentication. */
function isProtectedDeploymentUrl(url: string): boolean {
  try {
    const host = new URL(normalizeHttp(url)).hostname;
    if (isLocalUrl(host)) return true;
    // Продакшен-алиас проекта: econext-landing.vercel.app — публичный
    if (host === "econext-landing.vercel.app") return false;
    // Остальные *.vercel.app — часто preview/deployment с защитой
    if (host.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return true;
  }
}

function normalizeHttp(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

/**
 * URL для QR, ссылок партнёров и печати.
 * Только публичный домен — без localhost и без VERCEL_URL деплоя.
 */
export function getPublicSiteUrl(): string {
  const candidates = [
    cleanUrl(process.env.PRODUCTION_URL),
    cleanUrl(process.env.BASE_URL),
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? cleanUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
      : "",
  ];

  for (const raw of candidates) {
    if (raw && !isProtectedDeploymentUrl(raw)) {
      return normalizeHttp(raw);
    }
  }

  return PRODUCTION_SITE_URL;
}

export function partnerLandingUrl(slug: string): string {
  return `${getPublicSiteUrl()}/gift/${slug}`;
}

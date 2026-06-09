import { ensureDbReady } from "./ensure-db";
import { prisma } from "./prisma";
import {
  getCachedSitePublicUrl,
  loadSettingsSnapshot,
  useVercelSettingsBackup,
} from "./settings-backup";

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
    if (host === "econext-landing.vercel.app") return false;
    if (host.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return true;
  }
}

function normalizeHttp(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

function pickPublicUrl(candidates: (string | undefined | null)[]): string | null {
  for (const raw of candidates) {
    const cleaned = cleanUrl(raw ?? "");
    if (cleaned && !isProtectedDeploymentUrl(cleaned)) {
      return normalizeHttp(cleaned);
    }
  }
  return null;
}

function envFallbackUrl(): string {
  return (
    pickPublicUrl([
      process.env.PRODUCTION_URL,
      process.env.BASE_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "",
    ]) ?? PRODUCTION_SITE_URL
  );
}

/**
 * URL для QR, ссылок партнёров и печати.
 * Сначала домен из админки (Blob/SQLite), затем .env, затем дефолт.
 */
export function getPublicSiteUrl(): string {
  return (
    pickPublicUrl([getCachedSitePublicUrl()]) ??
    envFallbackUrl()
  );
}

/** Асинхронно: прочитать домен из БД/Blob (для SSR-страниц админки). */
export async function resolvePublicSiteUrl(): Promise<string> {
  if (useVercelSettingsBackup()) {
    const snap = await loadSettingsSnapshot();
    const fromSnap = pickPublicUrl([snap?.site?.publicSiteUrl]);
    if (fromSnap) return fromSnap;
  }

  await ensureDbReady();
  try {
    const row = await prisma.siteSettings.findFirst({ where: { id: 1 } });
    const fromDb = pickPublicUrl([row?.publicSiteUrl]);
    if (fromDb) return fromDb;
  } catch {
    /* таблица ещё не создана */
  }

  return envFallbackUrl();
}

export function partnerLandingUrl(slug: string): string {
  return `${getPublicSiteUrl()}/gift/${slug}`;
}

export async function partnerLandingUrlAsync(slug: string): Promise<string> {
  return `${await resolvePublicSiteUrl()}/gift/${slug}`;
}

export function mainLandingUrl(): string {
  const base = getPublicSiteUrl();
  return base.endsWith("/") ? base : `${base}/`;
}

export async function mainLandingUrlAsync(): Promise<string> {
  const base = await resolvePublicSiteUrl();
  return base.endsWith("/") ? base : `${base}/`;
}

export function getEnv(key: string, fallback?: string): string {
  const v = process.env[key] ?? fallback;
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

/** Убирает пробелы и кавычки, которые часто попадают из Vercel UI */
function cleanEnvValue(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

import { getPublicSiteUrl } from "./public-site-url";

export const env = {
  /** Для QR и ссылок партнёров — боевой домен, не localhost. */
  baseUrl: () => getPublicSiteUrl(),
  timezone: () => process.env.APP_TIMEZONE ?? "Europe/Moscow",
  adminLogin: () =>
    cleanEnvValue(
      process.env.ADMIN_LOGIN ?? process.env.ADMIN_USERNAME,
      "admin"
    ),
  adminPassword: () =>
    cleanEnvValue(
      process.env.ADMIN_PASSWORD ??
        process.env.ADMIN_PASS ??
        process.env.ADMIN_PWD,
      "change_me"
    ),
  sessionSecret: () =>
    cleanEnvValue(
      process.env.SESSION_SECRET ?? process.env.IRON_SESSION_SECRET,
      "dev-secret-change-me-min-32-chars!!"
    ),
  ipHashSalt: () => process.env.IP_HASH_SALT ?? "dev-salt",
  uploadMaxMb: () => Number(process.env.UPLOAD_MAX_SIZE_MB ?? 50),
};

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

export const env = {
  baseUrl: () => process.env.BASE_URL ?? "http://localhost:3000",
  timezone: () => process.env.APP_TIMEZONE ?? "Europe/Moscow",
  adminLogin: () =>
    cleanEnvValue(
      process.env.ADMIN_LOGIN ?? process.env.ADMIN_USERNAME,
      "admin"
    ),
  adminPassword: () => cleanEnvValue(process.env.ADMIN_PASSWORD, "change_me"),
  sessionSecret: () => process.env.SESSION_SECRET ?? "dev-secret-change-me",
  ipHashSalt: () => process.env.IP_HASH_SALT ?? "dev-salt",
  uploadMaxMb: () => Number(process.env.UPLOAD_MAX_SIZE_MB ?? 5),
};

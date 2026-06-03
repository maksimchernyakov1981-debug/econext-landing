export function getEnv(key: string, fallback?: string): string {
  const v = process.env[key] ?? fallback;
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

export const env = {
  baseUrl: () => process.env.BASE_URL ?? "http://localhost:3000",
  timezone: () => process.env.APP_TIMEZONE ?? "Europe/Moscow",
  adminLogin: () => process.env.ADMIN_LOGIN ?? "admin",
  adminPassword: () => process.env.ADMIN_PASSWORD ?? "change_me",
  sessionSecret: () => process.env.SESSION_SECRET ?? "dev-secret-change-me",
  ipHashSalt: () => process.env.IP_HASH_SALT ?? "dev-salt",
  uploadMaxMb: () => Number(process.env.UPLOAD_MAX_SIZE_MB ?? 5),
};

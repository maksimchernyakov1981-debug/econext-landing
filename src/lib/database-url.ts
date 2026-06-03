/**
 * Локально: file:./prisma/dev.db
 * Vercel: file:/tmp/econext.db (единственная запись на serverless)
 */
export function resolveDatabaseUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (process.env.VERCEL === "1") {
    if (fromEnv?.startsWith("file:")) return fromEnv;
    return "file:/tmp/econext.db";
  }
  return fromEnv || "file:./dev.db";
}

export function applyDatabaseUrl(): void {
  process.env.DATABASE_URL = resolveDatabaseUrl();
}

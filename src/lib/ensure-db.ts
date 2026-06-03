import { execSync } from "child_process";
import { applyDatabaseUrl } from "./database-url";

let initPromise: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  if (!initPromise) {
    initPromise = initDb();
  }
  return initPromise;
}

async function initDb(): Promise<void> {
  applyDatabaseUrl();

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    await prisma.partner.count();
    await prisma.$disconnect();
    return;
  } catch {
    await prisma.$disconnect().catch(() => {});
  }

  execSync("npx prisma db push --skip-generate", {
    stdio: "pipe",
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  });

  const check = new PrismaClient();
  const partners = await check.partner.count().catch(() => 0);
  await check.$disconnect();

  if (partners === 0) {
    execSync("npx prisma db seed", {
      stdio: "pipe",
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });
  }
}

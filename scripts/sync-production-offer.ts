/**
 * Логин в прод-админку и применение текстов оффера (в т.ч. Blob на Vercel).
 * npx tsx scripts/sync-production-offer.ts
 */
import { readFile } from "fs/promises";
import path from "path";

async function loadEnvFile(): Promise<void> {
  const text = await readFile(path.join(process.cwd(), ".env"), "utf8").catch(() => "");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

function pickCookie(setCookie: string | null): string {
  if (!setCookie) return "";
  return setCookie
    .split(/,(?=[^;]+?=)/)
    .map((c) => c.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

async function main() {
  await loadEnvFile();

  const base =
    process.env.PRODUCTION_URL?.trim() ||
    "https://econext-landing.vercel.app";
  const login = process.env.ADMIN_LOGIN?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!login || !password) {
    console.error("Нужны ADMIN_LOGIN и ADMIN_PASSWORD в .env");
    process.exit(1);
  }

  console.log("Сайт:", base);

  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });

  if (!loginRes.ok) {
    const err = await loginRes.text();
    console.error("Ошибка входа:", loginRes.status, err);
    process.exit(1);
  }

  const cookie = pickCookie(loginRes.headers.get("set-cookie"));
  if (!cookie) {
    console.error("Не получена cookie сессии");
    process.exit(1);
  }

  console.log("Вход выполнен, применяю тексты...");

  const applyRes = await fetch(`${base}/api/admin/apply-offer-texts`, {
    method: "POST",
    headers: { Cookie: cookie },
  });

  const body = await applyRes.json().catch(() => ({}));
  if (!applyRes.ok) {
    console.error("Ошибка применения:", applyRes.status, body);
    process.exit(1);
  }

  console.log("Готово:", body.message ?? body);
  if (body.heroTitle) console.log("Hero:", body.heroTitle);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

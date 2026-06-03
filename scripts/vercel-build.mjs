import { execSync } from "child_process";

// Prisma требует postgresql:// при generate; на Vercel переменная должна быть задана в Settings
if (!process.env.DATABASE_URL) {
  console.warn(
    "[vercel-build] DATABASE_URL не задан — используется заглушка только для generate. " +
      "Обязательно добавьте Neon URL в Vercel → Environment Variables!"
  );
  process.env.DATABASE_URL =
    "postgresql://build:build@127.0.0.1:5432/build?schema=public";
} else if (
  !process.env.DATABASE_URL.startsWith("postgresql://") &&
  !process.env.DATABASE_URL.startsWith("postgres://")
) {
  console.error(
    "[vercel-build] DATABASE_URL должен начинаться с postgresql:// (Neon). " +
      "Сейчас указан неверный формат (возможно SQLite file:./)."
  );
  process.exit(1);
}

execSync("npx prisma generate", { stdio: "inherit" });
execSync("npx next build", { stdio: "inherit" });

import { execSync } from "child_process";
import { existsSync, copyFileSync } from "fs";

const prodDb = "prisma/prod.db";
// Путь относительно prisma/schema.prisma → файл prisma/prod.db в проекте
const buildDb = "file:./prod.db";

process.env.DATABASE_URL = buildDb;

console.log("[vercel-build] prisma generate...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("[vercel-build] create prod.db with schema + seed...");
execSync("npx prisma db push --skip-generate", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: buildDb },
});
execSync("npx prisma db seed", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: buildDb },
});

if (!existsSync(prodDb)) {
  throw new Error("prod.db was not created");
}

console.log("[vercel-build] next build...");
execSync("npx next build", { stdio: "inherit" });

console.log("[vercel-build] done, prod.db size:", existsSync(prodDb));

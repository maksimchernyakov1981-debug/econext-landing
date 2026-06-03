import { execSync } from "child_process";

process.env.DATABASE_URL =
  process.env.DATABASE_URL || "file:/tmp/econext.db";

execSync("npx prisma generate", { stdio: "inherit" });
execSync("npx next build", { stdio: "inherit" });

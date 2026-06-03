export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { ensureDbReady } = await import("./lib/ensure-db");
      await ensureDbReady();
    } catch (e) {
      console.error("[instrumentation] DB init failed:", e);
    }
  }
}

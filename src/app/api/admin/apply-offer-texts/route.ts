import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ensureDbReady } from "@/lib/ensure-db";
import {
  mergeOfferTextsIntoSnapshot,
  offerLandingTexts,
} from "@/lib/offer-texts";
import { prisma } from "@/lib/prisma";
import { revalidateAllLanding } from "@/lib/revalidate-landing";
import {
  applySnapshotToPrisma,
  captureSettingsSnapshot,
  clearSettingsSnapshotCache,
  loadSettingsSnapshot,
  persistAndVerifySnapshot,
  useVercelSettingsBackup,
} from "@/lib/settings-backup";

export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureDbReady();
    clearSettingsSnapshotCache();

    if (useVercelSettingsBackup()) {
      const current = (await loadSettingsSnapshot()) ?? (await captureSettingsSnapshot());
      const snapshot = mergeOfferTextsIntoSnapshot(current);

      const verified = await persistAndVerifySnapshot(snapshot);
      if (!verified.ok) {
        return NextResponse.json(
          {
            error:
              verified.message ??
              "Не сохранено в Blob. Проверьте Vercel Storage.",
          },
          { status: 500 }
        );
      }

    } else {
      const snapshot = mergeOfferTextsIntoSnapshot(await captureSettingsSnapshot());
      await applySnapshotToPrisma(snapshot);
    }

    await revalidateAllLanding();

    return NextResponse.json({
      ok: true,
      message: "Тексты оффера применены на сайте",
      heroTitle: offerLandingTexts.heroTitle,
      verifiedHero: useVercelSettingsBackup()
        ? (await loadSettingsSnapshot())?.landing.heroTitle
        : undefined,
      savedAt: useVercelSettingsBackup()
        ? (await loadSettingsSnapshot())?.savedAt
        : undefined,
    });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("[apply-offer-texts]", e);
    return NextResponse.json(
      { error: "Ошибка применения текстов", detail },
      { status: 500 }
    );
  }
}

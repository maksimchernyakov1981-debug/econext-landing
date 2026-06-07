import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ensureDbReady } from "@/lib/ensure-db";
import {
  offerButtonTexts,
  offerLandingTexts,
  offerQrTexts,
} from "@/lib/offer-texts";
import { prisma } from "@/lib/prisma";
import { revalidateAllLanding } from "@/lib/revalidate-landing";
import {
  captureSettingsSnapshot,
  clearSettingsSnapshotCache,
  persistAndVerifySnapshot,
} from "@/lib/settings-backup";

export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureDbReady();

    await prisma.landingSettings.update({
      where: { id: 1 },
      data: offerLandingTexts,
    });
    await prisma.buttonSettings.update({
      where: { id: 1 },
      data: offerButtonTexts,
    });
    await prisma.qrCardSettings.update({
      where: { id: 1 },
      data: offerQrTexts,
    });

    await revalidateAllLanding();

    if (process.env.VERCEL === "1") {
      clearSettingsSnapshotCache();
      const snapshot = await captureSettingsSnapshot();
      const verified = await persistAndVerifySnapshot(snapshot);
      if (!verified.ok) {
        return NextResponse.json(
          {
            error:
              verified.message ??
              "Тексты в БД обновлены, но не сохранились в Blob. Проверьте Storage.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Тексты оффера применены на сайте",
      heroTitle: offerLandingTexts.heroTitle,
    });
  } catch (e) {
    console.error("[apply-offer-texts]", e);
    return NextResponse.json({ error: "Ошибка применения текстов" }, { status: 500 });
  }
}

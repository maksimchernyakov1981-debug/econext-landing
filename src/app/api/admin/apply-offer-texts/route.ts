import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ensureDbReady } from "@/lib/ensure-db";
import {
  offerButtonTexts,
  offerLandingTexts,
  offerQrTexts,
  sanitizePartnerOfferOverrides,
} from "@/lib/offer-texts";
import { prisma } from "@/lib/prisma";
import { revalidateAllLanding } from "@/lib/revalidate-landing";
import {
  captureSettingsSnapshot,
  clearSettingsSnapshotCache,
  hydratePrismaFromSnapshot,
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
      const snapshot = {
        ...current,
        landing: { ...current.landing, ...offerLandingTexts },
        buttons: { ...current.buttons, ...offerButtonTexts },
        qr: { ...current.qr, ...offerQrTexts },
        partners: sanitizePartnerOfferOverrides(current.partners ?? []),
      };

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

      if (verified.snapshot) {
        await hydratePrismaFromSnapshot(verified.snapshot);
      }
    } else {
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
      const partners = await prisma.partner.findMany();
      for (const p of sanitizePartnerOfferOverrides(partners)) {
        await prisma.partner.update({
          where: { id: p.id },
          data: {
            customHeroTitle: p.customHeroTitle,
            customHeroSubtitle: p.customHeroSubtitle,
            customHeroDescription: p.customHeroDescription,
            customGiftText: p.customGiftText,
            customQrText: p.customQrText,
          },
        });
      }
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
    console.error("[apply-offer-texts]", e);
    return NextResponse.json({ error: "Ошибка применения текстов" }, { status: 500 });
  }
}

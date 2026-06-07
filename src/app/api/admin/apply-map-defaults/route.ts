import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ensureDbReady } from "@/lib/ensure-db";
import { mapStoreDefaults, mergeMapDefaultsIntoSnapshot } from "@/lib/map-defaults";
import { prisma } from "@/lib/prisma";
import { revalidateAllLanding } from "@/lib/revalidate-landing";
import { ensureSqliteSchemaMigrations, filterMapSettingsForSqlite } from "@/lib/ensure-schema";
import {
  applySnapshotToPrisma,
  captureSettingsSnapshot,
  clearSettingsSnapshotCache,
  loadSettingsSnapshot,
  normalizeMapRow,
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
      const snapshot = mergeMapDefaultsIntoSnapshot(current);
      snapshot.map = normalizeMapRow(snapshot.map as never);

      const verified = await persistAndVerifySnapshot(snapshot);
      if (!verified.ok) {
        return NextResponse.json(
          { error: verified.message ?? "Не сохранено в Blob" },
          { status: 500 }
        );
      }
    } else {
      await ensureSqliteSchemaMigrations();
      await prisma.mapSettings.update({
        where: { id: 1 },
        data: await filterMapSettingsForSqlite({
          ...mapStoreDefaults,
          mapSchemeIsActive: true,
          mapSchemeImageUrl: null,
        }),
      });
      const snapshot = mergeMapDefaultsIntoSnapshot(await captureSettingsSnapshot());
      await applySnapshotToPrisma(snapshot);
    }

    await revalidateAllLanding();

    return NextResponse.json({
      ok: true,
      message: "Адрес и ссылки на карты применены",
      address: mapStoreDefaults.address,
      yandexMapsUrl: mapStoreDefaults.yandexMapsUrl,
    });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("[apply-map-defaults]", e);
    return NextResponse.json(
      { error: "Ошибка применения карт", detail },
      { status: 500 }
    );
  }
}

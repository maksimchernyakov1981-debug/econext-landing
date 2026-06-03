"use client";

import type { MapSettings } from "@prisma/client";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateMaps } from "../actions";

const fields = [
  { name: "storeName", label: "Название точки" },
  { name: "address", label: "Адрес", type: "textarea" as const },
  { name: "landmark", label: "Ориентир", type: "textarea" as const },
  { name: "yandexMapsUrl", label: "Яндекс Карты" },
  { name: "yandexNavigatorUrl", label: "Яндекс Навигатор" },
  { name: "twoGisUrl", label: "2ГИС" },
  { name: "googleMapsUrl", label: "Google Maps" },
  { name: "mapSchemeImageUrl", label: "URL схемы (или загрузите ниже)" },
  { name: "mapSchemeCaption", label: "Подпись схемы" },
  { name: "mapSchemeIsActive", label: "Показывать схему", type: "checkbox" as const },
];

export function MapsForm({ initial }: { initial: MapSettings }) {
  return (
    <div>
      <RecordForm
        fields={fields}
        initial={initial as unknown as Record<string, unknown>}
        action={updateMaps}
      />
      <UploadScheme />
    </div>
  );
}

function UploadScheme() {
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "map_scheme");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) {
      const input = document.querySelector<HTMLInputElement>('input[name="mapSchemeImageUrl"]');
      if (input) input.value = json.url;
      alert("Загружено. Нажмите Сохранить.");
    }
  }
  return (
    <label className="block mt-4 text-sm">
      Загрузить схему
      <input type="file" accept="image/*" className="mt-1" onChange={onUpload} />
    </label>
  );
}

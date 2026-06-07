"use client";

import type { MapSettings } from "@prisma/client";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateMaps } from "../actions";

const fields = [
  { name: "storeName", label: "Название точки" },
  { name: "address", label: "Адрес", type: "textarea" as const },
  { name: "landmark", label: "Ориентир", type: "textarea" as const },
  { name: "yandexMapsUrl", label: "Яндекс Карты (для виджета и кнопки)", type: "url" as const },
  {
    name: "yandexNavigatorUrl",
    label: "Яндекс Навигатор (ссылка из «Поделиться» — на лендинге откроет Навигатор с маршрутом)",
    type: "url" as const,
  },
  { name: "twoGisUrl", label: "2ГИС", type: "url" as const },
  { name: "googleMapsUrl", label: "Google Maps", type: "url" as const },
  {
    name: "mapDisplayMode",
    label: "Блок «Схема» на лендинге",
    type: "select" as const,
    options: [
      { value: "auto", label: "Авто: Яндекс → 2ГИС → картинка" },
      { value: "yandex", label: "Яндекс Карты (живая карта, зум пальцами)" },
      { value: "2gis", label: "2ГИС (живая карта)" },
      { value: "image", label: "Картинка-схема (загрузка ниже)" },
    ],
  },
  { name: "mapSchemeImageUrl", label: "URL картинки схемы (если режим «Картинка»)" },
  { name: "mapSchemeCaption", label: "Подпись под картой/схемой" },
  { name: "mapSchemeIsActive", label: "Показывать картинку-схему", type: "checkbox" as const },
];

export function MapsForm({ initial }: { initial: MapSettings }) {
  return (
    <div>
      <p className="text-sm text-muted mb-4">
        Для <strong>Яндекс</strong> и <strong>2ГИС</strong> вставьте ссылку из «Поделиться» на точку.
        На лендинге кнопка <strong>Яндекс Карты</strong> построит маршрут в приложении Карт, а{" "}
        <strong>Яндекс Навигатор</strong> — в отдельном приложении Навигатор. Картинку-схему можно
        оставить как запасной вариант.
      </p>
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
    if (json.error) {
      alert(json.error);
      return;
    }
    if (json.url) {
      const input = document.querySelector<HTMLInputElement>('input[name="mapSchemeImageUrl"]');
      if (input) input.value = json.url;
      alert(
        "Схема загружена в облако. Нажмите «Сохранить» в форме ниже и дождитесь «Сохранено в облако»."
      );
    }
  }
  return (
    <label className="block mt-4 text-sm">
      Загрузить схему
      <input type="file" accept="image/*" className="mt-1" onChange={onUpload} />
    </label>
  );
}

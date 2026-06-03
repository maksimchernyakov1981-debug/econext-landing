"use client";

import { RecordForm } from "@/components/admin/RecordForm";
import { saveMediaAsset } from "../actions";

export function MediaForm() {
  return (
    <div>
      <RecordForm
        fields={[
          {
            name: "type",
            label: "Тип",
            type: "select",
            options: [
              { value: "logo", label: "logo" },
              { value: "hero", label: "hero" },
              { value: "store_photo", label: "store_photo" },
              { value: "landmark_photo", label: "landmark_photo" },
              { value: "qr_card_background", label: "qr_card_background" },
            ],
          },
          { name: "title", label: "Название" },
          { name: "url", label: "URL" },
          { name: "altText", label: "Alt" },
          { name: "sortOrder", label: "Порядок", type: "number" },
          { name: "isActive", label: "Активно", type: "checkbox" },
        ]}
        initial={{ isActive: true, sortOrder: 0, type: "logo" }}
        action={(data) => saveMediaAsset(null, data)}
        submitLabel="Добавить"
      />
      <UploadMedia />
    </div>
  );
}

function UploadMedia() {
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = (document.querySelector<HTMLSelectElement>('select[name="type"]')?.value) || "hero";
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) {
      const input = document.querySelector<HTMLInputElement>('input[name="url"]');
      if (input) input.value = json.url;
    }
  }
  return (
    <label className="block mt-4 text-sm">
      Загрузить файл
      <input type="file" accept="image/*" className="mt-1" onChange={onUpload} />
    </label>
  );
}

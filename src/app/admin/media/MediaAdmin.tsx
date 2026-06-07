"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MediaAsset } from "@prisma/client";
import { RecordForm } from "@/components/admin/RecordForm";
import { deleteMediaAsset, saveMediaAsset } from "../actions";
import { resolveMediaUrl } from "@/lib/media-url";

const TYPE_OPTIONS = [
  { value: "store_photo", label: "Фото точки" },
  { value: "store_video", label: "Видео точки" },
  { value: "landmark_photo", label: "Фото ориентира" },
  { value: "hero", label: "Hero (запас)" },
  { value: "logo", label: "Логотип (запас)" },
];

export function MediaAdmin({ items }: { items: MediaAsset[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const type =
        (document.querySelector<HTMLSelectElement>('select[name="type"]')?.value) ||
        "store_photo";
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setUploadErr(json.error || "Ошибка загрузки");
        return;
      }
      if (json.url) {
        const input = document.querySelector<HTMLInputElement>('input[name="url"]');
        if (input) input.value = json.url;
        if (!document.querySelector<HTMLInputElement>('input[name="title"]')?.value) {
          const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
          if (titleInput) titleInput.value = file.name.replace(/\.[^.]+$/, "");
        }
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Удалить этот файл?")) return;
    const res = await deleteMediaAsset(id);
    if (res.error) alert(res.error);
    else router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Добавить фото или видео</h2>
        <p className="text-sm text-muted mb-4">
          «Фото точки» и «Видео точки» показываются на лендинге под схемой прохода. После
          добавления нажмите «Добавить» и «Применить на сайте».
        </p>
        <RecordForm
          fields={[
            {
              name: "type",
              label: "Тип",
              type: "select",
              options: TYPE_OPTIONS,
            },
            { name: "title", label: "Подпись (необязательно)" },
            { name: "url", label: "URL (заполнится после загрузки)" },
            { name: "altText", label: "Alt для фото" },
            { name: "sortOrder", label: "Порядок (0 — первым)", type: "number" },
            { name: "isActive", label: "Показывать на лендинге", type: "checkbox" },
          ]}
          initial={{ isActive: true, sortOrder: 0, type: "store_photo" }}
          action={(data) => saveMediaAsset(null, data)}
          submitLabel="Добавить"
        />
        <label className="block mt-4 text-sm">
          Загрузить файл с компьютера
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            className="mt-1 block w-full text-sm"
            onChange={onUpload}
            disabled={uploading}
          />
          {uploading && <span className="text-muted">Загрузка…</span>}
          {uploadErr && <p className="text-red-600 text-sm mt-1">{uploadErr}</p>}
        </label>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Загруженные файлы ({items.length})</h2>
        {items.length === 0 && (
          <p className="text-sm text-muted">Пока нет медиа — добавьте фото или видео выше.</p>
        )}
        <ul className="space-y-4">
          {items.map((m) => {
            const src = resolveMediaUrl(m.url);
            return (
              <li key={m.id} className="border rounded-xl p-3 bg-white">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <p className="font-medium text-sm">
                      {TYPE_OPTIONS.find((o) => o.value === m.type)?.label ?? m.type}
                      {m.title ? `: ${m.title}` : ""}
                    </p>
                    <p className="text-xs text-muted break-all">{m.url}</p>
                    <p className="text-xs mt-1">{m.isActive ? "✅ на лендинге" : "— скрыто"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(m.id)}
                    className="text-red-600 text-sm shrink-0"
                  >
                    Удалить
                  </button>
                </div>
                {src && m.type === "store_video" ? (
                  <video src={src} controls className="w-full max-h-48 rounded-lg bg-black" />
                ) : src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={m.altText || m.title || ""} className="w-full max-h-48 object-cover rounded-lg" />
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@prisma/client";
import { put } from "@vercel/blob/client";
import { deleteAllMediaAssets, deleteMediaAsset } from "../actions";
import { resolveMediaUrl } from "@/lib/media-url";
import { isVideoMime, mimeFromFilename } from "@/lib/upload-mime";

const TYPE_OPTIONS = [
  { value: "store_photo", label: "Фото точки" },
  { value: "store_video", label: "Видео точки" },
  { value: "landmark_photo", label: "Фото ориентира" },
];

const BLOB_DIRECT_THRESHOLD = 4 * 1024 * 1024;

export function MediaAdmin({ items }: { items: MediaAsset[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState("store_photo");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const [blobDirect, setBlobDirect] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => setBlobDirect(Boolean(j.blobConfigured)))
      .catch(() => setBlobDirect(false));
  }, []);

  function resolveType(file: File): string {
    const mime = mimeFromFilename(file.name) ?? file.type;
    if (mime?.startsWith("video/")) return "store_video";
    if (mediaType === "store_video" && mime?.startsWith("image/")) return "store_photo";
    return mediaType;
  }

  async function registerMedia(url: string, type: string, title: string) {
    const res = await fetch("/api/admin/media-register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, type, title }),
    });
    const json = await res.json();
    if (!res.ok && res.status !== 207) {
      return json.error || "Ошибка сохранения";
    }
    return null;
  }

  async function uploadViaServer(file: File, type: string): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/admin/media-upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const json = await res.json();
    if (!res.ok && res.status !== 207) {
      return json.error || "Ошибка загрузки";
    }
    if (json.errors?.length) return json.errors.join("; ");
    return null;
  }

  async function uploadViaBlob(file: File, type: string): Promise<string | null> {
    const tokenRes = await fetch("/api/admin/blob-client-token", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        type,
        multipart: file.size > BLOB_DIRECT_THRESHOLD,
      }),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      return tokenJson.error || "Не удалось получить токен загрузки";
    }

    const blob = await put(tokenJson.pathname, file, {
      access: "public",
      token: tokenJson.clientToken,
      multipart: file.size > BLOB_DIRECT_THRESHOLD,
      contentType: tokenJson.mime || file.type || undefined,
    });

    return registerMedia(
      blob.url,
      type,
      file.name.replace(/\.[^.]+$/, "")
    );
  }

  async function uploadOne(file: File): Promise<string | null> {
    const type = resolveType(file);

    if (file.size <= BLOB_DIRECT_THRESHOLD) {
      return uploadViaServer(file, type);
    }

    if (blobDirect) {
      try {
        const err = await uploadViaBlob(file, type);
        if (!err) return null;
        const fallback = await uploadViaServer(file, type);
        return fallback ?? `${err} (и серверная загрузка не удалась)`;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "ошибка Blob";
        const fallback = await uploadViaServer(file, type);
        return fallback ?? msg;
      }
    }

    return uploadViaServer(file, type);
  }

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list?.length) return;

    setUploadErr("");
    setUploading(true);
    const errors: string[] = [];

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setProgress(`Загрузка ${i + 1} из ${list.length}: ${file.name}`);
      try {
        const err = await uploadOne(file);
        if (err) errors.push(`${file.name}: ${err}`);
      } catch (err) {
        errors.push(
          `${file.name}: ${err instanceof Error ? err.message : "ошибка"}`
        );
      }
    }

    setUploading(false);
    setProgress("");
    if (errors.length) setUploadErr(errors.join("\n"));
    else router.refresh();
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onDelete(id: number) {
    if (!confirm("Удалить этот файл?")) return;
    const res = await deleteMediaAsset(id);
    if (res.error) alert(res.error);
    else router.refresh();
  }

  async function onDeleteAll() {
    if (!items.length) return;
    if (!confirm(`Удалить все ${items.length} файлов?`)) return;
    const res = await deleteAllMediaAssets();
    if (res.error) alert(res.error);
    else router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Загрузить фото и видео</h2>
        <p className="text-sm text-muted mb-4">
          Можно выбрать сразу несколько файлов — они сохранятся автоматически и появятся на
          лендинге под схемой прохода.
        </p>

        <label className="block text-sm mb-3">
          Тип по умолчанию
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="mt-1 w-full border rounded-xl px-3 py-2 text-base"
            disabled={uploading}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,.mp4,.mov,.webm"
          className="block w-full text-sm"
          onChange={onPickFiles}
          disabled={uploading}
        />

        {uploading && (
          <p className="text-sm text-primary mt-2">{progress || "Загрузка…"}</p>
        )}
        {uploadErr && (
          <pre className="text-red-600 text-xs mt-2 whitespace-pre-wrap">{uploadErr}</pre>
        )}
        {blobDirect && (
          <p className="text-xs text-muted mt-2">
            Большие файлы (&gt;4 МБ) загружаются напрямую в облако Vercel Blob.
          </p>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-3 gap-2">
          <h2 className="font-semibold">Загруженные файлы ({items.length})</h2>
          {items.length > 0 && (
            <button
              type="button"
              onClick={onDeleteAll}
              className="text-red-600 text-sm font-medium shrink-0"
            >
              Удалить все
            </button>
          )}
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted">Пока нет медиа — загрузите файлы выше.</p>
        )}

        <ul className="space-y-4">
          {items.map((m) => {
            const src = resolveMediaUrl(m.url);
            const isVideo =
              m.type === "store_video" || isVideoMime(mimeFromFilename(m.url) ?? "");
            return (
              <li key={m.id} className="border rounded-xl p-3 bg-white">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <p className="font-medium text-sm">
                      {TYPE_OPTIONS.find((o) => o.value === m.type)?.label ?? m.type}
                      {m.title ? `: ${m.title}` : ""}
                    </p>
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
                {src && isVideo ? (
                  <video src={src} controls className="w-full max-h-48 rounded-lg bg-black" />
                ) : src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={m.altText || m.title || ""}
                    className="w-full max-h-48 object-cover rounded-lg"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

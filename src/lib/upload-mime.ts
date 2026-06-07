const EXT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export function mimeFromFilename(name: string): string | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MIME[ext] ?? null;
}

export function resolveUploadMime(file: { type: string; name: string }): string | null {
  const fromName = mimeFromFilename(file.name);
  if (file.type && file.type !== "application/octet-stream") {
    if (fromName && !file.type.startsWith(fromName.split("/")[0])) {
      return fromName;
    }
    return file.type;
  }
  return fromName;
}

export function extForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "video/webm") return "webm";
  if (mime === "video/quicktime") return "mov";
  if (mime === "video/mp4") return "mp4";
  return "jpg";
}

export const UPLOAD_MIME_ALLOW = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export function isVideoMime(mime: string): boolean {
  return mime.startsWith("video/");
}

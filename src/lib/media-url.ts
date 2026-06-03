/** Публичный URL картинки на лендинге (схема и т.п.). */
export function resolveSchemeImageUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();

  const fromPath = u.match(/uploads\/([a-z0-9_-]+)\/([^/?#]+)/i);
  if (fromPath) {
    return `/api/uploads/${fromPath[1]}/${fromPath[2]}`;
  }

  if (u.startsWith("/api/uploads/")) return u;

  if (u.startsWith("http://") || u.startsWith("https://")) {
    if (u.includes("blob.vercel-storage.com")) {
      return `/api/image-proxy?src=${encodeURIComponent(u)}`;
    }
    return u;
  }

  if (u.startsWith("/")) return u;
  return null;
}

export function isAllowedImageProxyUrl(src: string): boolean {
  try {
    const u = new URL(src);
    if (u.hostname.endsWith(".public.blob.vercel-storage.com")) return true;
    if (u.hostname.endsWith(".blob.vercel-storage.com")) return true;
    return false;
  } catch {
    return false;
  }
}

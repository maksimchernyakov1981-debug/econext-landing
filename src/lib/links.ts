export function resolveLink(
  partnerValue?: string | null,
  globalValue?: string | null
): string | null {
  const p = partnerValue?.trim();
  if (p) return p;
  const g = globalValue?.trim();
  return g || null;
}

export function isValidExternalUrl(value: string): boolean {
  const v = value.trim();
  return (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("tg:") ||
    v.startsWith("tel:") ||
    v.startsWith("max:") ||
    v.startsWith("viber:")
  );
}

/** Добавляет https:// к ссылкам без протокола (t.me/..., www.site.ru). */
export function normalizeExternalUrl(value: string): string | null {
  let v = value.trim();
  if (!v) return null;

  if (/^t\.me\//i.test(v)) v = `https://${v}`;
  if (/^www\./i.test(v)) v = `https://${v}`;

  if (!/^[a-z][a-z0-9+.-]*:/i.test(v)) {
    v = `https://${v}`;
  }

  // Убираем случайный символ в конце при вставке из буфера
  v = v.replace(/[;,]+$/g, "");

  return isValidExternalUrl(v) ? v : null;
}

export function telLink(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

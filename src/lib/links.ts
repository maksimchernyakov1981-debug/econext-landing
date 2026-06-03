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
    v.startsWith("tel:")
  );
}

export function telLink(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

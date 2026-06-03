const RESERVED = new Set(["admin", "api", "gift", "new", "edit"]);

export function slugify(name: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return name
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function validateSlug(slug: string): string | null {
  const s = slug.trim().toLowerCase();
  if (s.length < 3 || s.length > 50) return "Slug: от 3 до 50 символов";
  if (!/^[a-z0-9-]+$/.test(s)) return "Только a-z, 0-9 и дефис";
  if (RESERVED.has(s)) return "Этот slug зарезервирован";
  return null;
}

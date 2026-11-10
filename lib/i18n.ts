// Situs publik dua bahasa (K-17). Inggris = default tanpa prefix URL, Indonesia di /id.
export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Teks yang punya versi per bahasa (dipakai di content/ dan nanti kolom jsonb {en,id} di DB). */
export type Localized<T = string> = Record<Locale, T>;

/** Path publik untuk sebuah locale: en → "/about", id → "/id/about". */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

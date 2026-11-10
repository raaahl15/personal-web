import { locales, type Locale } from "@/lib/i18n";
import type { Period } from "@/content/profile";

/** Navigasi utama situs publik (urutan = urutan di navbar). */
export const NAV_ITEMS = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "portfolio", path: "/portfolio" },
  { key: "contact", path: "/contact" },
] as const;

/**
 * Path tanpa prefix bahasa: "/id/about" → "/about", "/en/about" → "/about".
 * Aman dipakai untuk URL asli maupun URL hasil rewrite proxy.ts.
 */
export function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname || "/";
}

export function isActivePath(current: string, target: string): boolean {
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}

const monthFmt = (lang: Locale) =>
  new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

function formatYm(ym: string, lang: Locale): string {
  const [y, m] = ym.split("-").map(Number);
  return monthFmt(lang).format(new Date(Date.UTC(y, m - 1, 1)));
}

/** "Jun 2025 — Present" / "Jun 2025 — Sekarang". */
export function formatPeriod(period: Period, lang: Locale, presentLabel: string): string {
  const start = formatYm(period.start, lang);
  if (period.end === period.start) return start;
  return `${start} — ${period.end ? formatYm(period.end, lang) : presentLabel}`;
}

export const yearOf = (ym: string) => ym.slice(0, 4);

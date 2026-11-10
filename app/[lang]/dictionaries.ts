import "server-only";
import type { Locale } from "@/lib/i18n";

// Teks UI situs publik per bahasa. Konten profil/CV ada di content/profile.ts.
const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  id: () => import("./dictionaries/id.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();

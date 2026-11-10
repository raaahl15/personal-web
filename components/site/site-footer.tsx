import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { NAV_ITEMS } from "@/lib/site";
import { profile } from "@/content/profile";

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 pt-6 pb-10 text-sm sm:px-6 md:flex-row md:justify-between">
      <p className="text-subtle">
        © 2026 {profile.shortName} · {dict.footer.location}
      </p>
      <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-medium text-muted-foreground">
        {NAV_ITEMS.map((item) => (
          <li key={item.key}>
            <Link href={localePath(lang, item.path)} className="rounded hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none">
              {dict.nav[item.key]}
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-subtle">{dict.footer.built} · EN / ID</p>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";
import { NAV_ITEMS, isActivePath, stripLocale } from "@/lib/site";
import { cn } from "@/lib/utils";

type Labels = Record<(typeof NAV_ITEMS)[number]["key"], string>;

/** Link navbar desktop dengan indikator aktif berbentuk pil. */
export function NavLinks({ lang, labels }: { lang: Locale; labels: Labels }) {
  const current = stripLocale(usePathname());
  return (
    <ul className="flex items-center gap-1 rounded-full bg-muted p-1">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(current, item.path);
        return (
          <li key={item.key}>
            <Link
              href={localePath(lang, item.path)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition-[background-color,color,box-shadow] duration-300 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                active && "bg-card font-semibold text-foreground shadow-sm",
              )}
            >
              {labels[item.key]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Switch EN | ID yang mempertahankan halaman yang sedang dibuka. */
export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const rest = stripLocale(usePathname());
  const options: Locale[] = ["en", "id"];
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5 rounded-full bg-muted p-1">
      {options.map((l) => (
        <Link
          key={l}
          href={localePath(l, rest)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={cn(
            "grid h-11 min-w-11 place-items-center rounded-full px-3 text-[13px] font-medium text-subtle uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-9 md:min-w-9",
            l === lang && "bg-card font-semibold text-foreground shadow-sm",
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

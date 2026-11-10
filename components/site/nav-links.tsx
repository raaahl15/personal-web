"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, locales, type Locale } from "@/lib/i18n";
import { NAV_ITEMS, isActivePath, stripLocale } from "@/lib/site";
import { cn } from "@/lib/utils";

type Labels = Record<(typeof NAV_ITEMS)[number]["key"], string>;

/** Link navbar desktop; indikator aktif berbentuk pil yang BERGESER antar-link. */
export function NavLinks({ lang, labels }: { lang: Locale; labels: Labels }) {
  const current = stripLocale(usePathname());
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const activeIndex = NAV_ITEMS.findIndex((item) => isActivePath(current, item.path));

  // Posisi indikator diatur langsung di DOM (tanpa state) → tidak ada render ulang.
  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const target = list.querySelectorAll<HTMLAnchorElement>("a")[activeIndex];
    if (!target) {
      indicator.style.opacity = "0";
      return;
    }
    indicator.style.opacity = "1";
    indicator.style.width = `${target.offsetWidth}px`;
    indicator.style.transform = `translateX(${target.offsetLeft - 4}px)`;
    // Posisi pertama tanpa animasi; setelahnya bergeser.
    requestAnimationFrame(() => indicator.setAttribute("data-ready", ""));
  }, [activeIndex]);

  return (
    <ul ref={listRef} className="relative flex items-center gap-1 rounded-full bg-muted p-1">
      <span
        ref={indicatorRef}
        aria-hidden
        className="absolute top-1 bottom-1 left-1 rounded-full bg-card opacity-0 shadow-sm data-ready:transition-[transform,width] data-ready:duration-500 data-ready:ease-[cubic-bezier(0.34,1.3,0.64,1)]"
      />
      {NAV_ITEMS.map((item, i) => {
        const active = i === activeIndex;
        return (
          <li key={item.key}>
            <Link
              href={localePath(lang, item.path)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative z-10 block rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-300 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                active && "text-foreground",
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

export const LANG_SCROLL_KEY = "lang-scroll";

/**
 * Switch EN | ID yang mempertahankan halaman & posisi scroll.
 * Ganti bahasa = ganti root layout ([lang]) → dokumen baru; dibuat halus lewat:
 * <a> biasa (tanpa fetch RSC sia-sia), thumb langsung bergeser, crossfade View Transitions
 * (globals.css), posisi scroll dipulihkan (script di layout), dan prerender saat hover.
 */
export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const rest = stripLocale(usePathname());
  const [selected, setSelected] = useState<Locale>(lang);

  // Kembali lewat tombol Back (bfcache) → thumb kembali ke bahasa halaman ini.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setSelected(lang);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, [lang]);

  function onSwitch(target: Locale, href: string, e: React.MouseEvent<HTMLAnchorElement>) {
    if (target === lang || e.metaKey || e.ctrlKey || e.shiftKey) return;
    setSelected(target);
    try {
      sessionStorage.setItem(LANG_SCROLL_KEY, JSON.stringify({ path: href, y: window.scrollY }));
    } catch {}
  }

  return (
    <div role="group" aria-label={label} className="relative flex items-center gap-0.5 rounded-full bg-muted p-1">
      <span
        aria-hidden
        className={cn(
          "absolute top-1 left-1 h-11 w-11 rounded-full bg-card shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] md:h-9 md:w-10",
          selected === "id" ? "translate-x-[46px] md:translate-x-[42px]" : "translate-x-0",
        )}
      />
      {locales.map((l) => {
        const href = localePath(l, rest);
        return (
          <a
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            onClick={(e) => onSwitch(l, href, e)}
            className={cn(
              "relative z-10 grid h-11 w-11 place-items-center rounded-full text-[13px] font-medium text-subtle uppercase transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-9 md:w-10",
              l === selected && "font-semibold text-foreground",
            )}
          >
            {l}
          </a>
        );
      })}
    </div>
  );
}

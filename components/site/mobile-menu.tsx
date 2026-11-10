"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { localePath, type Locale } from "@/lib/i18n";
import { NAV_ITEMS, isActivePath, stripLocale } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangSwitch } from "./nav-links";

type Labels = {
  home: string;
  about: string;
  portfolio: string;
  contact: string;
  menu: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  letsTalk: string;
};

/**
 * Menu layar penuh untuk mobile. Pakai <dialog> bawaan: fokus terkunci di dalam,
 * Escape menutup, dan fokus kembali ke tombol pembuka.
 */
export function MobileMenu({ lang, labels }: { lang: Locale; labels: Labels }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const current = stripLocale(pathname);

  // Tutup saat pindah halaman.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={labels.openMenu}
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-full bg-muted text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.menu}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-background p-4 text-foreground backdrop:bg-transparent open:flex open:flex-col"
      >
        <div className="flex items-center justify-between rounded-full bg-muted p-1.5 pl-5">
          <span className="font-heading text-lg font-medium">{labels.menu}</span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.closeMenu}
            className="grid size-11 place-items-center rounded-full bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav className="mt-10 px-2">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => {
              const active = isActivePath(current, item.path);
              return (
                <li key={item.key} className="animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
                  <Link
                    href={localePath(lang, item.path)}
                    aria-current={active ? "page" : undefined}
                    onClick={() => dialogRef.current?.close()}
                    className={cn(
                      "block py-1 font-heading text-5xl font-light outline-none focus-visible:underline",
                      active ? "text-primary" : "text-foreground",
                    )}
                  >
                    {labels[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-4 px-2 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-muted-foreground">{labels.language}</span>
            <LangSwitch lang={lang} label={labels.language} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-muted-foreground">{labels.theme}</span>
            <ThemeToggle lightLabel={labels.light} darkLabel={labels.dark} />
          </div>
          <Link
            href={localePath(lang, "/contact")}
            onClick={() => dialogRef.current?.close()}
            className="mt-2 flex h-14 items-center justify-between rounded-full bg-primary pr-2 pl-6 font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {labels.letsTalk}
            <span className="grid size-10 place-items-center rounded-full bg-primary-foreground text-primary">
              <ArrowUpRight className="size-5" aria-hidden />
            </span>
          </Link>
        </div>
      </dialog>
    </>
  );
}

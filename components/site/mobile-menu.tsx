"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import { localePath, type Locale } from "@/lib/i18n";
import { NAV_ITEMS, isActivePath, stripLocale } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LinkedinIcon } from "./icons";
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
 * Menu layar penuh untuk HP/tablet (desain v1.0 "Menu open — Mobile 375", diperhalus).
 * <dialog> bawaan: fokus terkunci, Escape menutup, fokus kembali ke tombol pembuka.
 * Animasi buka/tutup & stagger baris ada di globals.css (.menu-sheet, .menu-item).
 */
export function MobileMenu({
  lang,
  labels,
  name,
  email,
  linkedin,
}: {
  lang: Locale;
  labels: Labels;
  name: string;
  email: string;
  linkedin: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const current = stripLocale(pathname);
  const close = () => dialogRef.current?.close();

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
        className="grid size-11 place-items-center rounded-full bg-muted text-foreground outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.menu}
        className="menu-sheet m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 text-foreground backdrop:bg-transparent"
      >
        <div className="relative isolate flex min-h-full flex-col bg-background px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
          {/* dekorasi lembut di latar */}
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-backdrop opacity-60 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 -left-24 -z-10 size-72 rounded-full bg-backdrop opacity-40 blur-3xl" />

          <div className="glass flex items-center justify-between rounded-full p-1.5">
            <span className="flex items-center gap-3">
              <span aria-hidden className="grid size-11 place-items-center rounded-full bg-linear-to-br from-sky-500 to-sky-750 font-heading font-semibold text-sky-50">
                RG
              </span>
              <span className="font-heading text-lg font-medium">{name}</span>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={labels.closeMenu}
              className="grid size-11 place-items-center rounded-full bg-muted outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav aria-label={labels.menu} className="mt-6">
            <ol>
              {NAV_ITEMS.map((item, i) => {
                const active = isActivePath(current, item.path);
                return (
                  <li key={item.key} className="menu-item border-b last:border-b-0" style={{ "--i": i } as React.CSSProperties}>
                    <Link
                      href={localePath(lang, item.path)}
                      aria-current={active ? "page" : undefined}
                      onClick={close}
                      className="group flex items-center gap-4 rounded-2xl py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="w-6 text-xs font-semibold text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "flex-1 font-heading text-[2.5rem] leading-none font-light tracking-tight transition-transform duration-300 group-active:translate-x-1",
                          active ? "text-primary" : "text-foreground",
                        )}
                      >
                        {labels[item.key]}
                      </span>
                      <span
                        className={cn(
                          "grid size-11 place-items-center rounded-full transition-colors",
                          active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                        )}
                      >
                        <ArrowUpRight className="size-5" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <div className="menu-item flex flex-col rounded-[28px] bg-card px-4 py-1.5" style={{ "--i": 4 } as React.CSSProperties}>
              <div className="flex items-center justify-between gap-4 border-b py-2.5">
                <span className="text-[15px] font-medium text-muted-foreground">{labels.language}</span>
                <LangSwitch lang={lang} label={labels.language} />
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-[15px] font-medium text-muted-foreground">{labels.theme}</span>
                <ThemeToggle lightLabel={labels.light} darkLabel={labels.dark} />
              </div>
            </div>

            <Link
              href={localePath(lang, "/contact")}
              onClick={close}
              style={{ "--i": 5 } as React.CSSProperties}
              className="menu-item group flex h-14 items-center justify-between rounded-full bg-primary pr-2 pl-6 font-semibold text-primary-foreground outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {labels.letsTalk}
              <span className="grid size-10 place-items-center rounded-full bg-primary-foreground text-primary">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
            </Link>

            <div className="menu-item flex items-center justify-center gap-2 pt-1 text-sm" style={{ "--i": 6 } as React.CSSProperties}>
              <a href={`mailto:${email}`} className="flex h-11 items-center gap-2 rounded-full px-3 font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Mail className="size-4" aria-hidden /> Email
              </a>
              <span aria-hidden className="text-subtle">·</span>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center gap-2 rounded-full px-3 font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <LinkedinIcon className="size-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

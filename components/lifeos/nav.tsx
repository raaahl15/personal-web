"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Ellipsis,
  FolderClosed,
  LayoutDashboard,
  SlidersHorizontal,
  SquareCheckBig,
  TrendingUp,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon; shortcut?: string };

// Urutan = sidebar desain v1.0 (Sidebar/LifeOS). K-25.
export const MODULES: Item[] = [
  { href: "/app", label: "Hari ini", icon: LayoutDashboard },
  { href: "/app/journal", label: "Jurnal", icon: BookOpen },
  { href: "/app/tasks", label: "Tasks", icon: SquareCheckBig },
  { href: "/app/projects", label: "Projects", icon: FolderClosed },
  { href: "/app/money", label: "Money", icon: Wallet },
  { href: "/app/money/invest", label: "Invest", icon: TrendingUp },
];
const SETTINGS: Item = { href: "/app/settings", label: "Pengaturan", icon: SlidersHorizontal };

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  if (href === "/app/money") return pathname.startsWith("/app/money") && !pathname.startsWith("/app/money/invest");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sidebar & bottom nav dibaca pathname-nya di dalam <Suspense> (rute dinamis seperti
 * /app/projects/[id] tidak tahu pathname saat prerender). Fallback = navigasi yang sama tanpa
 * penanda aktif, jadi kerangka tetap tampil seketika.
 */
export function Sidebar({ avatar }: { avatar: React.ReactNode }) {
  return <SidebarView avatar={avatar} pathname={usePathname()} />;
}
export function SidebarStatic({ avatar }: { avatar: React.ReactNode }) {
  return <SidebarView avatar={avatar} pathname="" />;
}
export function BottomNav() {
  return <BottomNavView pathname={usePathname()} />;
}
export function BottomNavStatic() {
  return <BottomNavView pathname="" />;
}

/** Sidebar pil vertikal (desktop ≥ md). Ikon + tooltip; aria-label di setiap item. */
function SidebarView({ avatar, pathname }: { avatar: React.ReactNode; pathname: string }) {
  const navItem = (item: Item) => {
    const active = isActive(pathname, item.href);
    const Icon = item.icon;
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group/item relative grid size-14 place-items-center rounded-full text-muted-foreground outline-none transition-[background-color,color] duration-300 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
            active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <Icon className="size-6" strokeWidth={1.75} aria-hidden />
          {/* Tooltip (hover & fokus keyboard) */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[calc(100%+14px)] -translate-x-1 rounded-[10px] bg-foreground px-3 py-2 text-[13px] font-medium whitespace-nowrap text-background opacity-0 shadow-lg transition-[opacity,transform] duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100"
          >
            {item.label}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <aside className="glass fixed inset-y-6 left-6 z-40 hidden w-20 flex-col items-center justify-between rounded-[40px] p-3 md:flex">
      <div className="flex flex-col items-center gap-7">
        <Link
          href="/app"
          aria-label="Life OS — Hari ini"
          className="grid size-14 place-items-center rounded-full bg-linear-to-br from-sky-500 to-sky-750 font-heading text-lg font-semibold text-sky-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          RG
        </Link>
        <nav aria-label="Modul Life OS">
          <ul className="flex flex-col items-center gap-2">{MODULES.map(navItem)}</ul>
        </nav>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ul>{navItem(SETTINGS)}</ul>
        <ThemeToggle vertical lightLabel="Mode terang" darkLabel="Mode gelap" />
        {avatar}
      </div>
    </aside>
  );
}

/** Navigasi bawah (HP < md): 4 modul utama + "Lainnya" (bottom nav ≤ 5 item, K-25). */
function BottomNavView({ pathname }: { pathname: string }) {
  const sheetRef = useRef<HTMLDialogElement>(null);
  const primary = [MODULES[0], MODULES[1], MODULES[2], MODULES[4]];
  const more = [MODULES[3], MODULES[5], SETTINGS];
  const moreActive = more.some((i) => isActive(pathname, i.href));

  useEffect(() => {
    sheetRef.current?.close();
  }, [pathname]);

  return (
    <>
      <nav
        aria-label="Modul Life OS"
        className="glass fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 rounded-full p-2 md:hidden"
      >
        <ul className="flex items-center justify-between">
          {primary.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 text-muted-foreground outline-none transition-[background-color,color,padding] duration-300 focus-visible:ring-2 focus-visible:ring-ring",
                    active && "bg-primary px-4 text-primary-foreground",
                  )}
                >
                  <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden />
                  {active && <span className="text-[13px] font-semibold">{item.label}</span>}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => sheetRef.current?.showModal()}
              aria-label="Lainnya"
              aria-haspopup="dialog"
              className={cn(
                "grid h-12 min-w-12 place-items-center rounded-full text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
                moreActive && "bg-primary-soft text-foreground",
              )}
            >
              <Ellipsis className="size-[22px]" aria-hidden />
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={sheetRef}
        aria-label="Lainnya"
        onClick={(e) => {
          if (e.target === e.currentTarget) sheetRef.current?.close();
        }}
        className="menu-sheet mx-0 mt-auto mb-0 max-h-none w-full max-w-none bg-transparent p-0 text-foreground backdrop:bg-sky-950/40 backdrop:backdrop-blur-sm"
      >
        <div className="rounded-t-[32px] bg-card px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" aria-hidden />
          <div className="mb-3 flex items-center justify-between">
            <p className="font-heading text-xl font-medium">Lainnya</p>
            <button
              type="button"
              onClick={() => sheetRef.current?.close()}
              aria-label="Tutup"
              className="grid size-11 place-items-center rounded-full bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {more.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="menu-item" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-14 items-center gap-4 rounded-[18px] px-4 text-[15px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-primary-soft" : "hover:bg-muted",
                    )}
                  >
                    <Icon className="size-[22px] text-primary" strokeWidth={1.75} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="menu-item mt-3 flex items-center justify-between rounded-[18px] bg-muted px-4 py-2" style={{ "--i": 3 } as React.CSSProperties}>
            <span className="text-[15px] font-medium">Tema</span>
            <ThemeToggle lightLabel="Mode terang" darkLabel="Mode gelap" className="bg-background" />
          </div>
        </div>
      </dialog>
    </>
  );
}

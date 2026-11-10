"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export const THEME_STORAGE_KEY = "theme";
type Theme = "light" | "dark";

const currentTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

// Sumber kebenaran = kelas .dark di <html>; semua toggle (navbar & menu mobile) ikut berubah.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

/**
 * Toggle tema berbentuk pil (sun | moon), desain v1.0.
 * Ganti tema memakai View Transitions: lingkaran membesar dari tombol yang diklik (K-11).
 * Tanpa dukungan API / dengan prefers-reduced-motion → langsung ganti.
 */
export function ThemeToggle({
  lightLabel,
  darkLabel,
  className,
}: {
  lightLabel: string;
  darkLabel: string;
  className?: string;
}) {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light" as Theme);

  // Strict Mode (dev) me-reset atribut <html>; terapkan ulang sebelum paint.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", readStoredTheme() === "dark");
  }, []);

  function apply(next: Theme, event: React.MouseEvent<HTMLButtonElement>) {
    if (next === currentTheme()) return;
    const commit = () => {
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {}
    };

    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      commit();
      return;
    }

    // Fallback (Safari < 18 dll.): crossfade warna singkat, bukan ganti mendadak.
    if (!document.startViewTransition) {
      root.classList.add("theme-fade");
      commit();
      window.setTimeout(() => root.classList.remove("theme-fade"), 400);
      return;
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.classList.add("theme-vt");
    const transition = document.startViewTransition(() => flushSync(commit));
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
    transition.finished.finally(() => root.classList.remove("theme-vt"));
  }

  const item = (value: Theme, label: string, Icon: typeof Sun) => (
    <button
      type="button"
      onClick={(e) => apply(value, e)}
      aria-label={label}
      aria-pressed={theme === value}
      title={label}
      className={cn(
        "relative z-10 grid size-11 place-items-center rounded-full text-subtle outline-none focus-visible:ring-2 focus-visible:ring-ring md:size-9",
        theme === value && "text-primary",
      )}
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  );

  return (
    <div role="group" className={cn("relative flex items-center gap-1 rounded-full bg-muted p-1", className)}>
      {/* Thumb yang bergeser di belakang ikon aktif */}
      <span
        aria-hidden
        className={cn(
          "vt-keep absolute top-1 left-1 size-11 rounded-full bg-card shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] md:size-9",
          theme === "dark" ? "translate-x-12 md:translate-x-10" : "translate-x-0",
        )}
      />
      {item("light", lightLabel, Sun)}
      {item("dark", darkLabel, Moon)}
    </div>
  );
}

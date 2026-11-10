"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Animasi lingkaran membesar (K-11) ditambahkan saat desain final; ini versi dasar.
export const THEME_STORAGE_KEY = "theme";

function applyStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch {}
}

export function ThemeToggle({ label }: { label: string }) {
  // Strict Mode (dev) me-reset atribut <html>; terapkan ulang sebelum paint.
  useLayoutEffect(applyStoredTheme, []);

  function toggle() {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={label} title={label} className="size-11 rounded-full">
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <Moon className="size-5 dark:hidden" aria-hidden />
    </Button>
  );
}

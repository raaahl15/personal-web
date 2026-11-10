import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccountEmail } from "@/components/lifeos/user";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "Pengaturan" };

// Pengaturan — Fase 2: akun, tampilan, keluar. Konteks task, kategori, akun uang, dan export
// data ditambahkan bersama modulnya (Fase 3–7).
export default function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-subtle">Life OS</p>
        <h1 className="mt-1 text-[clamp(2.25rem,4vw,2.75rem)] leading-tight font-light">Pengaturan</h1>
      </div>

      <section className="flex flex-col rounded-[32px] bg-card px-6 py-2 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b py-5">
          <span className="text-[15px] text-muted-foreground">Akun</span>
          <Suspense fallback={<span className="h-5 w-48 animate-pulse rounded-full bg-muted" />}>
            <AccountEmail />
          </Suspense>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b py-4">
          <span className="text-[15px] text-muted-foreground">Tema</span>
          <ThemeToggle lightLabel="Mode terang" darkLabel="Mode gelap" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <span className="text-[15px] text-muted-foreground">Situs publik</span>
          <Link
            href="/"
            className="flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-primary outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            Buka <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <form action={signOut}>
        <button
          type="submit"
          className="flex h-12 items-center gap-2 rounded-full border-[1.5px] border-warm/40 px-6 text-[15px] font-semibold text-warm outline-none hover:bg-warm-soft focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="size-4" aria-hidden /> Keluar
        </button>
      </form>
    </div>
  );
}

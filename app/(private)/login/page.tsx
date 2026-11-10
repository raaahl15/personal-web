import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginCard } from "./login-card";

export const metadata: Metadata = { title: "Masuk" };

// Login — desain v1.0 (FigCraft "Login — Desktop 1440"). Selalu gelap (kelas .dark lokal, K-28).
// Sudah login → proxy.ts mengarahkan ke /app.
export default function LoginPage() {
  return (
    <div className="dark relative isolate flex min-h-dvh flex-col overflow-hidden bg-linear-to-br from-sky-950 via-sky-850 to-sky-750 px-4 py-6 text-foreground sm:px-8">
      <div aria-hidden className="pointer-events-none absolute -top-48 -right-40 -z-10 size-[56rem] rounded-full bg-[radial-gradient(circle,rgb(61_155_255/0.33),transparent_65%)]" />
      <Link
        href="/"
        className="flex w-fit items-center gap-2 rounded-full py-2 text-sm font-medium text-sky-250 outline-none hover:text-sky-100 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden /> Kembali ke website
      </Link>
      <main className="flex flex-1 animate-page items-center justify-center py-8">
        <Suspense fallback={<div className="glass h-[640px] w-full max-w-[1100px] rounded-[40px]" />}>
          <LoginCard configured={isSupabaseConfigured} />
        </Suspense>
      </main>
    </div>
  );
}

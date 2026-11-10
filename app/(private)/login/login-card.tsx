"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn, type LoginState } from "./actions";

/**
 * Kartu login (desain v1.0 "Login — Desktop 1440"): form + panel overlay biru.
 * Panel menggeser kiri↔kanan (600ms) dengan crossfade teks (400ms) antara
 * "Life OS" (pemilik) dan pesan untuk pengunjung (K-11). Hanya satu akun.
 */
export function LoginCard({ configured }: { configured: boolean }) {
  const next = useSearchParams().get("next") ?? "/app";
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  const [visitor, setVisitor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="glass relative w-full max-w-[1100px] overflow-hidden rounded-[32px] md:min-h-[640px] md:rounded-[40px]">
      <div className="grid md:grid-cols-2">
        {/* Form (kiri) */}
        <form
          action={action}
          aria-hidden={visitor}
          inert={visitor}
          className={cn(
            "flex flex-col justify-center gap-5 p-7 transition-opacity duration-400 sm:p-12 md:p-16",
            visitor && "opacity-0 md:opacity-100",
          )}
        >
          <div>
            <h1 className="text-[2.75rem] leading-tight font-light">Selamat datang</h1>
            <p className="mt-1 text-muted-foreground">Masuk ke Life OS</p>
          </div>

          {!configured && (
            <p role="status" className="rounded-2xl bg-warm-soft p-4 text-sm leading-relaxed text-warm">
              Supabase belum dikonfigurasi. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
              <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (lihat MASTER.md).
            </p>
          )}

          <input type="hidden" name="next" value={next} />
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              defaultValue={state.email}
              className="h-13 rounded-[14px] border-[1.5px] bg-muted px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                aria-invalid={state.error ? true : undefined}
                aria-describedby={state.error ? "login-error" : undefined}
                className="h-13 w-full rounded-[14px] border-[1.5px] bg-muted pr-14 pl-4 text-base outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showPassword ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
              </button>
            </div>
          </div>

          {state.error && (
            <p id="login-error" role="alert" className="text-sm font-medium text-warm">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !configured}
            className="mt-1 flex h-13 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground outline-none transition-[filter,opacity] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {pending && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
            {pending ? "Memeriksa…" : "Masuk"}
          </button>

          <button
            type="button"
            onClick={() => setVisitor(true)}
            className="h-11 text-sm font-semibold text-primary outline-none focus-visible:underline md:hidden"
          >
            Cuma mampir? Lihat portfolio
          </button>
        </form>

        {/* Kolom kanan: tautan untuk pengunjung (tertutup panel saat mode pemilik) */}
        <nav
          aria-label="Situs publik"
          aria-hidden={!visitor}
          inert={!visitor}
          className="hidden flex-col justify-center gap-3 p-16 md:flex"
        >
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-subtle uppercase">Jelajahi situs</p>
          {[
            ["/portfolio", "Portfolio", "Project & karya"],
            ["/id/about", "Tentang", "Pendidikan & pengalaman"],
            ["/id/contact", "Kontak", "Kirim pesan"],
          ].map(([href, title, sub]) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-[20px] bg-card p-5 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>
                <span className="block font-heading text-xl font-medium">{title}</span>
                <span className="block text-sm text-subtle">{sub}</span>
              </span>
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </Link>
          ))}
        </nav>

        {/* Panel overlay (kanan → geser ke kiri saat mode pengunjung) */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden rounded-l-[120px] bg-linear-to-br from-sky-750 via-sky-700 to-sky-600 text-white transition-[transform,border-radius] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] md:block",
            visitor && "-translate-x-full rounded-l-none rounded-r-[120px]",
          )}
        >
          <PanelContent show={!visitor}>
            <p className="font-heading text-6xl font-light">Life OS</p>
            <p className="max-w-sm text-[17px] leading-relaxed text-sky-50">
              Ruang pribadi untuk jurnal, task, project, dan keuangan. Hanya satu akun — milik Rahul.
            </p>
            <button
              type="button"
              onClick={() => setVisitor(true)}
              className="h-12 rounded-full border-[1.5px] border-white px-6 text-[15px] font-semibold outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              Cuma mampir? Lihat portfolio
            </button>
          </PanelContent>
          <PanelContent show={visitor}>
            <p className="font-heading text-5xl font-light">Halo, pengunjung</p>
            <p className="max-w-sm text-[17px] leading-relaxed text-sky-50">
              Halaman ini khusus pemilik. Karya dan cerita Rahul ada di situs publik — pilih di sebelah kanan.
            </p>
            <button
              type="button"
              onClick={() => setVisitor(false)}
              className="flex h-12 items-center gap-2 rounded-full border-[1.5px] border-white px-6 text-[15px] font-semibold outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft className="size-4" aria-hidden /> Saya pemiliknya
            </button>
          </PanelContent>
        </div>

        {/* Mobile: pesan pengunjung menggantikan form */}
        {visitor && (
          <div className="absolute inset-0 flex animate-rise flex-col justify-center gap-5 bg-linear-to-br from-sky-750 via-sky-700 to-sky-600 p-8 text-white md:hidden">
            <p className="font-heading text-4xl font-light">Halo, pengunjung</p>
            <p className="text-[17px] leading-relaxed text-sky-50">
              Halaman ini khusus pemilik. Karya dan cerita Rahul ada di situs publik.
            </p>
            <Link href="/portfolio" className="flex h-12 items-center justify-center gap-2 rounded-full bg-white font-semibold text-sky-700">
              Lihat portfolio <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <button type="button" onClick={() => setVisitor(false)} className="h-12 rounded-full border-[1.5px] border-white font-semibold">
              Saya pemiliknya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelContent({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-5 p-14 text-center transition-opacity duration-400",
        show ? "opacity-100 delay-200" : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  );
}

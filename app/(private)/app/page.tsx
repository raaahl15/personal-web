import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FolderClosed, SquareCheckBig, TrendingUp, Wallet } from "lucide-react";
import { Greeting, GreetingFallback } from "@/components/lifeos/user";

export const metadata: Metadata = { title: "Hari ini" };

const modules = [
  { href: "/app/tasks", title: "Tasks", desc: "List & Kanban, konteks Kuliah · BEM · Asprak · GMRT · KKN", phase: "Fase 3", icon: SquareCheckBig },
  { href: "/app/projects", title: "Projects", desc: "Project + lampiran; tandai Publik → tampil di Portfolio", phase: "Fase 3", icon: FolderClosed },
  { href: "/app/journal", title: "Jurnal", desc: "Satu halaman per hari, editor blok, mood & tag", phase: "Fase 4", icon: BookOpen },
  { href: "/app/money", title: "Money", desc: "Akun IDR & USD, transaksi, budget, grafik", phase: "Fase 5", icon: Wallet },
  { href: "/app/money/invest", title: "Invest", desc: "Trade forex, saham, crypto + jurnal trading", phase: "Fase 5", icon: TrendingUp },
];

// Dashboard "Hari ini" — Fase 2: kerangka. Widget ringkasan diisi di Fase 6 (MASTER.md Bagian 7).
export default function TodayPage() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<GreetingFallback />}>
        <Greeting />
      </Suspense>

      <section className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-sky-750 via-sky-700 to-sky-600 p-7 text-white sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-sky-300/30 blur-3xl" />
        <p className="text-xs font-semibold tracking-[0.14em] text-sky-100 uppercase">Fase 4 · Jurnal</p>
        <h2 className="mt-2 max-w-xl text-3xl leading-tight font-light">Tasks, Projects, dan Jurnal sudah aktif.</h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-sky-50">
          Tulis jurnal hari ini — tersimpan otomatis. Berikutnya: Money (Fase 5).
        </p>
        <Link
          href="/app/journal"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-sky-750 outline-none hover:bg-sky-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-700"
        >
          Tulis jurnal hari ini <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </section>

      <section aria-labelledby="modul-heading" className="flex flex-col gap-4">
        <h2 id="modul-heading" className="text-2xl font-medium">
          Modul
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="glass group flex h-full flex-col gap-4 rounded-[28px] p-6 outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{m.phase}</span>
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-heading text-xl font-medium">
                      {m.title}
                      <ArrowUpRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{m.desc}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

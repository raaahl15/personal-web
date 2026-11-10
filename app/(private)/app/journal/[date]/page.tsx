import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getJournalEntry, getJournalRange, getRecentJournal } from "@/lib/data/lifeos";
import { withDb } from "@/components/lifeos/db-not-ready";
import { JournalEditor } from "@/components/lifeos/journal-editor";
import { JournalCalendar, JournalList, JournalSearchForm } from "@/components/lifeos/journal-side";
import { addDays, formatLong, isValidDate, lastDayOfMonth, todayWib } from "@/lib/lifeos/dates";

export const metadata: Metadata = { title: "Jurnal" };

const MIGRATION = "0003_journal.sql";

// Jurnal — Fase 4. Satu halaman per tanggal; /app/journal diarahkan ke hari ini oleh proxy.ts.
export default function JournalDayPage({ params, searchParams }: PageProps<"/app/journal/[date]">) {
  return (
    <Suspense fallback={<JournalSkeleton />}>
      <JournalDay params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function JournalDay({
  params,
  searchParams,
}: {
  params: PageProps<"/app/journal/[date]">["params"];
  searchParams: PageProps<"/app/journal/[date]">["searchParams"];
}) {
  const [{ date }, sp] = await Promise.all([params, searchParams]);
  if (!isValidDate(date)) notFound();
  const month = typeof sp.m === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(sp.m) ? sp.m : date.slice(0, 7);
  const today = todayWib();
  const label = formatLong(date);
  const navClass =
    "grid size-11 place-items-center rounded-full bg-card outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring";

  return withDb(async () => {
    const [entry, days, recent] = await Promise.all([
      getJournalEntry(date),
      getJournalRange(`${month}-01`, lastDayOfMonth(month)),
      getRecentJournal(5),
    ]);

    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-subtle">Jurnal{date === today ? " · Hari ini" : ""}</p>
            <h1 className="mt-1 text-[clamp(1.875rem,4vw,2.75rem)] leading-tight font-light capitalize">{label}</h1>
          </div>
          <nav aria-label="Pindah hari" className="flex items-center gap-2">
            <Link href={`/app/journal/${addDays(date, -1)}`} aria-label="Hari sebelumnya" className={navClass}>
              <ChevronLeft className="size-5" aria-hidden />
            </Link>
            {date !== today && (
              <Link
                href={`/app/journal/${today}`}
                className="flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Hari ini
              </Link>
            )}
            <Link href={`/app/journal/${addDays(date, 1)}`} aria-label="Hari berikutnya" className={navClass}>
              <ChevronRight className="size-5" aria-hidden />
            </Link>
          </nav>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          {/* key = tanggal → editor baru tiap pindah hari (isi tidak tercampur). */}
          <JournalEditor key={date} date={date} entry={entry} dateLabel={label} />

          <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
            <JournalSearchForm />
            <JournalCalendar month={month} selected={date} today={today} days={days} />
            <section aria-labelledby="journal-recent" className="flex flex-col gap-3">
              <h2 id="journal-recent" className="px-1 text-sm font-semibold text-subtle">
                Tulisan terbaru
              </h2>
              <JournalList items={recent.filter((r) => r.entry_date !== date)} empty="Belum ada tulisan lain." />
            </section>
          </aside>
        </div>
      </div>
    );
  }, MIGRATION);
}

function JournalSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <span className="h-12 w-80 max-w-full animate-pulse rounded-full bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <span className="h-[60vh] animate-pulse rounded-[32px] bg-muted" />
        <span className="h-96 animate-pulse rounded-[28px] bg-muted" />
      </div>
    </div>
  );
}

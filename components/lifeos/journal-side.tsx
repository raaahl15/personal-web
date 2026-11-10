import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { addMonths, formatMonth, formatShort, monthGrid } from "@/lib/lifeos/dates";
import { MOODS, type JournalDay } from "@/lib/lifeos/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const moodOf = (v: number | null) => MOODS.find((m) => m.value === v);

/** Kalender bulanan: hari bertulisan diberi titik (atau emoji mood). Bulan di URL `?m=YYYY-MM`. */
export function JournalCalendar({
  month,
  selected,
  today,
  days,
}: {
  month: string;
  selected: string;
  today: string;
  days: JournalDay[];
}) {
  const byDate = new Map(days.map((d) => [d.entry_date, d]));
  const monthHref = (m: string) => `/app/journal/${selected}?m=${m}`;
  const navClass =
    "grid size-11 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <section aria-label="Kalender jurnal" className="glass rounded-[28px] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <Link href={monthHref(addMonths(month, -1))} aria-label="Bulan sebelumnya" className={navClass} scroll={false}>
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
        <h2 className="font-heading text-lg font-medium capitalize">{formatMonth(month)}</h2>
        <Link href={monthHref(addMonths(month, 1))} aria-label="Bulan berikutnya" className={navClass} scroll={false}>
          <ChevronRight className="size-5" aria-hidden />
        </Link>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span aria-hidden key={w} className="py-1 text-xs font-semibold text-subtle">
            {w}
          </span>
        ))}
        {chunk(monthGrid(month), 7).map((week, i) => (
          <div key={i} className="contents">
            {week.map((date, j) => {
              if (!date) return <span key={j} />;
              const entry = byDate.get(date);
              const mood = moodOf(entry?.mood ?? null);
              const isSel = date === selected;
              const isToday = date === today;
              return (
                <span key={date}>
                  <Link
                    href={`/app/journal/${date}`}
                    aria-current={isSel ? "date" : undefined}
                    aria-label={`${formatShort(date)}${entry ? `, ada tulisan${mood ? `, mood ${mood.label}` : ""}` : ""}${isToday ? ", hari ini" : ""}`}
                    className={cn(
                      "relative flex aspect-square min-h-10 flex-col items-center justify-center rounded-full text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSel ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-muted",
                      !isSel && isToday && "font-semibold text-primary ring-1 ring-primary",
                    )}
                  >
                    {Number(date.slice(8))}
                    {entry && (
                      <span aria-hidden className="absolute bottom-0.5 text-[10px] leading-none">
                        {mood ? mood.emoji : <span className={cn("inline-block size-1.5 rounded-full", isSel ? "bg-primary-foreground" : "bg-primary")} />}
                      </span>
                    )}
                  </Link>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export function JournalSearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/app/journal/cari" role="search" className="relative">
      <label htmlFor="journal-q" className="sr-only">
        Cari di jurnal
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle" aria-hidden />
      <input
        id="journal-q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Cari kata atau #tag…"
        className="h-12 w-full rounded-full border-[1.5px] bg-card pr-4 pl-11 text-base outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
      />
    </form>
  );
}

/** Daftar entri (terbaru / hasil cari). `highlight` → kata yang dicari ditandai. */
export function JournalList({ items, highlight, empty }: { items: JournalDay[]; highlight?: string; empty: string }) {
  if (!items.length) return <p className="px-1 text-[15px] text-muted-foreground">{empty}</p>;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((d) => {
        const mood = moodOf(d.mood);
        return (
          <li key={d.entry_date}>
            <Link
              href={`/app/journal/${d.entry_date}`}
              className="flex flex-col gap-1 rounded-[20px] bg-card p-4 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center justify-between gap-2 text-xs font-semibold text-subtle">
                {formatShort(d.entry_date)}
                {mood && (
                  <span aria-label={`Mood ${mood.label}`} role="img">
                    {mood.emoji}
                  </span>
                )}
              </span>
              <span className="font-medium">
                <Mark text={d.title || "Tanpa judul"} term={highlight} />
              </span>
              {d.snippet && (
                <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  <Mark text={d.snippet} term={highlight} />
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Mark({ text, term }: { text: string; term?: string }) {
  const t = term?.trim();
  if (!t) return text;
  const parts = text.split(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === t.toLowerCase() ? (
      <mark key={i} className="rounded bg-primary-soft px-0.5 text-foreground">
        {p}
      </mark>
    ) : (
      p
    ),
  );
}

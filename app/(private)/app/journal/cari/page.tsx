import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { searchJournal } from "@/lib/data/lifeos";
import { withDb } from "@/components/lifeos/db-not-ready";
import { JournalList, JournalSearchForm } from "@/components/lifeos/journal-side";

export const metadata: Metadata = { title: "Cari jurnal" };

// Pencarian jurnal — Fase 4. ?q= di URL (form GET), cocok untuk judul, isi, dan #tag.
export default function JournalSearchPage({ searchParams }: PageProps<"/app/journal/cari">) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link
        href="/app/journal"
        className="flex w-fit items-center gap-2 rounded-full text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden /> Jurnal hari ini
      </Link>
      <h1 className="text-[clamp(2.25rem,4vw,2.75rem)] leading-tight font-light">Cari jurnal</h1>
      <Suspense fallback={<span aria-hidden className="h-64 animate-pulse rounded-[28px] bg-muted" />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/app/journal/cari">["searchParams"] }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";

  return withDb(async () => {
    const items = q ? await searchJournal(q) : [];
    return (
      <>
        <JournalSearchForm defaultValue={q} />
        {q && (
          <p role="status" className="px-1 text-sm text-subtle">
            {items.length ? `${items.length} entri cocok dengan “${q}”` : `Tidak ada entri yang cocok dengan “${q}”.`}
          </p>
        )}
        {q ? (
          <JournalList items={items} highlight={q.replace(/^#/, "")} empty="" />
        ) : (
          <p className="px-1 text-[15px] text-muted-foreground">Ketik kata, frasa, atau #tag lalu tekan Enter.</p>
        )}
      </>
    );
  }, "0003_journal.sql");
}

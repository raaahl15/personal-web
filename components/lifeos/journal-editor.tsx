"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CloudOff, LoaderCircle, X } from "lucide-react";
import { saveJournalEntry, type JournalPayload } from "@/app/(private)/app/journal/actions";
import { blocksToText } from "@/lib/lifeos/journal-text";
import { MOODS, type JournalEntry } from "@/lib/lifeos/types";
import { cn } from "@/lib/utils";

// BlockNote memakai API DOM → hanya dirender di browser.
const JournalBlocks = dynamic(() => import("./journal-blocks"), {
  ssr: false,
  loading: () => (
    <div aria-hidden className="flex flex-col gap-3 py-2">
      <span className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
      <span className="h-5 w-1/2 animate-pulse rounded-full bg-muted" />
    </div>
  ),
});

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved"; at: string } | { kind: "error"; message: string };

const SAVE_DELAY = 900;
const timeWib = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date(iso));

/**
 * Halaman jurnal satu hari. Semua perubahan (judul, mood, tag, isi) disimpan otomatis setelah
 * jeda mengetik; entri baru dibuat saat pertama kali ada isi (MASTER.md Bagian 2).
 */
export function JournalEditor({ date, entry, dateLabel }: { date: string; entry: JournalEntry | null; dateLabel: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(entry?.title ?? "");
  const [mood, setMood] = useState<number | null>(entry?.mood ?? null);
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [status, setStatus] = useState<Status>(entry ? { kind: "saved", at: entry.updated_at } : { kind: "idle" });

  // Nilai terbaru untuk penyimpanan (tanpa menunggu render).
  const latest = useRef<JournalPayload>({
    date,
    title: entry?.title ?? "",
    content: entry?.content ?? [],
    text: blocksToText(entry?.content ?? []),
    mood: entry?.mood ?? null,
    tags: entry?.tags ?? [],
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);
  const inFlight = useRef(false);
  // Ringkasan yang terlihat di kalender/daftar; bila berubah → segarkan data server.
  const shown = useRef({ exists: Boolean(entry), mood: entry?.mood ?? null, tags: (entry?.tags ?? []).join(",") });

  const save = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    // Sedang menyimpan → loop yang berjalan akan mengambil perubahan terbaru.
    if (!dirty.current || inFlight.current) return;
    inFlight.current = true;
    try {
      while (dirty.current) {
        dirty.current = false;
        setStatus({ kind: "saving" });
        const payload = { ...latest.current };
        const res = await saveJournalEntry(payload);
        if (!res.ok) {
          dirty.current = true;
          setStatus({ kind: "error", message: res.error });
          return;
        }
        setStatus(res.empty ? { kind: "idle" } : { kind: "saved", at: res.savedAt });
        const next = { exists: !res.empty, mood: payload.mood, tags: payload.tags.join(",") };
        if (next.exists !== shown.current.exists || next.mood !== shown.current.mood || next.tags !== shown.current.tags) {
          shown.current = next;
          router.refresh();
        }
      }
    } catch {
      dirty.current = true;
      setStatus({ kind: "error", message: "Koneksi terputus. Perubahan belum tersimpan." });
    } finally {
      inFlight.current = false;
    }
  }, [router]);

  const schedule = useCallback(
    (patch: Partial<JournalPayload>) => {
      latest.current = { ...latest.current, ...patch };
      dirty.current = true;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void save(), SAVE_DELAY);
    },
    [save],
  );

  // Simpan sisa perubahan saat tab disembunyikan / halaman ditinggal.
  useEffect(() => {
    const flush = () => {
      if (document.visibilityState === "hidden") void save();
    };
    document.addEventListener("visibilitychange", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      void save();
    };
  }, [save]);

  // Peringatkan bila menutup tab saat masih ada yang belum tersimpan.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current || inFlight.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const addTags = (raw: string) => {
    const fresh = raw
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, "").trim().toLowerCase().slice(0, 30))
      .filter(Boolean);
    if (!fresh.length) return;
    const next = Array.from(new Set([...tags, ...fresh])).slice(0, 20);
    setTags(next);
    setTagDraft("");
    schedule({ tags: next });
  };
  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    schedule({ tags: next });
  };

  return (
    <article className="glass flex flex-col gap-6 rounded-[32px] p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SaveStatus status={status} onRetry={() => void save()} />
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">Mood hari ini</legend>
          {MOODS.map((m) => {
            const active = mood === m.value;
            return (
              <button
                key={m.value}
                type="button"
                aria-pressed={active}
                aria-label={`Mood ${m.value} dari 5: ${m.label}`}
                title={m.label}
                onClick={() => {
                  const next = active ? null : m.value;
                  setMood(next);
                  schedule({ mood: next });
                }}
                className={cn(
                  "grid size-11 place-items-center rounded-full text-xl outline-none transition-[transform,background-color] focus-visible:ring-2 focus-visible:ring-ring motion-safe:active:scale-90",
                  active ? "bg-primary-soft ring-2 ring-primary" : "opacity-60 grayscale hover:bg-muted hover:opacity-100 hover:grayscale-0",
                )}
              >
                <span aria-hidden>{m.emoji}</span>
              </button>
            );
          })}
        </fieldset>
      </div>

      <div>
        <label htmlFor="journal-title" className="sr-only">
          Judul entri
        </label>
        <input
          id="journal-title"
          value={title}
          maxLength={200}
          placeholder={dateLabel}
          onChange={(e) => {
            setTitle(e.target.value);
            schedule({ title: e.target.value });
          }}
          className="w-full bg-transparent font-heading text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-light outline-none placeholder:text-subtle/70"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span key={t} className="flex h-8 items-center gap-1 rounded-full border bg-muted pr-1 pl-3 text-[13px] font-medium text-muted-foreground">
              #{t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                aria-label={`Hapus tag ${t}`}
                className="grid size-6 place-items-center rounded-full outline-none hover:bg-card focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </span>
          ))}
          <label htmlFor="journal-tag" className="sr-only">
            Tambah tag
          </label>
          <input
            id="journal-tag"
            value={tagDraft}
            placeholder={tags.length ? "+ tag" : "+ tambah tag (Enter)"}
            onChange={(e) => {
              const v = e.target.value;
              if (/[,\s]$/.test(v)) addTags(v);
              else setTagDraft(v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTags(tagDraft);
              } else if (e.key === "Backspace" && !tagDraft && tags.length) {
                removeTag(tags[tags.length - 1]);
              }
            }}
            onBlur={() => addTags(tagDraft)}
            className="h-8 min-w-28 flex-1 bg-transparent text-[13px] outline-none placeholder:text-subtle"
          />
        </div>
      </div>

      <div className="-mx-3 min-h-[40vh] sm:-mx-5">
        <JournalBlocks
          initialContent={entry?.content ?? []}
          label={`Isi jurnal ${dateLabel}`}
          onChange={(content, text) => schedule({ content, text })}
        />
      </div>
    </article>
  );
}

function SaveStatus({ status, onRetry }: { status: Status; onRetry: () => void }) {
  return (
    <p role="status" aria-live="polite" className="flex min-h-11 items-center gap-2 text-sm font-medium text-subtle">
      {status.kind === "saving" && (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden /> Menyimpan…
        </>
      )}
      {status.kind === "saved" && (
        <>
          <Check className="size-4 text-success" aria-hidden /> Tersimpan · {timeWib(status.at)}
        </>
      )}
      {status.kind === "idle" && "Belum ada tulisan — tersimpan otomatis saat kamu mulai menulis."}
      {status.kind === "error" && (
        <span className="flex flex-wrap items-center gap-2 text-warm">
          <CloudOff className="size-4" aria-hidden />
          {status.message}
          <button type="button" onClick={onRetry} className="min-h-11 rounded-full px-2 underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Coba lagi
          </button>
        </span>
      )}
    </p>
  );
}

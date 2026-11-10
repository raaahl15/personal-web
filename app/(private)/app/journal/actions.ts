"use server";

import { z } from "zod";
import { authedClient, dbError, firstError } from "@/lib/lifeos/action-utils";

export type SaveJournalResult = { ok: true; savedAt: string; empty: boolean } | { ok: false; error: string };

const MAX_CONTENT_CHARS = 900_000; // batas body Server Action 1 MB

const schema = z.object({
  date: z.iso.date(),
  title: z.string().trim().max(200, "Judul maksimal 200 karakter."),
  content: z.array(z.unknown()).max(5000),
  text: z.string().max(200_000),
  mood: z.number().int().min(1).max(5).nullable(),
  tags: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(20, "Maksimal 20 tag."),
});

export type JournalPayload = z.input<typeof schema>;

/**
 * Simpan otomatis satu entri per hari (upsert pada user_id + entry_date). Klien selalu mengirim
 * keadaan lengkap. Entri yang benar-benar kosong dihapus, supaya kalender hanya menandai hari
 * yang memang ditulis.
 */
export async function saveJournalEntry(payload: JournalPayload): Promise<SaveJournalResult> {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const p = parsed.data;
  if (JSON.stringify(p.content).length > MAX_CONTENT_CHARS) {
    return { ok: false, error: "Entri terlalu besar untuk disimpan. Pecah ke hari lain atau kurangi isi." };
  }

  const tags = Array.from(new Set(p.tags));
  const body = p.text.trim();
  const empty = !p.title && !body && p.mood === null && tags.length === 0;
  const { user, supabase } = await authedClient();

  if (empty) {
    const { error } = await supabase.from("journal_entries").delete().eq("entry_date", p.date);
    if (error) return { ok: false, error: dbError(error.message).error ?? "Gagal menyimpan." };
    return { ok: true, savedAt: new Date().toISOString(), empty: true };
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .upsert(
      {
        user_id: user.id,
        entry_date: p.date,
        title: p.title,
        content: p.content,
        // Dipakai pencarian (ilike) & cuplikan: judul + isi + tag.
        content_text: [p.title, body, tags.map((t) => `#${t}`).join(" ")].filter(Boolean).join("\n"),
        mood: p.mood,
        tags,
      },
      { onConflict: "user_id,entry_date" },
    )
    .select("updated_at")
    .single<{ updated_at: string }>();
  if (error) return { ok: false, error: dbError(error.message).error ?? "Gagal menyimpan." };
  return { ok: true, savedAt: data.updated_at, empty: false };
}

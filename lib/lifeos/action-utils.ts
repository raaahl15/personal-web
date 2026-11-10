import "server-only";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok?: boolean; error?: string };

/** Setiap Server Action memverifikasi ulang sesi (jangan percaya client) lalu memakai client ber-RLS. */
export async function authedClient() {
  const user = await getCurrentUser();
  return { user, supabase: await createClient() };
}

/** "" → undefined, supaya field opsional di form kosong tidak gagal validasi. */
export const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().trim().max(max).optional());

export const optionalUuid = z.preprocess((v) => (v === "" || v === "none" ? null : v), z.uuid().nullable().optional());

export const optionalDate = z.preprocess(
  (v) => (v === "" ? null : v),
  z.iso.date().nullable().optional(),
);

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Data tidak valid.";
}

export function dbError(message: string): ActionResult {
  if (message.includes("schema cache") || message.includes("does not exist")) {
    return { error: "Database belum disiapkan — jalankan SQL migration terbaru (supabase/migrations/) di Supabase." };
  }
  return { error: "Gagal menyimpan. Coba lagi." };
}

export function slugify(text: string): string {
  return (
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project"
  );
}

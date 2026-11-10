"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { authedClient, dbError, firstError, type ActionResult } from "@/lib/lifeos/action-utils";

const contextSchema = z.object({
  name: z.string().trim().min(1, "Nama konteks wajib diisi.").max(40, "Nama maksimal 40 karakter."),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna tidak valid."),
});

export async function createContext(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = contextSchema.safeParse({ name: formData.get("name") ?? "", color: formData.get("color") ?? "#1e7dff" });
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { supabase } = await authedClient();
  const { count } = await supabase.from("contexts").select("id", { count: "exact", head: true });
  const { error } = await supabase.from("contexts").insert({ ...parsed.data, position: count ?? 0 });
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

export async function updateContext(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { error: "Konteks tidak ditemukan." };
  const parsed = contextSchema.safeParse({ name: formData.get("name") ?? "", color: formData.get("color") ?? "" });
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { supabase } = await authedClient();
  const { error } = await supabase.from("contexts").update(parsed.data).eq("id", id);
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

/** Task milik konteks ini tidak ikut terhapus — jadi "tanpa konteks" (K-15, ON DELETE SET NULL). */
export async function deleteContext(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { error: "Konteks tidak ditemukan." };
  const { supabase } = await authedClient();
  const { error } = await supabase.from("contexts").delete().eq("id", id);
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type LoginState = { error?: string; email?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Hanya izinkan redirect ke dalam /app (cegah open redirect lewat ?next=). */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/app") && !next.startsWith("//") ? next : "/app";
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isSupabaseConfigured) return { error: "Supabase belum dikonfigurasi.", email };
  if (!EMAIL_RE.test(email)) return { error: "Masukkan alamat email yang valid.", email };
  if (!password) return { error: "Masukkan password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  // Pesan sengaja umum: tidak membocorkan apakah email terdaftar.
  if (error) return { error: "Email atau password salah.", email };

  redirect(safeNext(formData.get("next")));
}

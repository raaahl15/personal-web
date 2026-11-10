import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
};

/**
 * Data Access Layer: satu-satunya tempat membaca user Life OS.
 * Membaca cookie = data request → panggil HANYA di dalam <Suspense> (Cache Components).
 * Tidak login / sesi tidak valid → redirect ke /login.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  // Baca cookie lebih dulu: menandai pemanggil sebagai data request (selalu dinamis),
  // supaya redirect di bawah tidak pernah ikut "dibekukan" saat build.
  await cookies();
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) redirect("/login");

  const email = typeof claims.email === "string" ? claims.email : "";
  const meta = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const fullName = typeof meta.full_name === "string" ? meta.full_name : "";
  // Satu akun saja (pemilik). Nama panggilan dari metadata "full_name" di Supabase.
  const name = fullName.trim().split(/\s+/)[0] || "Rahul";

  return { id: claims.sub, email, name };
}

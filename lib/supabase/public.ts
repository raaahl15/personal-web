import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Client anonim (tanpa cookie/sesi) untuk data publik, mis. Portfolio.
 * Aman dipakai di dalam `'use cache'` karena tidak membaca request. RLS hanya
 * mengizinkan baca project dengan is_public = true.
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

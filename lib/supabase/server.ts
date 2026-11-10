import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Client Supabase untuk Server Component, Server Action, dan Route Handler.
 * Buat baru setiap request (jangan disimpan di variabel global).
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component (tidak bisa menulis cookie). Aman diabaikan:
          // proxy.ts sudah me-refresh sesi di setiap request /app.
        }
      },
    },
  });
}

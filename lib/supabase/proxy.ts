import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Refresh sesi Supabase di proxy.ts dan kembalikan apakah ada user yang terverifikasi.
 * `getClaims()` memvalidasi JWT (bukan sekadar membaca cookie), jadi aman untuk proteksi rute.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return { response, isAuthed: false };

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Respons yang menulis cookie auth tidak boleh di-cache CDN.
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Jangan menaruh kode lain di antara createServerClient dan getClaims (rekomendasi Supabase).
  const { data } = await supabase.auth.getClaims();
  return { response, isAuthed: Boolean(data?.claims?.sub) };
}

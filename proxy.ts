import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Routing bahasa situs publik (K-17, K-18):
//   /about     → dirender dari app/[lang]/about dengan lang=en (rewrite, URL tetap)
//   /id/about  → lang=id
//   /en/about  → redirect permanen ke /about (hindari konten ganda)
// Area privat (Fase 2):
//   /app/*     → wajib login (sesi Supabase diverifikasi di sini); belum login → /login?next=…
//   /login     → sudah login → /app
//   /app/journal → /app/journal/<hari ini WIB>
// /api dan /auth tidak memakai prefix bahasa.
const PRIVATE = /^\/app(\/|$)/;
const NON_LOCALIZED = /^\/(app|login|api|auth)(\/|$)/;

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PRIVATE.test(pathname) || pathname === "/login") {
    const { response, isAuthed } = await updateSession(request);

    if (PRIVATE.test(pathname) && !isAuthed) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    // Jurnal (Fase 4): /app/journal → halaman hari ini (WIB). Cookie sesi yang baru disegarkan ikut.
    if (pathname === "/app/journal" || pathname === "/app/journal/") {
      const url = request.nextUrl.clone();
      url.pathname = `/app/journal/${new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date())}`;
      const redirect = NextResponse.redirect(url);
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
      return redirect;
    }
    if (pathname === "/login" && isAuthed) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/id" || pathname.startsWith("/id/")) return NextResponse.next();
  if (NON_LOCALIZED.test(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Lewati file internal Next.js dan file statis (yang punya ekstensi).
  matcher: ["/((?!_next|.*\\..*).*)"],
};

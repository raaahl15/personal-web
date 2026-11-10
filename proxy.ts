import { NextResponse, type NextRequest } from "next/server";

// Routing bahasa situs publik (K-17):
//   /about     → dirender dari app/[lang]/about dengan lang=en (rewrite, URL tetap)
//   /id/about  → lang=id
//   /en/about  → redirect permanen ke /about (hindari konten ganda)
// Life OS (/app), /login, dan /api tidak memakai prefix bahasa.
const NON_LOCALIZED = /^\/(app|login|api)(\/|$)/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

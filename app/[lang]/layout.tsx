import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, locales, localePath } from "@/lib/i18n";
import { fontVariables, themeScript } from "@/lib/fonts";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getDictionary } from "./dictionaries";
import "../globals.css";

// Setelah ganti bahasa: kembalikan posisi scroll (disimpan LangSwitch). Jalan di akhir <body>
// sebelum paint pertama; kalau halaman di-prerender (hover), tunggu sampai benar-benar dibuka.
const restoreScrollScript = `(function(){function r(){try{var s=sessionStorage.getItem("lang-scroll");if(!s)return;sessionStorage.removeItem("lang-scroll");var d=JSON.parse(s);if(d.path===location.pathname)window.scrollTo(0,d.y)}catch(e){}}if(document.prerendering){document.addEventListener("prerenderingchange",r,{once:true})}else{r()}})()`;

// Chrome/Edge: prerender halaman bahasa lain saat link EN/ID di-hover → ganti bahasa instan.
const speculationRules = JSON.stringify({
  prerender: [{ where: { selector_matches: "a[hreflang]" }, eagerness: "moderate" }],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: { default: dict.meta.title, template: `%s — ${dict.meta.title}` },
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, localePath(l)])),
    },
  };
}

export default async function PublicRootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: speculationRules }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {dict.nav.skipToContent}
        </a>
        <SiteHeader lang={lang} nav={dict.nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter lang={lang} dict={dict} />
        <script dangerouslySetInnerHTML={{ __html: restoreScrollScript }} />
      </body>
    </html>
  );
}

import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangSwitch, NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";
import { HeaderTone } from "./header-tone";

export function Monogram({ className = "size-11 text-base" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full bg-linear-to-br from-sky-500 to-sky-750 font-heading font-semibold text-sky-50 ${className}`}
    >
      RG
    </span>
  );
}

/** Navbar pil kaca yang mengambang (desain v1.0, komponen Navbar/Public & Navbar/Mobile). */
export function SiteHeader({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 [view-transition-name:site-header] sm:px-6 md:pt-6">
      <HeaderTone targetId="site-nav" />
      <nav
        id="site-nav"
        aria-label={nav.primary}
        className="glass pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full p-1.5 text-foreground transition-[background-color,border-color,color] duration-500 md:p-2"
      >
        <Link
          href={localePath(lang)}
          className="flex items-center gap-3 rounded-full pr-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Monogram />
          <span className="font-heading text-lg font-medium">{profile.shortName}</span>
        </Link>

        <div className="hidden lg:block">
          <NavLinks lang={lang} labels={nav} />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LangSwitch lang={lang} label={nav.language} />
          <ThemeToggle lightLabel={nav.light} darkLabel={nav.dark} />
          <Link
            href={localePath(lang, "/contact")}
            className="grid h-11 place-items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[filter] outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {nav.letsTalk}
          </Link>
        </div>

        {/* < lg: link navigasi lewat menu layar penuh (tablet tetap punya bahasa/tema/CTA di atas) */}
        <div className="lg:hidden">
          <MobileMenu
            lang={lang}
            labels={nav}
            name={profile.shortName}
            email={profile.contact.email}
            linkedin={profile.contact.linkedin}
          />
        </div>
      </nav>
    </header>
  );
}

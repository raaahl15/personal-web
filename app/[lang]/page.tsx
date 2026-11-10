import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Languages } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/content/profile";
import { hasLocale, localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getDictionary } from "./dictionaries";

// Halaman sementara (Fase 0). Desain welcome page final dibuat di FigCraft dulu.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const otherLang = lang === "en" ? "id" : "en";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6">
      <header className="flex items-center justify-end gap-2">
        <Link
          href={localePath(otherLang)}
          hrefLang={otherLang}
          className={cn(buttonVariants({ variant: "ghost" }), "h-11 gap-2 rounded-full px-4")}
        >
          <Languages className="size-4" aria-hidden />
          {dict.nav.switchLanguage}
        </Link>
        <ThemeToggle label={dict.nav.toggleTheme} />
      </header>

      <section className="flex flex-1 flex-col justify-center gap-6 rounded-3xl border bg-card/60 p-8 backdrop-blur-xl sm:p-14 my-8">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{dict.home.greeting}</p>
        <h1 className="text-4xl font-light tracking-tight text-balance sm:text-6xl">{profile.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground text-pretty">{profile.headline[lang]}</p>
        <p className="max-w-2xl leading-relaxed">{profile.summary[lang]}</p>
        <p className="text-sm text-muted-foreground">{dict.home.underConstruction}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "h-11 gap-2 rounded-full px-6")}
          >
            LinkedIn <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <a
            href={`mailto:${profile.contact.email}`}
            className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-6")}
          >
            {profile.contact.email}
          </a>
        </div>
      </section>
    </main>
  );
}

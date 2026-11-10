import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { awards, experienceGroups, projects } from "@/content/profile";
import { hasLocale, localePath } from "@/lib/i18n";
import { ProjectFilter } from "@/components/site/project-filter";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import { getDictionary } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/portfolio">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.portfolio.title, description: dict.portfolio.intro };
}

// Portfolio — desain v1.0 (FigCraft "Portfolio — Desktop 1440").
// Carousel "Moments" ditunda sampai ada foto kegiatan di Drive.
export default async function PortfolioPage({ params }: PageProps<"/[lang]/portfolio">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.portfolio;
  const orgCount = experienceGroups.find((g) => g.id === "leadership")?.items.length ?? 0;

  const folders = [
    { count: projects.length, label: t.folderProjects, href: "#projects", tone: "primary" },
    { count: orgCount, label: t.folderOrganisation, href: localePath(lang, "/about"), tone: "soft" },
    { count: awards.length, label: t.folderAwards, href: localePath(lang, "/about"), tone: "muted" },
  ] as const;

  return (
    <>
      <section className="relative overflow-hidden px-4 pt-36 pb-12 text-center sm:px-6 md:pt-44">
        <svg aria-hidden viewBox="0 0 1440 360" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-32 h-[360px] w-full text-border">
          {[0, 60, 120, 180, 240].map((dy) => (
            <path
              key={dy}
              d={`M0 ${120 + dy} C200 ${40 + dy} 400 ${200 + dy} 720 ${110 + dy} C1040 ${20 + dy} 1240 ${180 + dy} 1440 ${90 + dy}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          ))}
        </svg>
        <p
          aria-hidden
          className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 font-heading text-[clamp(5rem,18vw,16rem)] leading-none font-bold tracking-tight text-muted select-none md:top-28"
        >
          PORTFOLIO
        </p>
        <div className="relative mx-auto max-w-3xl">
          <h1 className="animate-rise text-[clamp(2.5rem,6vw,4.5rem)] leading-tight font-light text-balance">
            {t.heading}
            <span aria-hidden className="animate-blink text-primary">
              _
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl animate-rise text-[17px] leading-relaxed text-muted-foreground [animation-delay:120ms]">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <ul className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {folders.map((f, i) => (
            <Reveal as="li" key={f.label} delay={i * 80}>
              <Link href={f.href} className="group relative block h-[300px] outline-none">
                <span aria-hidden className="absolute top-12 left-10 h-32 w-[75%] -rotate-3 rounded-2xl border bg-card transition-transform duration-300 group-hover:-translate-y-8 group-hover:-rotate-6 group-focus-visible:-translate-y-8" />
                <span aria-hidden className="absolute top-14 left-14 h-32 w-[75%] rotate-2 rounded-2xl border bg-card transition-transform duration-300 delay-75 group-hover:-translate-y-5 group-hover:rotate-4 group-focus-visible:-translate-y-5" />
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-10 left-0 h-12 w-36 rounded-t-[20px]",
                    f.tone === "primary" ? "bg-primary" : f.tone === "soft" ? "bg-primary-soft" : "bg-muted",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-[76px] bottom-0 flex flex-col justify-between rounded-[32px] rounded-tl-none p-7 transition-transform duration-300 group-hover:translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring",
                    f.tone === "primary"
                      ? "bg-linear-to-br from-sky-600 to-sky-700 text-white shadow-[0_20px_40px_rgb(22_98_204/0.25)]"
                      : f.tone === "soft"
                        ? "bg-primary-soft"
                        : "bg-muted",
                  )}
                >
                  <span className="font-heading text-6xl font-semibold">{String(f.count).padStart(2, "0")}</span>
                  <span className="font-heading text-3xl font-medium">{f.label}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="projects" className="scroll-mt-28 px-4 pt-16 pb-24 sm:px-6 md:pb-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <h2 className="text-4xl">{t.allProjects}</h2>
          <ProjectFilter
            projects={projects}
            lang={lang}
            labels={{ all: t.all, showing: t.showing, filterLabel: t.filterLabel, empty: t.empty, viewProject: dict.common.viewProject }}
          />
        </div>
      </section>
    </>
  );
}

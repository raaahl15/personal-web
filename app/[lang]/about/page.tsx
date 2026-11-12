import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { awards, education, experienceGroups, profile, skills } from "@/content/profile";
import { hasLocale, localePath } from "@/lib/i18n";
import { formatPeriod, yearOf } from "@/lib/site";
import { ExperienceTabs } from "@/components/site/experience-tabs";
import { PillLink } from "@/components/site/pill-link";
import { ProfilePortrait } from "@/components/site/profile-photo";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import { getDictionary } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.about.title, description: profile.summary[lang] };
}

// About — desain v1.0 (FigCraft "About — Desktop 1440").
export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.about;
  const present = dict.common.present;

  const tabs = experienceGroups.map((g) => ({
    id: g.id,
    label: t.groups[g.id],
    items: g.items.map((e) => ({
      period: formatPeriod(e.period, lang, present),
      org: e.org,
      role: e.role[lang],
      points: e.points[lang],
    })),
  }));

  const skillGroups = [
    { label: t.skillsLabel, items: skills.technical[lang], accent: false },
    { label: t.toolsLabel, items: skills.tools, accent: false },
    { label: t.interestsLabel, items: skills.interests[lang], accent: true },
  ];

  return (
    <>
      {/* Header: nama raksasa di belakang foto + garis kontur topografi */}
      <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 md:pt-40">
        <svg aria-hidden viewBox="0 0 1440 360" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-40 h-[360px] w-full text-border">
          {[0, 60, 120, 180, 240].map((dy) => (
            <path
              key={dy}
              d={`M0 ${120 + dy} C240 ${40 + dy} 420 ${180 + dy} 720 ${100 + dy} C1020 ${20 + dy} 1200 ${160 + dy} 1440 ${80 + dy}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          ))}
        </svg>
        <p
          aria-hidden
          className="pointer-events-none absolute top-28 left-1/2 -translate-x-1/2 font-heading text-[clamp(5rem,17vw,15rem)] leading-none font-bold tracking-tight whitespace-nowrap text-muted select-none md:top-36"
        >
          RAHUL GHULAM
        </p>

        <div className="relative mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-[1fr_400px_1fr]">
          <Reveal className="order-2 flex flex-col gap-4 lg:order-1 lg:pb-24">
            <h1 className="text-[13px] font-semibold tracking-[0.16em] text-subtle uppercase">{t.overline}</h1>
            <p className="text-[17px] leading-relaxed text-muted-foreground">{profile.summary[lang]}</p>
          </Reveal>
          <Reveal className="relative order-1 mx-auto aspect-[400/480] w-full max-w-[400px] overflow-hidden rounded-[200px] bg-linear-to-tr from-sky-600 to-sky-250 shadow-[0_24px_48px_rgb(6_41_86/0.18)] lg:order-2">
            <ProfilePortrait lang={lang} preload sizes="(min-width: 1024px) 400px, (min-width: 448px) 400px, calc(100vw - 32px)" />
          </Reveal>
          <Reveal delay={100} className="glass order-3 flex flex-col gap-3.5 rounded-[32px] p-6 lg:mb-24">
            {[
              [t.basedIn, "Yogyakarta, ID"],
              [t.studying, education[0].degree[lang]],
              [t.languages, t.languagesValue],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 text-sm">
                <span className="text-subtle">{k}</span>
                <span className="text-right font-semibold">{v}</span>
              </div>
            ))}
            <PillLink href={localePath(lang, "/contact")} className="mt-2 h-12 self-start text-sm">
              {t.contactCta}
            </PillLink>
          </Reveal>
        </div>
      </section>

      {/* Pendidikan + pengalaman */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[400px_1fr] lg:gap-20">
          <Reveal className="flex flex-col gap-6">
            <h2 className="text-4xl">{t.education}</h2>
            {education.map((e, i) => (
              <article
                key={e.school}
                className={cn("flex flex-col gap-2.5 rounded-[32px] p-7", i === 0 ? "bg-primary text-primary-foreground" : "bg-card")}
              >
                <p className={cn("text-[13px] font-semibold", i === 0 ? "text-primary-foreground/90" : "text-subtle")}>
                  {yearOf(e.period.start)} — {yearOf(e.period.end)}
                </p>
                <h3 className="text-[26px] font-medium">{e.school}</h3>
                <p className={cn("text-[15px] font-medium", i === 0 ? "text-primary-foreground/90" : "text-muted-foreground")}>
                  {e.degree[lang]} · {e.location}
                </p>
                <ul className={cn("flex flex-col gap-1 text-sm leading-relaxed", i === 0 ? "text-primary-foreground/90" : "text-subtle")}>
                  {e.points[lang].map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-6">
            <h2 className="text-4xl">{t.experience}</h2>
            <ExperienceTabs tabs={tabs} showMoreLabel={t.showMore} />
          </Reveal>
        </div>
      </section>

      {/* Prestasi + skill */}
      <section className="px-4 pt-8 pb-24 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <h2 className="text-4xl">{t.awards}</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {awards.map((a, i) => (
              <Reveal as="li" key={a.event} delay={i * 80} className="flex flex-col gap-3 rounded-[32px] bg-card p-7">
                <span className="font-heading text-4xl font-semibold text-primary">{yearOf(a.period.start)}</span>
                <h3 className="text-[22px] leading-snug font-medium">{a.title[lang]}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{a.event}</p>
              </Reveal>
            ))}
          </ul>

          <h2 className="mt-8 text-4xl">{t.skills}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {skillGroups.map((g, i) => (
              <Reveal key={g.label} delay={i * 80} className="flex flex-col gap-4 rounded-[32px] border bg-glass p-7">
                <h3 className="font-sans text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{g.label}</h3>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li key={s} className={cn("rounded-full px-3.5 py-2 text-sm font-medium", g.accent ? "bg-primary-soft" : "bg-muted")}>
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

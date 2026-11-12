import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail } from "lucide-react";
import { experienceGroups, profile, stats, type Project } from "@/content/profile";
import { getPublicProjects } from "@/lib/data/public-projects";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { yearOf } from "@/lib/site";
import { CountUp } from "@/components/site/count-up";
import { FolderCard } from "@/components/site/folder-card";
import { LinkedinIcon } from "@/components/site/icons";
import { PillLink } from "@/components/site/pill-link";
import { ProjectCover } from "@/components/site/project-cover";
import { ProfilePortrait } from "@/components/site/profile-photo";
import { Reveal } from "@/components/site/reveal";
import { getDictionary, type Dictionary } from "./dictionaries";

// Welcome page — desain v1.0 (FigCraft "Welcome — Desktop 1440" & "Welcome — Mobile 375").
// Alur cerita gelap → terang (K-11): hero gelap → transisi + statistik → konten terang.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const all = await getPublicProjects();
  const featured = all.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <Hero lang={lang} dict={dict} spotlight={featured[0] ?? all[0]} />
      <Stats lang={lang} dict={dict} />
      <Featured lang={lang} dict={dict} featured={featured} />
      <AboutTeaser lang={lang} dict={dict} />
      <ClosingCta lang={lang} dict={dict} />
    </>
  );
}

type SectionProps = { lang: Locale; dict: Dictionary };

function Hero({ lang, dict, spotlight: gromics }: SectionProps & { spotlight: Project }) {
  const t = dict.home;
  return (
    <section data-dark-section className="bg-sky-950 p-3 sm:p-4 md:p-6">
      {/* Hero selalu gelap: kelas .dark mengubah token tema di dalam bingkai ini. */}
      <div className="dark relative isolate overflow-hidden rounded-[32px] bg-linear-to-br from-sky-950 via-sky-850 to-sky-750 text-foreground md:rounded-[40px]">
        <Decor />
        <div className="relative mx-auto grid min-h-[min(calc(100svh-1.5rem),60rem)] max-w-6xl content-center gap-12 px-5 pt-32 pb-16 sm:px-8 md:min-h-[min(calc(100svh-3rem),60rem)] lg:grid-cols-[1fr_340px] lg:gap-10 lg:pb-20">
          <div className="flex flex-col items-start">
            <p className="glass animate-rise flex items-center gap-2 rounded-full py-2 pr-4 pl-3 text-[13px] font-medium">
              <span className="size-2 rounded-full bg-success shadow-[0_0_8px_var(--success)]" aria-hidden />
              {t.status}
            </p>
            <h1 className="mt-6 font-heading leading-[0.95] tracking-tight">
              <span className="block animate-rise text-[clamp(2.5rem,5.8vw,5.75rem)] font-extralight text-balance lg:whitespace-nowrap text-sky-50 [animation-delay:80ms]">
                {t.titleLead}
              </span>
              <span className="block animate-rise font-accent text-[clamp(3rem,7.4vw,7.25rem)] text-sky-300 [animation-delay:160ms]">
                {t.titleAccent}
              </span>
            </h1>
            <p className="mt-8 max-w-xl animate-rise text-base leading-relaxed text-sky-150 [animation-delay:240ms] sm:text-lg">
              {t.intro}
            </p>
            <div className="mt-10 flex w-full animate-rise flex-col gap-3 [animation-delay:320ms] sm:w-auto sm:flex-row sm:gap-4">
              <PillLink href={localePath(lang, "/portfolio")}>{t.ctaPortfolio}</PillLink>
              <PillLink href={localePath(lang, "/about")} variant="glass" icon="right">
                {t.ctaAbout}
              </PillLink>
            </div>
            <p className="mt-14 hidden items-center gap-3 text-[13px] font-medium text-sky-250 md:flex">
              <span className="flex h-8 w-5 justify-center rounded-full border-[1.5px] border-sky-250 pt-1.5" aria-hidden>
                <span className="h-2 w-0.5 animate-bounce rounded-full bg-sky-250" />
              </span>
              {t.scrollHint}
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row lg:flex-col lg:justify-center">
            <Link
              href={localePath(lang, `/portfolio/${gromics.slug}`)}
              className="glass group flex animate-rise flex-col gap-4 rounded-[32px] p-6 outline-none [animation-delay:400ms] focus-visible:ring-2 focus-visible:ring-ring sm:flex-1 lg:flex-none"
            >
              <span className="flex items-center justify-between">
                <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold">
                  {t.featuredBadge} · {gromics.category}
                </span>
                <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </span>
              <ProjectCover cover={gromics.cover} className="h-36 rounded-[20px]" />
              <span className="font-heading text-xl font-medium">{gromics.title[lang]}</span>
              <span className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{gromics.summary[lang]}</span>
            </Link>
            <div className="glass flex animate-rise flex-col gap-1 rounded-[28px] p-6 [animation-delay:480ms] sm:w-60 lg:w-auto lg:self-end">
              <CountUp value={stats[0].value} suffix={stats[0].suffix} className="font-heading text-5xl font-semibold" />
              <span className="text-sm font-medium text-muted-foreground">{stats[0].label[lang]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Decor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -right-40 bottom-[-35%] size-[70rem] rounded-full bg-[radial-gradient(circle,rgb(61_155_255/0.45),rgb(30_125_255/0.12)_45%,transparent_70%)]" />
      <div className="absolute -right-[20%] bottom-[-110%] size-[90rem] rounded-full border-[1.5px] border-sky-250/60 [mask-image:linear-gradient(90deg,transparent,black_40%,transparent)]" />
      {[
        { top: "34%", h: "2px", rot: "14deg", opacity: 1, delay: "0ms" },
        { top: "52%", h: "1px", rot: "11deg", opacity: 0.7, delay: "150ms" },
        { top: "64%", h: "1px", rot: "8deg", opacity: 0.5, delay: "300ms" },
      ].map((l) => (
        <div
          key={l.top}
          className="absolute left-[45%] hidden w-[90%] animate-warp md:block bg-linear-to-r from-transparent via-sky-250 to-transparent"
          style={
            {
              top: l.top,
              height: l.h,
              opacity: l.opacity,
              animationDelay: l.delay,
              "--warp-rotate": l.rot,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Stats({ lang, dict }: SectionProps) {
  const t = dict.home;
  return (
    <section className="bg-linear-to-b from-sky-950 via-sky-700 via-45% to-background px-4 pt-20 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <h2 className="font-heading leading-none tracking-tight text-sky-50">
            <span className="block text-[clamp(2.25rem,6vw,5rem)] font-extralight">{t.statsTitleLead}</span>
            <span className="mt-1 block font-accent text-[clamp(2.5rem,6.5vw,5.5rem)] text-sky-250">{t.statsTitleAccent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sky-100 sm:text-lg">{t.statsIntro}</p>
        </Reveal>
        <ul className="mt-14 grid grid-cols-2 gap-3 text-left sm:gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label.en} delay={i * 80} className="glass flex flex-col gap-1.5 rounded-[24px] p-5 sm:rounded-[32px] sm:p-7">
              <CountUp value={s.value} suffix={s.suffix} className="font-heading text-4xl font-semibold sm:text-6xl" />
              <span className="text-[13px] font-medium text-muted-foreground sm:text-[15px]">{s.label[lang]}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Featured({ lang, dict, featured }: SectionProps & { featured: Project[] }) {
  const t = dict.home;
  return (
    <section className="px-4 pt-10 pb-24 sm:px-6 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.16em] text-subtle uppercase">{t.featuredOverline}</p>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-tight font-light">{t.featuredTitle}</h2>
          </div>
          <PillLink href={localePath(lang, "/portfolio")} variant="glass" icon="right">
            {t.allProjects}
          </PillLink>
        </Reveal>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 100}>
              <FolderCard
                project={p}
                lang={lang}
                highlight={i === 0}
                metaLabel={`${p.category} · ${p.year}`}
                linkLabel={dict.common.viewProject}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AboutTeaser({ lang, dict }: SectionProps) {
  const t = dict.home;
  const now = experienceGroups[0].items.filter((e) => e.period.end === null).slice(0, 3);
  return (
    <section className="relative overflow-hidden px-4 pb-24 sm:px-6 md:pb-32">
      <div aria-hidden className="pointer-events-none absolute top-0 left-0 flex w-max animate-marquee font-heading text-[clamp(6rem,16vw,14rem)] leading-none font-bold whitespace-nowrap text-muted select-none">
        <span className="pr-16">RAHUL GHULAM • RAHUL GHULAM •</span>
        <span className="pr-16">RAHUL GHULAM • RAHUL GHULAM •</span>
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 pt-16 md:pt-24 lg:grid-cols-[460px_1fr] lg:gap-20">
        <Reveal className="relative mx-auto aspect-[46/54] w-full max-w-[460px] overflow-hidden rounded-[40px] bg-linear-to-tr from-sky-600 via-sky-250 to-sky-100 shadow-[0_24px_48px_rgb(6_41_86/0.18)]">
          <ProfilePortrait lang={lang} sizes="(min-width: 1024px) 460px, (min-width: 508px) 460px, calc(100vw - 48px)" />
          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-3xl border border-white/90 bg-white/75 px-5 py-4 text-sky-900 backdrop-blur-xl">
            <div>
              <p className="font-heading text-lg font-medium">{profile.name}</p>
              <p className="text-[13px] font-medium text-sky-700">{profile.headline[lang]}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="flex flex-col gap-7">
          <p className="text-[13px] font-semibold tracking-[0.16em] text-subtle uppercase">{t.aboutOverline}</p>
          <h2 className="text-[clamp(2rem,4vw,2.75rem)] leading-tight font-light text-balance">{t.aboutTitle}</h2>
          <p className="text-[17px] leading-relaxed text-muted-foreground">{profile.summary[lang]}</p>
          <ul className="rounded-[28px] bg-card px-6 py-2">
            {now.map((e) => (
              <li key={e.org + e.role.en} className="flex items-center justify-between gap-4 border-b py-4 last:border-b-0">
                <span>
                  <span className="block text-[15px] font-semibold">{e.role[lang]}</span>
                  <span className="block text-sm text-subtle">{e.org}</span>
                </span>
                <span className="shrink-0 text-sm font-medium text-muted-foreground">
                  {yearOf(e.period.start)} — {dict.common.now}
                </span>
              </li>
            ))}
          </ul>
          <PillLink href={localePath(lang, "/about")} variant="glass" icon="right" className="self-start">
            {t.aboutMore}
          </PillLink>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCta({ lang, dict }: SectionProps) {
  const t = dict.home;
  return (
    <section className="px-3 pb-6 sm:px-4 md:px-6">
      {/* Gradien mulai dari Azure/Deep Sky agar teks putih ≥4.5:1 (K-23) */}
      <Reveal className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-sky-700 via-sky-600 to-sky-300 px-6 py-14 text-white sm:px-12 md:rounded-[40px] md:py-20">
        <div className="mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="font-heading text-[clamp(2.75rem,7vw,7rem)] leading-[0.92] font-bold tracking-tight uppercase">
              <span className="block">{t.ctaLead}</span>
              <span className="block text-white/35">{t.ctaAccent}</span>
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-sky-50">{t.ctaBody}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-[32px] border border-white/90 bg-white/75 p-6 text-sky-900 backdrop-blur-xl">
            <a
              href={`mailto:${profile.contact.email}`}
              className="flex items-center gap-3 rounded-[18px] bg-white p-4 text-[15px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Mail className="size-5 shrink-0 text-sky-600" aria-hidden />
              <span className="truncate">{profile.contact.email}</span>
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[18px] bg-white p-4 text-[15px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <LinkedinIcon className="size-5 shrink-0 text-sky-600" />
              linkedin.com/in/rahulghulam
            </a>
            <Link
              href={localePath(lang, "/contact")}
              className="group mt-1 flex h-14 items-center justify-between rounded-full bg-sky-600 pr-2 pl-6 font-semibold text-white outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              {t.getInTouch}
              <span className="grid size-10 place-items-center rounded-full bg-white text-sky-600">
                <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

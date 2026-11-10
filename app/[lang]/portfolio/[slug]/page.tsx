import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, FolderOpen, Globe } from "lucide-react";
import { GitHubIcon } from "@/components/site/icons";
import { getPublicProjects } from "@/lib/data/public-projects";
import { hasLocale, localePath } from "@/lib/i18n";
import { ProjectCover } from "@/components/site/project-cover";
import { Reveal } from "@/components/site/reveal";
import { getDictionary } from "../../dictionaries";

// Cache Components: generateStaticParams wajib ≥1 param; `dynamicParams` tidak boleh dipakai.
// Slug yang tidak dikenal → notFound() di halaman.
export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

const findProject = async (slug: string) => (await getPublicProjects()).find((p) => p.slug === slug);

export async function generateMetadata({ params }: PageProps<"/[lang]/portfolio/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = await findProject(slug);
  if (!hasLocale(lang) || !project) return {};
  return { title: project.title[lang], description: project.summary[lang] };
}

function LinkIcon({ url }: { url: string }) {
  const host = new URL(url).hostname;
  if (host === "github.com") return <GitHubIcon className="size-[18px]" />;
  if (host.endsWith("drive.google.com") || host.endsWith("docs.google.com")) {
    return <FolderOpen className="size-[18px]" aria-hidden />;
  }
  return <Globe className="size-[18px]" aria-hidden />;
}

// Detail project — desain v1.0 (FigCraft "Project Detail — Desktop 1440").
export default async function ProjectPage({ params }: PageProps<"/[lang]/portfolio/[slug]">) {
  const { lang, slug } = await params;
  const projects = await getPublicProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!hasLocale(lang) || !project) notFound();
  const dict = await getDictionary(lang);
  const t = dict.project;

  const links = project.links ?? [];
  const techStack = project.techStack ?? [];
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const meta = [
    [t.category, project.category],
    [t.year, project.year],
    [t.status, project.status === "done" ? t.statusDone : t.statusActive],
    ...(project.result ? [[t.result, project.result[lang]]] : []),
  ];

  return (
    <>
      <section className="px-4 pt-32 pb-10 sm:px-6 md:pt-40">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <Link
            href={localePath(lang, "/portfolio")}
            className="flex w-fit items-center gap-2 rounded-full text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {dict.common.backToPortfolio} / {project.category}
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-10">
            <div className="max-w-2xl animate-rise">
              <h1 className="text-[clamp(3rem,9vw,7.5rem)] leading-none font-extralight tracking-tight">{project.shortTitle}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{project.summary[lang]}</p>
            </div>
            <dl className="grid animate-rise grid-cols-2 gap-x-10 gap-y-5 [animation-delay:120ms]">
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{k}</dt>
                  <dd className="mt-1 text-[15px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ProjectCover cover={project.cover} className="h-[clamp(14rem,40vw,32rem)] rounded-[32px] md:rounded-[40px]" />
        </div>
      </section>

      <section className="px-4 pt-6 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          <Reveal className="max-w-[68ch]">
            <h2 className="text-3xl">{t.highlights}</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {project.highlights[lang].map((h) => (
                <li key={h} className="flex gap-4 text-[17px] leading-relaxed text-muted-foreground">
                  <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="flex h-fit flex-col gap-7 rounded-[32px] bg-card p-7 lg:sticky lg:top-28">
            {links.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{t.links}</h2>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {links.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-11 items-center justify-between gap-3 rounded-full bg-muted px-5 py-2.5 text-[15px] font-medium outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex items-center gap-2.5">
                          <LinkIcon url={l.url} />
                          {l.label}
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                        <span className="sr-only">{t.opensNewTab}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {techStack.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{t.tools}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {techStack.map((s) => (
                    <li key={s} className="rounded-full border px-3 py-1 text-[13px] font-medium text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-[15px] leading-relaxed text-muted-foreground">{t.photosSoon}</p>
          </Reveal>
        </div>
      </section>

      <nav aria-label={t.next} className="bg-muted px-4 sm:px-6">
        <Link
          href={localePath(lang, `/portfolio/${next.slug}`)}
          className="group mx-auto flex max-w-6xl items-center justify-between gap-6 py-10 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>
            <span className="block text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{t.next}</span>
            <span className="mt-1 block font-heading text-2xl sm:text-3xl">{next.shortTitle}</span>
          </span>
          <ArrowRight className="size-7 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </nav>
    </>
  );
}

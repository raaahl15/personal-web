import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Globe, Star } from "lucide-react";
import { getProjects } from "@/lib/data/lifeos";
import { withDb } from "@/components/lifeos/db-not-ready";
import { NewProjectButton } from "@/components/lifeos/projects";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/lib/lifeos/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };

const FILTERS: { key: ProjectStatus | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "active", label: "Aktif" },
  { key: "idea", label: "Ide" },
  { key: "done", label: "Selesai" },
  { key: "archived", label: "Arsip" },
];

const statusTone: Record<ProjectStatus, string> = {
  active: "bg-primary-soft text-foreground",
  idea: "bg-muted text-muted-foreground",
  done: "bg-success-soft text-success",
  archived: "bg-muted text-subtle",
};

// Projects — Fase 3 (desain v1.0 "Projects — Desktop"). ?status=… di URL.
export default function ProjectsPage({ searchParams }: PageProps<"/app/projects">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-subtle">Life OS</p>
          <h1 className="mt-1 text-[clamp(2.25rem,4vw,2.75rem)] leading-tight font-light">Projects</h1>
        </div>
        <NewProjectButton />
      </div>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProjectsContent({ searchParams }: { searchParams: PageProps<"/app/projects">["searchParams"] }) {
  const sp = await searchParams;
  const filter = FILTERS.find((f) => f.key === sp.status)?.key ?? "all";

  return withDb(async () => {
    const all = await getProjects();
    const projects = filter === "all" ? all.filter((p) => p.status !== "archived") : all.filter((p) => p.status === filter);
    const count = (k: ProjectStatus | "all") => (k === "all" ? all.filter((p) => p.status !== "archived").length : all.filter((p) => p.status === k).length);

    return (
      <>
        <nav aria-label="Filter status" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={f.key === "all" ? "/app/projects" : `/app/projects?status=${f.key}`}
              aria-current={filter === f.key ? "page" : undefined}
              className={cn(
                "flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filter === f.key ? "border-transparent bg-foreground font-semibold text-background" : "bg-card text-foreground hover:bg-muted",
              )}
            >
              {f.label} · {count(f.key)}
            </Link>
          ))}
        </nav>

        {projects.length === 0 ? (
          <p className="rounded-[24px] bg-card p-6 text-muted-foreground">Belum ada project di sini.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => {
              const pct = p.taskTotal ? Math.round((p.taskDone / p.taskTotal) * 100) : 0;
              const year = (p.end_date ?? p.start_date ?? p.updated_at).slice(0, 4);
              return (
                <li key={p.id}>
                  <Link
                    href={`/app/projects/${p.id}`}
                    className="glass flex h-full flex-col gap-4 rounded-[28px] p-6 outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusTone[p.status])}>
                        {PROJECT_STATUS_LABEL[p.status]} · {p.category}
                      </span>
                      <span className="text-[13px] text-subtle">{year}</span>
                    </span>
                    <span className="font-heading text-2xl leading-snug font-medium">{p.title.id || p.title.en}</span>
                    {(p.summary.id || p.summary.en) && (
                      <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.summary.id || p.summary.en}</span>
                    )}
                    <span className="mt-auto flex flex-col gap-2">
                      <span className="flex justify-between text-[13px]">
                        <span className="text-subtle">
                          {p.taskDone} / {p.taskTotal} task
                        </span>
                        <span className={cn("font-semibold", pct === 100 ? "text-success" : "text-primary")}>{pct}%</span>
                      </span>
                      <span
                        role="progressbar"
                        aria-label={`Progres ${p.title.id}`}
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-2 overflow-hidden rounded-full bg-muted"
                      >
                        <span className={cn("block h-full rounded-full", pct === 100 ? "bg-success" : "bg-primary")} style={{ width: `${pct}%` }} />
                      </span>
                      <span className="flex gap-3 text-[13px] font-medium text-muted-foreground">
                        {p.is_public && (
                          <span className="flex items-center gap-1">
                            <Globe className="size-3.5" aria-hidden /> Publik
                          </span>
                        )}
                        {p.featured && (
                          <span className="flex items-center gap-1">
                            <Star className="size-3.5" aria-hidden /> Unggulan
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  });
}

function ProjectsSkeleton() {
  return (
    <div aria-hidden className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-64 animate-pulse rounded-[28px] bg-muted" />
      ))}
    </div>
  );
}

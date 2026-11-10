import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getContexts, getProject, getProjectFiles, getProjectOptions, getTasks } from "@/lib/data/lifeos";
import { withDb } from "@/components/lifeos/db-not-ready";
import { DeleteProject, ProjectFiles, ProjectFlags, ProjectForm } from "@/components/lifeos/projects";
import { TaskList, TaskQuickAdd } from "@/components/lifeos/tasks";
import { PROJECT_STATUS_LABEL } from "@/lib/lifeos/types";

export const metadata: Metadata = { title: "Project" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const todayWib = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());

// Detail project — Fase 3. Param dinamis tanpa generateStaticParams → dibaca di dalam <Suspense>.
export default function ProjectPage({ params }: PageProps<"/app/projects/[id]">) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/app/projects"
        className="flex w-fit items-center gap-2 rounded-full text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden /> Projects
      </Link>
      <Suspense fallback={<span aria-hidden className="h-96 animate-pulse rounded-[28px] bg-muted" />}>
        <ProjectDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectDetail({ params }: { params: PageProps<"/app/projects/[id]">["params"] }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  return withDb(async () => {
    const [user, project, tasks, contexts, projects, files] = await Promise.all([
      getCurrentUser(),
      getProject(id),
      getTasks({ projectId: id }),
      getContexts(),
      getProjectOptions(),
      getProjectFiles(id),
    ]);
    if (!project) notFound();
    const done = tasks.filter((t) => t.status === "done").length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const title = project.title.id || project.title.en;

    return (
      <>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-subtle">
              {PROJECT_STATUS_LABEL[project.status]} · {project.category} · {done}/{tasks.length} task ({pct}%)
            </p>
            <h1 className="mt-1 text-[clamp(2rem,4vw,2.75rem)] leading-tight font-light text-balance">{title}</h1>
          </div>
          {project.is_public && (
            <a
              href={`/portfolio/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-full bg-muted px-4 text-sm font-semibold outline-none hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-ring"
            >
              Lihat di Portfolio <ArrowUpRight className="size-4" aria-hidden />
            </a>
          )}
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
          <div className="flex min-w-0 flex-col gap-8">
            <section aria-labelledby="tasks-h" className="flex flex-col gap-4">
              <h2 id="tasks-h" className="text-2xl font-medium">
                Task
              </h2>
              <TaskQuickAdd contexts={contexts} projects={projects} presetProjectId={project.id} />
              <TaskList
                tasks={tasks}
                contexts={contexts}
                projects={projects}
                today={todayWib()}
                emptyText="Belum ada task untuk project ini."
              />
            </section>

            <section aria-labelledby="detail-h" className="glass flex flex-col gap-5 rounded-[28px] p-5 sm:p-7">
              <h2 id="detail-h" className="text-2xl font-medium">
                Detail & teks publik
              </h2>
              <ProjectForm key={project.updated_at} project={project} />
            </section>
          </div>

          <aside className="flex flex-col gap-6 xl:sticky xl:top-8">
            <section aria-labelledby="vis-h" className="flex flex-col gap-3">
              <h2 id="vis-h" className="text-xl font-medium">
                Tampil di situs
              </h2>
              <ProjectFlags id={project.id} isPublic={project.is_public} featured={project.featured} />
            </section>
            <section aria-labelledby="files-h" className="flex flex-col gap-3">
              <h2 id="files-h" className="text-xl font-medium">
                Lampiran
              </h2>
              <ProjectFiles projectId={project.id} userId={user.id} files={files} />
            </section>
            <DeleteProject id={project.id} title={title} />
          </aside>
        </div>
      </>
    );
  });
}

import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { KanbanSquare, List } from "lucide-react";
import { getContexts, getProjectOptions, getTasks } from "@/lib/data/lifeos";
import { withDb } from "@/components/lifeos/db-not-ready";
import { KanbanBoard, TaskList, TaskQuickAdd } from "@/components/lifeos/tasks";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tasks" };

const todayWib = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());

// Tasks — Fase 3 (desain v1.0 "Tasks — Kanban"). ?view=list|kanban & ?ctx=<id> di URL.
export default function TasksPage({ searchParams }: PageProps<"/app/tasks">) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-subtle">Life OS</p>
        <h1 className="mt-1 text-[clamp(2.25rem,4vw,2.75rem)] leading-tight font-light">Tasks</h1>
      </div>
      <Suspense fallback={<TasksSkeleton />}>
        <TasksContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TasksContent({ searchParams }: { searchParams: PageProps<"/app/tasks">["searchParams"] }) {
  const sp = await searchParams;
  const view = sp.view === "kanban" ? "kanban" : "list";
  const ctx = typeof sp.ctx === "string" ? sp.ctx : undefined;

  return withDb(async () => {
    const [contexts, projects, all] = await Promise.all([getContexts(), getProjectOptions(), getTasks()]);
    const activeCtx = contexts.find((c) => c.id === ctx);
    const tasks = activeCtx ? all.filter((t) => t.context_id === activeCtx.id) : all;
    const today = todayWib();
    const href = (next: { view?: string; ctx?: string | null }) => {
      const p = new URLSearchParams();
      const v = next.view ?? view;
      const c = next.ctx === undefined ? activeCtx?.id : next.ctx;
      if (v === "kanban") p.set("view", "kanban");
      if (c) p.set("ctx", c);
      const q = p.toString();
      return `/app/tasks${q ? `?${q}` : ""}`;
    };
    const openCount = (id?: string) => all.filter((t) => t.status !== "done" && (!id || t.context_id === id)).length;

    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Filter konteks" className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
            <Link
              href={href({ ctx: null })}
              aria-current={!activeCtx ? "page" : undefined}
              className={cn(
                "flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !activeCtx ? "border-transparent bg-foreground font-semibold text-background" : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              Semua · {openCount()}
            </Link>
            {contexts.map((c) => {
              const active = activeCtx?.id === c.id;
              return (
                <Link
                  key={c.id}
                  href={href({ ctx: c.id })}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "border-transparent bg-foreground font-semibold text-background" : "bg-card text-foreground hover:bg-muted",
                  )}
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
                  {c.name} · {openCount(c.id)}
                </Link>
              );
            })}
          </nav>
          <div role="group" aria-label="Tampilan" className="flex shrink-0 gap-1 rounded-full bg-muted p-1">
            {[
              { v: "list", label: "List", Icon: List },
              { v: "kanban", label: "Kanban", Icon: KanbanSquare },
            ].map(({ v, label, Icon }) => (
              <Link
                key={v}
                href={href({ view: v })}
                aria-current={view === v ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  view === v && "bg-card font-semibold text-foreground shadow-sm",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <TaskQuickAdd contexts={contexts} projects={projects} defaultContextId={activeCtx?.id} />

        {view === "kanban" ? (
          <KanbanBoard tasks={tasks} contexts={contexts} projects={projects} today={today} />
        ) : (
          <TaskList tasks={tasks} contexts={contexts} projects={projects} today={today} />
        )}
      </>
    );
  });
}

function TasksSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-11 w-24 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <span className="h-24 animate-pulse rounded-[28px] bg-muted" />
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-16 animate-pulse rounded-[18px] bg-muted" />
      ))}
    </div>
  );
}

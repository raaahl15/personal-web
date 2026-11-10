"use client";

import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { CalendarDays, Check, FolderClosed, GripVertical, Pencil, Plus } from "lucide-react";
import { createTask, deleteTask, setTaskStatus, updateTask } from "@/app/(private)/app/tasks/actions";
import type { ActionResult } from "@/lib/lifeos/action-utils";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  type Context,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/lifeos/types";
import { cn } from "@/lib/utils";
import { Field, FormMessage, Sheet, SubmitButton, inputClass, textareaClass, type SheetHandle } from "./ui";

export type ProjectOption = { id: string; title: string };
type Lookups = { contexts: Context[]; projects: ProjectOption[]; today: string };

// ---------------------------------------------------------------------------
// Utilitas tampilan
// ---------------------------------------------------------------------------

const dayDiff = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000);

export function dueLabel(due: string | null, today: string) {
  if (!due) return null;
  const d = dayDiff(due, today);
  if (d === 0) return { text: "Hari ini", tone: "warm" as const };
  if (d === 1) return { text: "Besok", tone: "normal" as const };
  if (d < 0) return { text: d === -1 ? "Kemarin" : `Lewat ${-d} hari`, tone: "warm" as const };
  const text = new Intl.DateTimeFormat("id-ID", { weekday: d < 7 ? "short" : undefined, day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${due}T00:00:00Z`),
  );
  return { text, tone: "normal" as const };
}

const priorityTone: Record<TaskPriority, string> = {
  high: "bg-warm-soft text-warm",
  med: "bg-muted text-muted-foreground",
  low: "bg-muted text-subtle",
};

function TaskMeta({ task, contexts, projects, today }: { task: Task } & Lookups) {
  const ctx = contexts.find((c) => c.id === task.context_id);
  const project = projects.find((p) => p.id === task.project_id);
  const due = task.status === "done" ? null : dueLabel(task.due_date, today);
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-subtle">
      {ctx && (
        <span className="flex items-center gap-1.5 font-medium">
          <span className="size-2 rounded-full" style={{ backgroundColor: ctx.color }} aria-hidden />
          {ctx.name}
        </span>
      )}
      {due && (
        <span className={cn("flex items-center gap-1", due.tone === "warm" && "font-semibold text-warm")}>
          <CalendarDays className="size-3.5" aria-hidden />
          {due.text}
        </span>
      )}
      {project && (
        <span className="flex min-w-0 items-center gap-1">
          <FolderClosed className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{project.title}</span>
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Form field bersama (tambah & ubah)
// ---------------------------------------------------------------------------

function TaskFields({ task, contexts, projects, presetProjectId, idPrefix }: {
  task?: Task;
  contexts: Context[];
  projects: ProjectOption[];
  presetProjectId?: string;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Konteks" htmlFor={`${idPrefix}-context`}>
        <select id={`${idPrefix}-context`} name="context_id" defaultValue={task?.context_id ?? "none"} className={inputClass}>
          <option value="none">Tanpa konteks</option>
          {contexts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tenggat" htmlFor={`${idPrefix}-due`}>
        <input id={`${idPrefix}-due`} name="due_date" type="date" defaultValue={task?.due_date ?? ""} className={inputClass} />
      </Field>
      <Field label="Prioritas" htmlFor={`${idPrefix}-priority`}>
        <select id={`${idPrefix}-priority`} name="priority" defaultValue={task?.priority ?? "med"} className={inputClass}>
          {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Project" htmlFor={`${idPrefix}-project`}>
        <select
          id={`${idPrefix}-project`}
          name="project_id"
          defaultValue={task?.project_id ?? presetProjectId ?? "none"}
          className={inputClass}
        >
          <option value="none">Tanpa project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tambah cepat
// ---------------------------------------------------------------------------

export function TaskQuickAdd({
  contexts,
  projects,
  presetProjectId,
  defaultContextId,
}: {
  contexts: Context[];
  projects: ProjectOption[];
  presetProjectId?: string;
  defaultContextId?: string;
}) {
  const [state, action] = useActionState<ActionResult, FormData>(createTask, {});
  const [expanded, setExpanded] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) titleRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="glass flex flex-col gap-4 rounded-[28px] p-4 sm:p-5">
      <div className="flex gap-2">
        <label htmlFor="quick-title" className="sr-only">
          Task baru
        </label>
        <input
          ref={titleRef}
          id="quick-title"
          name="title"
          required
          maxLength={200}
          placeholder="Tambah task… (Enter untuk simpan)"
          autoComplete="off"
          className={cn(inputClass, "bg-card")}
        />
        <SubmitButton className="shrink-0 px-4 sm:px-6" pendingText="">
          <Plus className="size-5" aria-hidden />
          <span className="hidden sm:inline">Tambah</span>
        </SubmitButton>
      </div>
      {!expanded && (
        <input type="hidden" name="context_id" value={defaultContextId ?? "none"} />
      )}
      {!expanded && presetProjectId && <input type="hidden" name="project_id" value={presetProjectId} />}
      {expanded ? (
        <TaskFields contexts={contexts} projects={projects} presetProjectId={presetProjectId} idPrefix="quick" task={defaultContextId ? ({ context_id: defaultContextId } as Task) : undefined} />
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-fit rounded-full text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Konteks, tenggat, prioritas
        </button>
      )}
      <FormMessage error={state.error} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Editor (dialog)
// ---------------------------------------------------------------------------

function TaskEditor({ task, lookups, sheetRef }: { task: Task; lookups: Lookups; sheetRef: React.RefObject<SheetHandle | null> }) {
  const [state, action] = useActionState<ActionResult, FormData>(updateTask.bind(null, task.id), {});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, startDelete] = useTransition();

  useEffect(() => {
    if (state.ok) sheetRef.current?.close();
  }, [state, sheetRef]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Judul" htmlFor={`t-${task.id}-title`}>
        <input id={`t-${task.id}-title`} name="title" required maxLength={200} defaultValue={task.title} className={inputClass} />
      </Field>
      <Field label="Catatan" htmlFor={`t-${task.id}-desc`}>
        <textarea id={`t-${task.id}-desc`} name="description" rows={3} defaultValue={task.description ?? ""} className={textareaClass} />
      </Field>
      <Field label="Status" htmlFor={`t-${task.id}-status`}>
        <select id={`t-${task.id}-status`} name="status" defaultValue={task.status} className={inputClass}>
          {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </Field>
      <TaskFields task={task} contexts={lookups.contexts} projects={lookups.projects} idPrefix={`t-${task.id}`} />
      <FormMessage error={state.error} />
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {confirmDelete ? (
          <span className="flex items-center gap-2">
            <button
              type="button"
              disabled={deleting}
              onClick={() =>
                startDelete(async () => {
                  const res = await deleteTask(task.id);
                  if (!res.error) sheetRef.current?.close();
                })
              }
              className="h-11 rounded-full bg-warm px-5 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {deleting ? "Menghapus…" : "Ya, hapus"}
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="h-11 rounded-full px-4 text-sm font-semibold">
              Batal
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="h-11 rounded-full px-4 text-sm font-semibold text-warm outline-none hover:bg-warm-soft focus-visible:ring-2 focus-visible:ring-ring"
          >
            Hapus task
          </button>
        )}
        <SubmitButton>Simpan</SubmitButton>
      </div>
    </form>
  );
}

function EditButton({ task, lookups, label }: { task: Task; lookups: Lookups; label?: string }) {
  const ref = useRef<SheetHandle>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.open()}
        aria-label={`Ubah task: ${task.title}`}
        className="grid size-11 shrink-0 place-items-center rounded-full text-subtle outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Pencil className="size-[18px]" aria-hidden />
        {label && <span className="sr-only">{label}</span>}
      </button>
      <Sheet ref={ref} title="Ubah task">
        <TaskEditor task={task} lookups={lookups} sheetRef={ref} />
      </Sheet>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tampilan List
// ---------------------------------------------------------------------------

type Optimistic = { id: string; status: TaskStatus };
const applyStatus = (tasks: Task[], u: Optimistic) => tasks.map((t) => (t.id === u.id ? { ...t, status: u.status } : t));

export function TaskList({ tasks, contexts, projects, today, emptyText = "Belum ada task. Tambahkan di atas." }: { tasks: Task[]; emptyText?: string } & Lookups) {
  const [optimistic, setOptimistic] = useOptimistic(tasks, applyStatus);
  const [, startTransition] = useTransition();
  const lookups = { contexts, projects, today };

  function toggle(task: Task) {
    const status: TaskStatus = task.status === "done" ? "todo" : "done";
    startTransition(async () => {
      setOptimistic({ id: task.id, status });
      await setTaskStatus(task.id, status);
    });
  }

  const open = optimistic.filter((t) => t.status !== "done");
  const groups = [
    { key: "overdue", title: "Terlambat", items: open.filter((t) => t.due_date && dayDiff(t.due_date, today) < 0) },
    { key: "today", title: "Hari ini", items: open.filter((t) => t.due_date && dayDiff(t.due_date, today) === 0) },
    { key: "upcoming", title: "Mendatang", items: open.filter((t) => t.due_date && dayDiff(t.due_date, today) > 0) },
    { key: "nodue", title: "Tanpa tenggat", items: open.filter((t) => !t.due_date) },
    {
      key: "done",
      title: "Selesai",
      items: optimistic.filter((t) => t.status === "done").sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? "")).slice(0, 15),
    },
  ].filter((g) => g.items.length);

  if (!optimistic.length) return <p className="rounded-[24px] bg-card p-6 text-muted-foreground">{emptyText}</p>;

  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <section key={g.key} aria-labelledby={`grp-${g.key}`} className="flex flex-col gap-2">
          <h3
            id={`grp-${g.key}`}
            className={cn("px-1 text-xs font-semibold tracking-[0.14em] text-subtle uppercase", g.key === "overdue" && "text-warm")}
          >
            {g.title} · {g.items.length}
          </h3>
          <ul className="flex flex-col gap-2">
            {g.items.map((task) => {
              const done = task.status === "done";
              return (
                <li key={task.id} className={cn("flex items-center gap-3 rounded-[18px] bg-card py-2.5 pr-2 pl-3 transition-opacity", done && "opacity-70")}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={done}
                    aria-label={done ? `Tandai belum selesai: ${task.title}` : `Tandai selesai: ${task.title}`}
                    onClick={() => toggle(task)}
                    className="grid size-11 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "grid size-[22px] place-items-center rounded-[7px] border-[1.75px] border-subtle transition-colors",
                        done && "border-success bg-success text-white",
                      )}
                    >
                      {done && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                    </span>
                  </button>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className={cn("text-[15px] font-medium", done && "text-subtle line-through")}>{task.title}</span>
                    <TaskMeta task={task} {...lookups} />
                  </div>
                  {!done && task.priority !== "med" && (
                    <span className={cn("hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline", priorityTone[task.priority])}>
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                  )}
                  <EditButton task={task} lookups={lookups} />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tampilan Kanban
// ---------------------------------------------------------------------------

const COLUMNS: TaskStatus[] = ["todo", "doing", "done"];

export function KanbanBoard({ tasks, contexts, projects, today }: { tasks: Task[] } & Lookups) {
  const [optimistic, setOptimistic] = useOptimistic(tasks, applyStatus);
  const [, startTransition] = useTransition();
  const [over, setOver] = useState<TaskStatus | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const lookups = { contexts, projects, today };

  function move(id: string, status: TaskStatus) {
    const task = optimistic.find((t) => t.id === id);
    if (!task || task.status === status) return;
    startTransition(async () => {
      setOptimistic({ id, status });
      await setTaskStatus(id, status);
    });
  }

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
      {COLUMNS.map((col) => {
        const items = optimistic.filter((t) => t.status === col);
        return (
          <section
            key={col}
            aria-labelledby={`col-${col}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setOver(col);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              move(e.dataTransfer.getData("text/plain"), col);
            }}
            className={cn(
              "glass flex w-[85vw] shrink-0 snap-start flex-col gap-3 rounded-[28px] p-3 transition-[box-shadow] sm:w-[60vw] md:w-auto",
              over === col && "ring-2 ring-ring",
            )}
          >
            <h3 id={`col-${col}`} className="flex items-center justify-between px-2 pt-1 font-heading text-lg font-medium">
              {STATUS_LABEL[col]}
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{items.length}</span>
            </h3>
            <ul className="flex min-h-24 flex-col gap-2">
              {items.map((task) => (
                <li
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", task.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDragging(task.id);
                  }}
                  onDragEnd={() => setDragging(null)}
                  className={cn(
                    "group flex flex-col gap-2 rounded-[20px] bg-card p-3.5 transition-[transform,box-shadow,opacity] md:cursor-grab",
                    dragging === task.id && "rotate-2 opacity-60 shadow-lg",
                    col === "done" && "opacity-75",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="mt-0.5 hidden size-4 shrink-0 text-subtle md:block" aria-hidden />
                    <span className={cn("flex-1 text-[15px] leading-snug font-semibold", col === "done" && "text-subtle line-through")}>
                      {task.title}
                    </span>
                    {task.priority === "high" && col !== "done" && (
                      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", priorityTone.high)}>Tinggi</span>
                    )}
                  </div>
                  <TaskMeta task={task} {...lookups} />
                  <div className="flex items-center justify-between gap-2">
                    {/* Alternatif drag untuk sentuh & keyboard (WCAG 2.5.7) */}
                    <label className="sr-only" htmlFor={`move-${task.id}`}>
                      Pindahkan {task.title}
                    </label>
                    <select
                      id={`move-${task.id}`}
                      value={col}
                      onChange={(e) => move(task.id, e.target.value as TaskStatus)}
                      className="h-10 rounded-full border bg-background px-3 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c} value={c}>
                          {c === col ? STATUS_LABEL[c] : `→ ${STATUS_LABEL[c]}`}
                        </option>
                      ))}
                    </select>
                    <EditButton task={task} lookups={lookups} />
                  </div>
                </li>
              ))}
              {!items.length && (
                <li className="grid min-h-24 place-items-center rounded-[20px] border-[1.5px] border-dashed text-sm text-subtle">
                  Lepas task di sini
                </li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

"use client";

import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { Download, FileText, LoaderCircle, Paperclip, Plus, Trash2 } from "lucide-react";
import {
  addProjectFile,
  createProject,
  deleteProject,
  deleteProjectFile,
  setProjectFlag,
  updateProject,
} from "@/app/(private)/app/projects/actions";
import type { ActionResult } from "@/lib/lifeos/action-utils";
import {
  PROJECT_FILES_BUCKET,
  PROJECT_STATUS_LABEL,
  type ProjectFile,
  type ProjectRecord,
  type ProjectStatus,
} from "@/lib/lifeos/types";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Field, FormMessage, Sheet, SubmitButton, inputClass, textareaClass, type SheetHandle } from "./ui";

const CATEGORY_SUGGESTIONS = ["IoT", "Web", "Creative", "Organisasi", "Riset"];

// ---------------------------------------------------------------------------
// Project baru
// ---------------------------------------------------------------------------

export function NewProjectButton() {
  const ref = useRef<SheetHandle>(null);
  const [state, action] = useActionState<ActionResult, FormData>(createProject, {});
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.open()}
        className="flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Plus className="size-5" aria-hidden /> Project baru
      </button>
      <Sheet ref={ref} title="Project baru">
        <form action={action} className="flex flex-col gap-4">
          <Field label="Nama project" htmlFor="np-title">
            <input id="np-title" name="title" required maxLength={120} placeholder="mis. Sponsorship Teknisiade" className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori" htmlFor="np-category">
              <input id="np-category" name="category" required maxLength={30} list="project-categories" defaultValue="Web" className={inputClass} />
              <datalist id="project-categories">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Status" htmlFor="np-status">
              <select id="np-status" name="status" defaultValue="active" className={inputClass}>
                {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {PROJECT_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <FormMessage error={state.error} />
          <SubmitButton className="self-end" pendingText="Membuat…">
            Buat project
          </SubmitButton>
        </form>
      </Sheet>
    </>
  );
}

// ---------------------------------------------------------------------------
// Switch Publik / Unggulan
// ---------------------------------------------------------------------------

type Flags = { is_public: boolean; featured: boolean };

export function ProjectFlags({ id, isPublic, featured }: { id: string; isPublic: boolean; featured: boolean }) {
  const [flags, setFlags] = useOptimistic<Flags, Partial<Flags>>({ is_public: isPublic, featured }, (s, u) => ({ ...s, ...u }));
  const [error, setError] = useState<string>();
  const [, start] = useTransition();

  function toggle(flag: keyof Flags) {
    const value = !flags[flag];
    start(async () => {
      // Unggulan otomatis publik; publik dimatikan → unggulan ikut mati di tampilan publik.
      setFlags(flag === "featured" && value ? { featured: true, is_public: true } : { [flag]: value });
      const res = await setProjectFlag(id, flag, value);
      setError(res.error);
    });
  }

  const sw = (flag: keyof Flags, label: string, hint: string) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-[15px] font-medium">{label}</span>
        <span className="block text-[13px] text-subtle">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={flags[flag]}
        aria-label={label}
        onClick={() => toggle(flag)}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          flags[flag] ? "bg-primary" : "bg-border",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]",
            flags[flag] && "translate-x-6",
          )}
        />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col divide-y rounded-[24px] bg-card px-5">
      {sw("is_public", "Publik", "Tampil di halaman Portfolio")}
      {sw("featured", "Unggulan", "Tampil di halaman Welcome (otomatis publik)")}
      {error && (
        <p role="alert" className="py-3 text-sm font-medium text-warm">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form edit project (teks publik dua bahasa, K-17)
// ---------------------------------------------------------------------------

export function ProjectForm({ project }: { project: ProjectRecord }) {
  const [state, action] = useActionState<ActionResult, FormData>(updateProject.bind(null, project.id), {});
  const id = (k: string) => `pf-${k}`;
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama (Indonesia)" htmlFor={id("title-id")}>
          <input id={id("title-id")} name="title_id" required maxLength={120} defaultValue={project.title.id} className={inputClass} />
        </Field>
        <Field label="Nama (English)" htmlFor={id("title-en")} hint="Kosong → pakai versi Indonesia">
          <input id={id("title-en")} name="title_en" maxLength={120} defaultValue={project.title.en} className={inputClass} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Kategori" htmlFor={id("category")}>
          <input id={id("category")} name="category" required maxLength={30} list="project-categories-edit" defaultValue={project.category} className={inputClass} />
          <datalist id="project-categories-edit">
            {CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Status" htmlFor={id("status")}>
          <select id={id("status")} name="status" defaultValue={project.status} className={inputClass}>
            {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Gaya cover" htmlFor={id("cover")} hint="Sementara, sampai ada foto">
          <select id={id("cover")} name="cover_style" defaultValue={project.cover_style} className={inputClass}>
            <option value="pulse">Grafik sinyal</option>
            <option value="video">Video</option>
            <option value="dashboard">Dashboard</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Mulai" htmlFor={id("start")}>
          <input id={id("start")} name="start_date" type="date" defaultValue={project.start_date ?? ""} className={inputClass} />
        </Field>
        <Field label="Selesai" htmlFor={id("end")}>
          <input id={id("end")} name="end_date" type="date" defaultValue={project.end_date ?? ""} className={inputClass} />
        </Field>
        <Field label="Slug (alamat publik)" htmlFor={id("slug")} hint={`/portfolio/${project.slug}`}>
          <input id={id("slug")} name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={project.slug} className={inputClass} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ringkasan (Indonesia)" htmlFor={id("sum-id")}>
          <textarea id={id("sum-id")} name="summary_id" rows={3} maxLength={600} defaultValue={project.summary.id} className={textareaClass} />
        </Field>
        <Field label="Summary (English)" htmlFor={id("sum-en")}>
          <textarea id={id("sum-en")} name="summary_en" rows={3} maxLength={600} defaultValue={project.summary.en} className={textareaClass} />
        </Field>
        <Field label="Sorotan (Indonesia)" htmlFor={id("hl-id")} hint="Satu poin per baris">
          <textarea id={id("hl-id")} name="highlights_id" rows={4} defaultValue={project.highlights.id?.join("\n")} className={textareaClass} />
        </Field>
        <Field label="Highlights (English)" htmlFor={id("hl-en")} hint="One point per line">
          <textarea id={id("hl-en")} name="highlights_en" rows={4} defaultValue={project.highlights.en?.join("\n")} className={textareaClass} />
        </Field>
        <Field label="Hasil (Indonesia)" htmlFor={id("res-id")} hint="mis. Juara 1, Finalis PKM">
          <input id={id("res-id")} name="result_id" maxLength={160} defaultValue={project.result?.id ?? ""} className={inputClass} />
        </Field>
        <Field label="Result (English)" htmlFor={id("res-en")}>
          <input id={id("res-en")} name="result_en" maxLength={160} defaultValue={project.result?.en ?? ""} className={inputClass} />
        </Field>
      </div>
      <Field label="Tech stack / tools" htmlFor={id("tech")} hint="Pisahkan dengan koma">
        <input id={id("tech")} name="tech_stack" defaultValue={project.tech_stack.join(", ")} className={inputClass} />
      </Field>
      <Field label="Link" htmlFor={id("links")} hint="Satu per baris: Label | https://… (GitHub, Drive, Figma)">
        <textarea
          id={id("links")}
          name="links"
          rows={3}
          placeholder={"GitHub | https://github.com/…\nProposal | https://drive.google.com/…"}
          defaultValue={project.links.map((l) => `${l.label} | ${l.url}`).join("\n")}
          className={textareaClass}
        />
      </Field>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <FormMessage error={state.error} ok={state.ok} okText="Tersimpan." />
        <SubmitButton>Simpan perubahan</SubmitButton>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Lampiran (upload langsung ke Storage, path <user>/<project>/<waktu>-<nama>)
// ---------------------------------------------------------------------------

const MAX_BYTES = 50 * 1024 * 1024;
const fmtSize = (n: number | null) =>
  n == null ? "" : n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

export function ProjectFiles({ projectId, userId, files }: { projectId: string; userId: string; files: ProjectFile[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [removing, startRemove] = useTransition();

  async function upload(list: FileList | null) {
    if (!list?.length) return;
    setError(undefined);
    const supabase = createClient();
    for (const file of Array.from(list)) {
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" lebih dari 50 MB (batas paket Free).`);
        continue;
      }
      setBusy(file.name);
      const safe = file.name.normalize("NFKD").replace(/[^\w.\-]+/g, "_").slice(-120);
      const path = `${userId}/${projectId}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from(PROJECT_FILES_BUCKET).upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (upErr) {
        setError(`Gagal mengunggah "${file.name}".`);
        continue;
      }
      const res = await addProjectFile({ projectId, name: file.name, path, mime: file.type || null, size: file.size });
      if (res.error) setError(res.error);
    }
    setBusy(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="file-upload"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[24px] border-[1.5px] border-dashed bg-card px-6 py-8 text-center outline-none has-focus-visible:ring-2 has-focus-visible:ring-ring"
      >
        {busy ? <LoaderCircle className="size-6 animate-spin text-primary" aria-hidden /> : <Paperclip className="size-6 text-primary" aria-hidden />}
        <span className="text-[15px] font-semibold">{busy ? `Mengunggah ${busy}…` : "Tambah lampiran"}</span>
        <span className="text-[13px] text-subtle">PDF, gambar, dokumen — maks. 50 MB per file. Bisa juga seret ke sini.</span>
        <input ref={inputRef} id="file-upload" type="file" multiple className="sr-only" disabled={!!busy} onChange={(e) => upload(e.target.files)} />
      </label>
      {error && (
        <p role="alert" className="text-sm font-medium text-warm">
          {error}
        </p>
      )}
      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 rounded-[18px] bg-card py-2 pr-2 pl-4">
              <FileText className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{f.name}</span>
                <span className="block text-[13px] text-subtle">{fmtSize(f.size)}</span>
              </span>
              {f.url && (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka ${f.name}`}
                  className="grid size-11 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="size-[18px]" aria-hidden />
                </a>
              )}
              <button
                type="button"
                disabled={removing}
                onClick={() => {
                  if (!confirm(`Hapus lampiran "${f.name}"?`)) return;
                  startRemove(async () => {
                    const res = await deleteProjectFile(f.id);
                    setError(res.error);
                  });
                }}
                aria-label={`Hapus ${f.name}`}
                className="grid size-11 place-items-center rounded-full text-warm outline-none hover:bg-warm-soft focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                <Trash2 className="size-[18px]" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hapus project
// ---------------------------------------------------------------------------

export function DeleteProject({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 6000);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <div className="flex flex-col gap-3 rounded-[24px] border-[1.5px] border-warm/30 p-5">
      <div>
        <p className="font-medium">Hapus project</p>
        <p className="text-[13px] text-subtle">Lampiran ikut terhapus. Task tetap ada, menjadi “tanpa project”.</p>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirming) return setConfirming(true);
          start(async () => {
            const res = await deleteProject(id);
            if (res?.error) setError(res.error);
          });
        }}
        className={cn(
          "h-11 w-fit rounded-full px-5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
          confirming ? "bg-warm text-white" : "text-warm hover:bg-warm-soft",
        )}
      >
        {pending ? "Menghapus…" : confirming ? `Ya, hapus "${title}"` : "Hapus project"}
      </button>
      {error && (
        <p role="alert" className="text-sm font-medium text-warm">
          {error}
        </p>
      )}
    </div>
  );
}

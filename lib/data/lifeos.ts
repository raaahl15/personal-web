import "server-only";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  PROJECT_FILES_BUCKET,
  type Context,
  type JournalDay,
  type JournalEntry,
  type ProjectFile,
  type ProjectRecord,
  type ProjectSummary,
  type Task,
} from "@/lib/lifeos/types";

/**
 * Data Access Layer Life OS. Setiap fungsi memastikan user login (DAL), lalu membaca lewat
 * client ber-sesi sehingga RLS hanya mengembalikan data milik user. Panggil di dalam <Suspense>.
 */

export class DatabaseNotReadyError extends Error {
  constructor() {
    super("DATABASE_NOT_READY");
  }
}

function check<T>(res: { data: T | null; error: { code?: string; message: string } | null }): T {
  if (res.error) {
    // PGRST205/42P01 = tabel belum ada → migration belum dijalankan.
    if (res.error.code === "PGRST205" || res.error.code === "42P01") throw new DatabaseNotReadyError();
    throw new Error(res.error.message);
  }
  return res.data as T;
}

async function db() {
  await getCurrentUser();
  return createClient();
}

const TASK_COLUMNS = "id,title,description,status,priority,due_date,completed_at,project_id,context_id,created_at";

export async function getContexts(): Promise<Context[]> {
  const supabase = await db();
  return check(await supabase.from("contexts").select("id,name,color,position").order("position").order("created_at"));
}

export async function getTasks(filter: { contextId?: string; projectId?: string } = {}): Promise<Task[]> {
  const supabase = await db();
  let query = supabase.from("tasks").select(TASK_COLUMNS);
  if (filter.contextId) query = query.eq("context_id", filter.contextId);
  if (filter.projectId) query = query.eq("project_id", filter.projectId);
  return check(
    await query
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .returns<Task[]>(),
  );
}

type ProjectWithTasks = Omit<ProjectSummary, "taskTotal" | "taskDone"> & { tasks: { status: string }[] };

export async function getProjects(): Promise<ProjectSummary[]> {
  const supabase = await db();
  const rows = check(
    await supabase
      .from("projects")
      .select("id,slug,title,summary,category,status,is_public,featured,start_date,end_date,updated_at,tasks(status)")
      .order("updated_at", { ascending: false })
      .returns<ProjectWithTasks[]>(),
  );
  return rows.map(({ tasks, ...p }) => ({
    ...p,
    taskTotal: tasks.length,
    taskDone: tasks.filter((t) => t.status === "done").length,
  }));
}

/** Daftar ringkas untuk pilihan "Project" di form task. */
export async function getProjectOptions(): Promise<{ id: string; title: string }[]> {
  const supabase = await db();
  const rows = check(
    await supabase
      .from("projects")
      .select("id,title,status")
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
      .returns<{ id: string; title: { id: string; en: string }; status: string }[]>(),
  );
  return rows.map((r) => ({ id: r.id, title: r.title.id || r.title.en }));
}

export async function getProject(id: string): Promise<ProjectRecord | null> {
  const supabase = await db();
  const res = await supabase
    .from("projects")
    .select(
      "id,slug,title,summary,highlights,result,category,status,cover_style,tech_stack,links,is_public,featured,start_date,end_date,updated_at",
    )
    .eq("id", id)
    .maybeSingle<ProjectRecord>();
  return check(res);
}

// ---------------------------------------------------------------------------
// Journal (Fase 4)
// ---------------------------------------------------------------------------

type JournalRow = { entry_date: string; title: string; mood: number | null; tags: string[]; content_text: string };
const JOURNAL_DAY_COLUMNS = "entry_date,title,mood,tags,content_text";

const toDay = (r: JournalRow): JournalDay => {
  // content_text = judul + isi + tag (lihat saveJournalEntry); cuplikan = isi tanpa judul.
  const body = r.title && r.content_text.startsWith(r.title) ? r.content_text.slice(r.title.length) : r.content_text;
  const snippet = body.replace(/\s+/g, " ").trim();
  return {
    entry_date: r.entry_date,
    title: r.title,
    mood: r.mood,
    tags: r.tags,
    snippet: snippet.length > 160 ? `${snippet.slice(0, 157)}…` : snippet,
  };
};

export async function getJournalEntry(date: string): Promise<JournalEntry | null> {
  const supabase = await db();
  return check(
    await supabase
      .from("journal_entries")
      .select("id,entry_date,title,content,mood,tags,updated_at")
      .eq("entry_date", date)
      .maybeSingle<JournalEntry>(),
  );
}

/** Semua entri dalam rentang tanggal (inklusif) — untuk kalender bulanan. */
export async function getJournalRange(from: string, to: string): Promise<JournalDay[]> {
  const supabase = await db();
  const rows = check(
    await supabase
      .from("journal_entries")
      .select(JOURNAL_DAY_COLUMNS)
      .gte("entry_date", from)
      .lte("entry_date", to)
      .order("entry_date")
      .returns<JournalRow[]>(),
  );
  return rows.map(toDay);
}

export async function getRecentJournal(limit = 6): Promise<JournalDay[]> {
  const supabase = await db();
  const rows = check(
    await supabase
      .from("journal_entries")
      .select(JOURNAL_DAY_COLUMNS)
      .neq("content_text", "")
      .order("entry_date", { ascending: false })
      .limit(limit)
      .returns<JournalRow[]>(),
  );
  return rows.map(toDay);
}

/** Pencarian teks (judul, isi, tag) — tidak peka huruf besar/kecil. */
export async function searchJournal(query: string, limit = 50): Promise<JournalDay[]> {
  const supabase = await db();
  const pattern = `%${query.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const rows = check(
    await supabase
      .from("journal_entries")
      .select(JOURNAL_DAY_COLUMNS)
      .ilike("content_text", pattern)
      .order("entry_date", { ascending: false })
      .limit(limit)
      .returns<JournalRow[]>(),
  );
  return rows.map(toDay);
}

/** Lampiran + URL unduh bertanda tangan (berlaku 1 jam; bucket privat). */
export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  const supabase = await db();
  const files = check(
    await supabase
      .from("project_files")
      .select("id,name,storage_path,mime_type,size,created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .returns<Omit<ProjectFile, "url">[]>(),
  );
  if (!files.length) return [];
  const { data: signed } = await supabase.storage
    .from(PROJECT_FILES_BUCKET)
    .createSignedUrls(
      files.map((f) => f.storage_path),
      3600,
    );
  return files.map((f, i) => ({ ...f, url: signed?.[i]?.signedUrl ?? null }));
}

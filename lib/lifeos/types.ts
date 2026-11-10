// Tipe data Life OS (cermin tabel di supabase/migrations/0001_projects_tasks.sql).
import type { Localized } from "@/lib/i18n";

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "med" | "high";
export type ProjectStatus = "idea" | "active" | "done" | "archived";
export type CoverStyle = "pulse" | "video" | "dashboard" | "plant" | "cells";

export type Context = { id: string; name: string; color: string; position: number };

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  project_id: string | null;
  context_id: string | null;
  created_at: string;
};

export type ProjectLink = { label: string; url: string };

export type ProjectRecord = {
  id: string;
  slug: string;
  title: Localized;
  summary: Localized;
  highlights: Localized<string[]>;
  result: Localized | null;
  category: string;
  status: ProjectStatus;
  cover_style: CoverStyle;
  tech_stack: string[];
  links: ProjectLink[];
  is_public: boolean;
  featured: boolean;
  start_date: string | null;
  end_date: string | null;
  updated_at: string;
};

export type ProjectSummary = Pick<
  ProjectRecord,
  "id" | "slug" | "title" | "summary" | "category" | "status" | "is_public" | "featured" | "start_date" | "end_date" | "updated_at"
> & { taskTotal: number; taskDone: number };

export type ProjectFile = {
  id: string;
  name: string;
  storage_path: string;
  mime_type: string | null;
  size: number | null;
  created_at: string;
  url: string | null;
};

/** Entri jurnal harian (tabel journal_entries, migration 0003). `content` = blok BlockNote. */
export type JournalEntry = {
  id: string;
  entry_date: string; // YYYY-MM-DD
  title: string;
  content: unknown[];
  mood: number | null;
  tags: string[];
  updated_at: string;
};

/** Ringkasan entri untuk kalender, daftar terbaru, dan hasil pencarian. */
export type JournalDay = { entry_date: string; title: string; mood: number | null; tags: string[]; snippet: string };

export const MOODS = [
  { value: 1, emoji: "😞", label: "Berat" },
  { value: 2, emoji: "😕", label: "Kurang" },
  { value: 3, emoji: "😐", label: "Biasa" },
  { value: 4, emoji: "🙂", label: "Baik" },
  { value: 5, emoji: "😄", label: "Hebat" },
] as const;

export const STATUS_LABEL: Record<TaskStatus, string> = { todo: "To Do", doing: "Dikerjakan", done: "Selesai" };
export const PRIORITY_LABEL: Record<TaskPriority, string> = { low: "Rendah", med: "Sedang", high: "Tinggi" };
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  idea: "Ide",
  active: "Aktif",
  done: "Selesai",
  archived: "Arsip",
};
export const PROJECT_FILES_BUCKET = "project-files";

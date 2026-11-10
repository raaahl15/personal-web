"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import {
  authedClient,
  dbError,
  firstError,
  optionalDate,
  optionalText,
  optionalUuid,
  type ActionResult,
} from "@/lib/lifeos/action-utils";

const taskSchema = z.object({
  title: z.string().trim().min(1, "Judul task wajib diisi.").max(200, "Judul maksimal 200 karakter."),
  description: optionalText(5000),
  status: z.enum(["todo", "doing", "done"]).default("todo"),
  priority: z.enum(["low", "med", "high"]).default("med"),
  due_date: optionalDate,
  context_id: optionalUuid,
  project_id: optionalUuid,
});

const fromForm = (formData: FormData) => ({
  title: formData.get("title") ?? "",
  description: formData.get("description") ?? undefined,
  status: formData.get("status") || undefined,
  priority: formData.get("priority") || undefined,
  due_date: formData.get("due_date") ?? undefined,
  context_id: formData.get("context_id") ?? undefined,
  project_id: formData.get("project_id") ?? undefined,
});

export async function createTask(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(fromForm(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  const { supabase } = await authedClient();
  const t = parsed.data;
  const { error } = await supabase.from("tasks").insert({
    ...t,
    description: t.description ?? null,
    completed_at: t.status === "done" ? new Date().toISOString() : null,
  });
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

export async function updateTask(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(fromForm(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  if (!z.uuid().safeParse(id).success) return { error: "Task tidak ditemukan." };

  const { supabase } = await authedClient();
  const t = parsed.data;
  const { data: current } = await supabase.from("tasks").select("status,completed_at").eq("id", id).maybeSingle();
  const completed_at =
    t.status === "done" ? (current?.status === "done" ? current.completed_at : new Date().toISOString()) : null;

  const { error } = await supabase
    .from("tasks")
    .update({ ...t, description: t.description ?? null, completed_at })
    .eq("id", id);
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

export async function setTaskStatus(id: string, status: "todo" | "doing" | "done"): Promise<ActionResult> {
  const parsed = z.object({ id: z.uuid(), status: z.enum(["todo", "doing", "done"]) }).safeParse({ id, status });
  if (!parsed.success) return { error: "Data tidak valid." };

  const { supabase } = await authedClient();
  const { error } = await supabase
    .from("tasks")
    .update({ status, completed_at: status === "done" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { error: "Task tidak ditemukan." };
  const { supabase } = await authedClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

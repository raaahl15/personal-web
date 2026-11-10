"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { PUBLIC_PROJECTS_TAG } from "@/lib/data/public-projects";
import {
  authedClient,
  dbError,
  firstError,
  optionalDate,
  optionalText,
  slugify,
  type ActionResult,
} from "@/lib/lifeos/action-utils";
import { PROJECT_FILES_BUCKET } from "@/lib/lifeos/types";

const status = z.enum(["idea", "active", "done", "archived"]);
const lines = (v: unknown) =>
  typeof v === "string"
    ? v
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

/** Ubah project → halaman publik (Portfolio/Welcome) ikut segar. */
function touchPublic() {
  updateTag(PUBLIC_PROJECTS_TAG);
  refresh();
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof authedClient>>["supabase"], base: string, exceptId?: string) {
  const { data } = await supabase.from("projects").select("id,slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).filter((p) => p.id !== exceptId).map((p) => p.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

const createSchema = z.object({
  title: z.string().trim().min(1, "Nama project wajib diisi.").max(120),
  category: z.string().trim().min(1, "Kategori wajib diisi.").max(30),
  status,
});

export async function createProject(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = createSchema.safeParse({
    title: formData.get("title") ?? "",
    category: formData.get("category") ?? "",
    status: formData.get("status") ?? "active",
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const { supabase } = await authedClient();
  const { title, category, status: st } = parsed.data;
  const slug = await uniqueSlug(supabase, slugify(title));
  const { data, error } = await supabase
    .from("projects")
    .insert({ slug, title: { id: title, en: "" }, category, status: st })
    .select("id")
    .single();
  if (error || !data) return dbError(error?.message ?? "");
  redirect(`/app/projects/${data.id}`);
}

const updateSchema = z.object({
  title_id: z.string().trim().min(1, "Nama project (ID) wajib diisi.").max(120),
  title_en: optionalText(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung (mis. gromics-v2)."),
  summary_id: optionalText(600),
  summary_en: optionalText(600),
  result_id: optionalText(160),
  result_en: optionalText(160),
  category: z.string().trim().min(1, "Kategori wajib diisi.").max(30),
  status,
  cover_style: z.enum(["pulse", "video", "dashboard"]),
  start_date: optionalDate,
  end_date: optionalDate,
});

export async function updateProject(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { error: "Project tidak ditemukan." };
  const get = (k: string) => formData.get(k) ?? undefined;
  const parsed = updateSchema.safeParse({
    title_id: get("title_id") ?? "",
    title_en: get("title_en"),
    slug: get("slug") ?? "",
    summary_id: get("summary_id"),
    summary_en: get("summary_en"),
    result_id: get("result_id"),
    result_en: get("result_en"),
    category: get("category") ?? "",
    status: get("status"),
    cover_style: get("cover_style"),
    start_date: get("start_date"),
    end_date: get("end_date"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };
  const p = parsed.data;
  if (p.start_date && p.end_date && p.end_date < p.start_date) {
    return { error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
  }

  // Link: satu per baris, format "Label | https://…"
  const links: { label: string; url: string }[] = [];
  for (const line of lines(formData.get("links"))) {
    const [label, url] = line.includes("|") ? line.split("|").map((s) => s.trim()) : [line, line];
    if (!z.url({ protocol: /^https?$/ }).safeParse(url).success) {
      return { error: `Link tidak valid: "${line}". Format: Label | https://…` };
    }
    links.push({ label: label || url, url });
  }

  const { supabase } = await authedClient();
  const slug = await uniqueSlug(supabase, p.slug, id);
  const { error } = await supabase
    .from("projects")
    .update({
      slug,
      title: { id: p.title_id, en: p.title_en ?? "" },
      summary: { id: p.summary_id ?? "", en: p.summary_en ?? "" },
      highlights: { id: lines(formData.get("highlights_id")), en: lines(formData.get("highlights_en")) },
      result: p.result_id || p.result_en ? { id: p.result_id ?? "", en: p.result_en ?? "" } : null,
      category: p.category,
      status: p.status,
      cover_style: p.cover_style,
      tech_stack: String(formData.get("tech_stack") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20),
      links,
      start_date: p.start_date ?? null,
      end_date: p.end_date ?? null,
    })
    .eq("id", id);
  if (error) return dbError(error.message);
  touchPublic();
  return { ok: true };
}

export async function setProjectFlag(id: string, flag: "is_public" | "featured", value: boolean): Promise<ActionResult> {
  const parsed = z
    .object({ id: z.uuid(), flag: z.enum(["is_public", "featured"]), value: z.boolean() })
    .safeParse({ id, flag, value });
  if (!parsed.success) return { error: "Data tidak valid." };

  const { supabase } = await authedClient();
  // Unggulan hanya masuk akal untuk project publik.
  const patch = flag === "featured" && value ? { featured: true, is_public: true } : { [flag]: value };
  const { error } = await supabase.from("projects").update(patch).eq("id", id);
  if (error) return dbError(error.message);
  touchPublic();
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { error: "Project tidak ditemukan." };
  const { supabase } = await authedClient();

  const { data: files } = await supabase.from("project_files").select("storage_path").eq("project_id", id);
  if (files?.length) {
    await supabase.storage.from(PROJECT_FILES_BUCKET).remove(files.map((f) => f.storage_path));
  }
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return dbError(error.message);
  updateTag(PUBLIC_PROJECTS_TAG);
  redirect("/app/projects");
}

const fileSchema = z.object({
  projectId: z.uuid(),
  name: z.string().trim().min(1).max(200),
  path: z.string().min(1).max(500),
  mime: z.string().max(120).nullable(),
  size: z.number().int().nonnegative().max(52_428_800),
});

/** Dipanggil setelah file diunggah langsung dari browser ke Storage (path diawali id user). */
export async function addProjectFile(input: z.input<typeof fileSchema>): Promise<ActionResult> {
  const parsed = fileSchema.safeParse(input);
  if (!parsed.success) return { error: "Data file tidak valid." };
  const { user, supabase } = await authedClient();
  const f = parsed.data;
  if (!f.path.startsWith(`${user.id}/${f.projectId}/`)) return { error: "Lokasi file tidak valid." };

  const { error } = await supabase.from("project_files").insert({
    project_id: f.projectId,
    name: f.name,
    storage_path: f.path,
    mime_type: f.mime,
    size: f.size,
  });
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

export async function deleteProjectFile(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { error: "File tidak ditemukan." };
  const { supabase } = await authedClient();
  const { data } = await supabase.from("project_files").select("storage_path").eq("id", id).maybeSingle();
  if (!data) return { error: "File tidak ditemukan." };
  await supabase.storage.from(PROJECT_FILES_BUCKET).remove([data.storage_path]);
  const { error } = await supabase.from("project_files").delete().eq("id", id);
  if (error) return dbError(error.message);
  refresh();
  return { ok: true };
}

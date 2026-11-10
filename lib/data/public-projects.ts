import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { projects as fallbackProjects, type Project } from "@/content/profile";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Localized } from "@/lib/i18n";

export const PUBLIC_PROJECTS_TAG = "public-projects";

type PublicRow = {
  slug: string;
  title: Localized;
  summary: Localized;
  highlights: Localized<string[]>;
  result: Localized | null;
  category: string;
  status: string;
  cover_style: Project["cover"];
  featured: boolean;
  start_date: string | null;
  end_date: string | null;
  tech_stack: string[] | null;
  links: { label?: unknown; url?: unknown }[] | null;
};

const shortTitle = (title: string) => title.split(" — ")[0].trim();

/** Hanya tautan http(s) yang valid yang boleh tampil di situs publik. */
function safeLinks(links: PublicRow["links"]): NonNullable<Project["links"]> {
  if (!Array.isArray(links)) return [];
  return links.flatMap((l) => {
    if (typeof l?.url !== "string") return [];
    try {
      const u = new URL(l.url);
      if (u.protocol !== "https:" && u.protocol !== "http:") return [];
      const label = typeof l.label === "string" && l.label.trim() ? l.label.trim() : u.hostname;
      return [{ label, url: u.href }];
    } catch {
      return [];
    }
  });
}

function toProject(row: PublicRow): Project {
  const en = row.title.en || row.title.id;
  const id = row.title.id || row.title.en;
  return {
    slug: row.slug,
    title: { en, id },
    shortTitle: shortTitle(en),
    category: row.category,
    year: (row.end_date ?? row.start_date ?? "").slice(0, 4) || "—",
    status: row.status === "done" ? "done" : "active",
    summary: { en: row.summary.en || row.summary.id, id: row.summary.id || row.summary.en },
    highlights: {
      en: row.highlights.en?.length ? row.highlights.en : row.highlights.id ?? [],
      id: row.highlights.id?.length ? row.highlights.id : row.highlights.en ?? [],
    },
    result: row.result ? { en: row.result.en || row.result.id, id: row.result.id || row.result.en } : undefined,
    cover: row.cover_style,
    featured: row.featured,
    techStack: row.tech_stack ?? [],
    links: safeLinks(row.links),
  };
}

/**
 * Project publik untuk situs (Portfolio, Welcome, detail). Di-cache dan di-tag; Server Action
 * di Life OS memanggil updateTag(PUBLIC_PROJECTS_TAG) setiap kali project berubah.
 * Gagal / belum dikonfigurasi / kosong → pakai data cadangan dari content/profile.ts.
 */
export async function getPublicProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(PUBLIC_PROJECTS_TAG);
  cacheLife("hours");

  if (!isSupabaseConfigured) return fallbackProjects;
  try {
    const { data, error } = await createPublicClient()
      .from("projects")
      .select("slug,title,summary,highlights,result,category,status,cover_style,featured,start_date,end_date,tech_stack,links")
      .eq("is_public", true)
      .order("featured", { ascending: false })
      .order("end_date", { ascending: false, nullsFirst: true })
      .returns<PublicRow[]>();
    if (error || !data?.length) return fallbackProjects;
    return data.map(toProject);
  } catch {
    return fallbackProjects;
  }
}

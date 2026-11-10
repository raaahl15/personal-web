"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FolderCard } from "./folder-card";

/** Filter kategori + grid kartu folder di halaman Portfolio. */
export function ProjectFilter({
  projects,
  lang,
  labels,
}: {
  projects: Project[];
  lang: Locale;
  labels: { all: string; showing: string; filterLabel: string; empty: string; viewProject: string };
}) {
  const categories = Array.from(new Set(projects.map((p) => p.category))) as ProjectCategory[];
  const [active, setActive] = useState<ProjectCategory | "all">("all");
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  const chip = (value: ProjectCategory | "all", label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={active === value}
      onClick={() => setActive(value)}
      className={cn(
        "h-11 rounded-full border px-5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        active === value && "border-transparent bg-foreground font-semibold text-background hover:text-background",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
          {chip("all", labels.all)}
          {categories.map((c) => chip(c, c))}
        </div>
        <p aria-live="polite" className="text-sm font-medium text-subtle">
          {labels.showing.replace("{count}", String(visible.length)).replace("{total}", String(projects.length))}
        </p>
      </div>
      {visible.length === 0 ? (
        <p className="text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <li key={p.slug}>
              <FolderCard
                project={p}
                lang={lang}
                highlight={i === 0 && active === "all"}
                metaLabel={`${p.category} · ${p.year}`}
                linkLabel={labels.viewProject}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/profile";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

/**
 * Kartu folder (K-11): saat hover/fokus, "kertas" di belakang menyembul ke atas.
 * `highlight` = kartu biru (unggulan pertama).
 */
export function FolderCard({
  project,
  lang,
  highlight = false,
  metaLabel,
  linkLabel,
}: {
  project: Project;
  lang: Locale;
  highlight?: boolean;
  metaLabel: string;
  linkLabel: string;
}) {
  return (
    <Link
      href={localePath(lang, `/portfolio/${project.slug}`)}
      aria-label={`${linkLabel}: ${project.title[lang]}`}
      className="group relative block pt-14 outline-none"
    >
      {/* kertas */}
      <span
        aria-hidden
        className="absolute top-6 left-12 h-40 w-[72%] -rotate-2 rounded-2xl border bg-card shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-6 group-hover:-rotate-5 group-focus-visible:-translate-y-6 group-focus-visible:-rotate-5"
      />
      {/* tab folder */}
      <span
        aria-hidden
        className={cn("absolute top-8 left-0 h-12 w-36 rounded-t-[20px]", highlight ? "bg-primary" : "bg-muted")}
      />
      <span
        className={cn(
          "relative flex min-h-[26rem] flex-col gap-3.5 rounded-[32px] rounded-tl-none p-6 transition-[transform,box-shadow] duration-300 ease-out group-hover:translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring",
          highlight ? "bg-primary text-primary-foreground shadow-[0_20px_40px_rgb(22_98_204/0.25)]" : "bg-muted",
        )}
      >
        <span className="flex items-center justify-between">
          <span className={cn("text-[13px] font-semibold", highlight ? "text-primary-foreground/90" : "text-subtle")}>
            {metaLabel}
          </span>
          <span
            className={cn(
              "grid size-11 place-items-center rounded-full",
              highlight ? "bg-primary-foreground text-primary" : "bg-card text-foreground",
            )}
          >
            <ArrowUpRight
              className="size-5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </span>
        <ProjectCover cover={project.cover} className="h-48 rounded-[20px]" />
        <span className="font-heading text-[28px] leading-tight font-medium">{project.shortTitle}</span>
        <span className={cn("text-[15px] leading-relaxed", highlight ? "text-primary-foreground/85" : "text-muted-foreground")}>
          {project.summary[lang]}
        </span>
      </span>
    </Link>
  );
}

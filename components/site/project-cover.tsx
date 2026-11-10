import { Play } from "lucide-react";
import type { Project } from "@/content/profile";
import { cn } from "@/lib/utils";

/**
 * Cover sementara (tanpa foto) sesuai desain v1.0. Diganti foto asli dari
 * Drive `04 - Portfolio Content` saat tersedia.
 */
export function ProjectCover({ cover, className }: { cover: Project["cover"]; className?: string }) {
  if (cover === "video") {
    return (
      <div aria-hidden className={cn("grid place-items-center bg-linear-to-tr from-sky-200 to-sky-50", className)}>
        <span className="grid size-16 place-items-center rounded-full bg-white/80 text-sky-600 backdrop-blur-md">
          <Play className="size-6 translate-x-0.5 fill-current" />
        </span>
      </div>
    );
  }

  if (cover === "dashboard") {
    return (
      <div aria-hidden className={cn("flex gap-2.5 bg-sky-950 p-4", className)}>
        <span className="w-7 shrink-0 rounded-full bg-sky-800" />
        <span className="grid flex-1 grid-cols-2 gap-2">
          <span className="rounded-xl bg-sky-750" />
          <span className="rounded-xl bg-sky-400" />
          <span className="rounded-xl bg-sky-800" />
          <span className="rounded-xl bg-sky-800" />
        </span>
      </div>
    );
  }

  return (
    <div aria-hidden className={cn("relative overflow-hidden bg-linear-to-tr from-sky-750 to-sky-350", className)}>
      <svg viewBox="0 0 336 120" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-1/2 w-full -translate-y-1/2">
        <path
          d="M0 60 L60 60 L74 30 L88 90 L102 10 L116 70 L130 60 L200 60 L214 40 L228 80 L242 60 L336 60"
          fill="none"
          stroke="#f0f7ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

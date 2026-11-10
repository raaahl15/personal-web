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

  if (cover === "plant") {
    // Sketsa P&ID: drum umpan → pemanas → reaktor, dengan gelembung instrumen (ISA-5.1).
    return (
      <div aria-hidden className={cn("relative overflow-hidden bg-linear-to-br from-sky-800 to-sky-900", className)}>
        <svg viewBox="0 0 336 160" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full">
          <g fill="none" stroke="#5caeff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
            <rect x="34" y="78" width="54" height="34" rx="17" />
            <path d="M88 95 H128" />
            <circle cx="146" cy="95" r="18" />
            <path d="M134 83 L158 107 M158 83 L134 107" strokeWidth="1.5" />
            <path d="M164 95 H212" />
            <rect x="212" y="46" width="40" height="92" rx="20" />
            <path d="M252 70 H302" />
          </g>
          <g fill="none" stroke="#f0f7ff" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke">
            <path d="M232 46 V30 H178 V56" />
            <path d="M108 95 V56" />
          </g>
          <g fill="#0a3b7a" stroke="#f0f7ff" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
            <circle cx="178" cy="56" r="13" />
            <circle cx="108" cy="56" r="13" />
          </g>
          <g fill="#f0f7ff" fontSize="8" fontFamily="ui-sans-serif, system-ui" textAnchor="middle">
            <text x="178" y="59">TIC</text>
            <text x="108" y="59">FIC</text>
          </g>
        </svg>
      </div>
    );
  }

  if (cover === "cells") {
    // Citra sel: bidang mikroskop dengan beberapa sel (inti + membran).
    const cells = [
      [70, 52, 22], [132, 104, 18], [196, 48, 26], [262, 98, 20], [104, 132, 12], [300, 36, 14], [40, 116, 15],
    ] as const;
    return (
      <div aria-hidden className={cn("relative overflow-hidden bg-linear-to-br from-sky-750 to-sky-900", className)}>
        <svg viewBox="0 0 336 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          {cells.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="#1e7dff" fillOpacity="0.18" stroke="#78baff" strokeWidth="1.5" />
              <circle cx={x + r * 0.15} cy={y - r * 0.1} r={r * 0.45} fill="#5caeff" fillOpacity="0.55" />
            </g>
          ))}
          <circle cx="196" cy="48" r="34" fill="none" stroke="#f0f7ff" strokeWidth="1.5" strokeDasharray="5 4" />
        </svg>
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

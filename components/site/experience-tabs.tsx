"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ExperienceTab = {
  id: string;
  label: string;
  items: { period: string; org: string; role: string; points: string[] }[];
};

const INITIAL = 3;

/** Tab pengalaman (pola WAI-ARIA tabs: panah kiri/kanan pindah tab) + timeline vertikal. */
export function ExperienceTabs({ tabs, showMoreLabel }: { tabs: ExperienceTab[]; showMoreLabel: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  function select(i: number) {
    setActive(i);
    setExpanded(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    select(next);
    tabRefs.current[next]?.focus();
  }

  const tab = tabs[active];
  const items = expanded ? tab.items : tab.items.slice(0, INITIAL);
  const hidden = tab.items.length - items.length;

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" onKeyDown={onKeyDown} className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-muted p-1">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={cn(
              "h-11 shrink-0 rounded-full px-5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              i === active && "bg-card font-semibold text-foreground shadow-sm",
            )}
          >
            {t.label} · {t.items.length}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`}>
        <ol>
          {items.map((item, i) => (
            <li key={item.org + item.role} className="grid grid-cols-[20px_1fr] gap-x-6">
              <span className="flex flex-col items-center pt-1.5" aria-hidden>
                <span className="size-4 shrink-0 rounded-full bg-primary ring-4 ring-primary-soft" />
                {i < items.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-border" />}
              </span>
              <div className="pb-9">
                <p className="text-[13px] font-semibold text-subtle">
                  {item.period} · {item.org}
                </p>
                <h3 className="mt-1.5 text-2xl font-medium">{item.role}</h3>
                <ul className="mt-2 flex flex-col gap-1.5 text-[15px] leading-relaxed text-muted-foreground">
                  {item.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="h-12 rounded-full border-[1.5px] px-6 text-sm font-semibold outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            {showMoreLabel.replace("{count}", String(hidden))}
          </button>
        )}
      </div>
    </div>
  );
}

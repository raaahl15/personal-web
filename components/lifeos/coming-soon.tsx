import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

/** Placeholder modul Life OS yang belum dibangun (Fase 2 = kerangka). */
export function ComingSoon({
  title,
  phase,
  description,
  features,
}: {
  title: string;
  phase: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-subtle">Life OS</p>
        <h1 className="mt-1 text-[clamp(2.25rem,4vw,2.75rem)] leading-tight font-light">{title}</h1>
      </div>
      <section className="glass flex max-w-3xl flex-col gap-6 rounded-[32px] p-7 sm:p-9">
        <span className="w-fit rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold">{phase}</span>
        <p className="text-[17px] leading-relaxed text-muted-foreground">{description}</p>
        <ul className="flex flex-col gap-3">
          {features.map((f) => (
            <li key={f} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-muted text-primary">
                <Check className="size-3.5" aria-hidden />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="/app"
          className="flex w-fit items-center gap-2 rounded-full text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-4" aria-hidden /> Kembali ke Hari ini
        </Link>
      </section>
    </div>
  );
}

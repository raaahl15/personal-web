import { DatabaseZap } from "lucide-react";
import { DatabaseNotReadyError } from "@/lib/data/lifeos";

/** Ditampilkan bila tabel modul belum dibuat di Supabase. */
export function DbNotReady({ migration = "0001_projects_tasks.sql" }: { migration?: string }) {
  return (
    <div role="status" className="glass flex max-w-2xl flex-col gap-3 rounded-[28px] p-7">
      <span className="grid size-12 place-items-center rounded-full bg-warm-soft text-warm">
        <DatabaseZap className="size-6" aria-hidden />
      </span>
      <h2 className="text-2xl font-medium">Database belum disiapkan</h2>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Jalankan file <code className="rounded bg-muted px-1.5 py-0.5 text-sm">supabase/migrations/{migration}</code> di
        Supabase → SQL Editor, lalu muat ulang halaman ini.
      </p>
    </div>
  );
}

/** Jalankan pembacaan data; kalau tabel belum ada → tampilkan DbNotReady, error lain diteruskan. */
export async function withDb(render: () => Promise<React.ReactNode>, migration?: string): Promise<React.ReactNode> {
  try {
    return await render();
  } catch (e) {
    if (e instanceof DatabaseNotReadyError) return <DbNotReady migration={migration} />;
    throw e;
  }
}

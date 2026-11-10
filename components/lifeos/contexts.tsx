"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createContext, deleteContext, updateContext } from "@/app/(private)/app/settings/context-actions";
import type { ActionResult } from "@/lib/lifeos/action-utils";
import type { Context } from "@/lib/lifeos/types";
import { FormMessage, SubmitButton, inputClass } from "./ui";

/** Pilihan warna dari palet Sky Blue + 2 warna fungsional (desain v1.0). */
const SWATCHES = ["#1e7dff", "#0a3b7a", "#5caeff", "#97c9ff", "#4ade80", "#fb923c"];

function ColorPicker({ name, defaultValue, idPrefix }: { name: string; defaultValue: string; idPrefix: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <fieldset className="flex items-center gap-1.5">
      <legend className="sr-only">Warna</legend>
      <input type="hidden" name={name} value={value} />
      {SWATCHES.map((c) => (
        <label key={c} className="grid size-9 cursor-pointer place-items-center rounded-full has-focus-visible:ring-2 has-focus-visible:ring-ring">
          <input
            type="radio"
            name={`${idPrefix}-swatch`}
            value={c}
            checked={value.toLowerCase() === c}
            onChange={() => setValue(c)}
            className="sr-only"
            aria-label={`Warna ${c}`}
          />
          <span
            aria-hidden
            className="size-6 rounded-full ring-offset-2 ring-offset-card"
            style={{ backgroundColor: c, boxShadow: value.toLowerCase() === c ? `0 0 0 2px var(--card), 0 0 0 4px ${c}` : undefined }}
          />
        </label>
      ))}
    </fieldset>
  );
}

function ContextRow({ context }: { context: Context }) {
  const [state, action] = useActionState<ActionResult, FormData>(updateContext.bind(null, context.id), {});
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  return (
    <li className="flex flex-col gap-3 rounded-[20px] bg-background p-4">
      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor={`ctx-${context.id}`} className="sr-only">
          Nama konteks
        </label>
        <input id={`ctx-${context.id}`} name="name" required maxLength={40} defaultValue={context.name} className={`${inputClass} bg-card sm:flex-1`} />
        <ColorPicker name="color" defaultValue={context.color} idPrefix={context.id} />
        <div className="flex items-center gap-2">
          <SubmitButton variant="outline" className="h-11 px-4 text-sm" pendingText="…">
            Simpan
          </SubmitButton>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm) return setConfirm(true);
              start(async () => setError((await deleteContext(context.id)).error));
            }}
            onBlur={() => setConfirm(false)}
            aria-label={confirm ? `Yakin hapus konteks ${context.name}?` : `Hapus konteks ${context.name}`}
            className={`flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring ${confirm ? "bg-warm text-white" : "text-warm hover:bg-warm-soft"}`}
          >
            <Trash2 className="size-4" aria-hidden />
            {confirm && "Yakin?"}
          </button>
        </div>
      </form>
      <FormMessage error={state.error ?? error} ok={state.ok} okText="Tersimpan." />
    </li>
  );
}

export function ContextManager({ contexts }: { contexts: Context[] }) {
  const [state, action] = useActionState<ActionResult, FormData>(createContext, {});
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {contexts.map((c) => (
          <ContextRow key={`${c.id}-${c.name}-${c.color}`} context={c} />
        ))}
      </ul>
      <form action={action} className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-dashed p-4 sm:flex-row sm:items-center">
        <label htmlFor="ctx-new" className="sr-only">
          Konteks baru
        </label>
        <input id="ctx-new" name="name" required maxLength={40} placeholder="Konteks baru, mis. Magang" className={`${inputClass} sm:flex-1`} />
        <ColorPicker name="color" defaultValue="#1e7dff" idPrefix="new" />
        <SubmitButton className="h-11 px-4 text-sm" pendingText="…">
          <Plus className="size-4" aria-hidden /> Tambah
        </SubmitButton>
      </form>
      <FormMessage error={state.error} />
    </div>
  );
}

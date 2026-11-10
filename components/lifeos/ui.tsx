"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Gaya input/select bersama (desain v1.0 komponen Field). */
export const inputClass =
  "h-12 w-full rounded-[14px] border-[1.5px] bg-background px-4 text-base outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 disabled:opacity-60";
export const textareaClass =
  "w-full resize-y rounded-[14px] border-[1.5px] bg-background p-4 text-base leading-relaxed outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20";

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-[13px] text-subtle">{hint}</p>}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingText = "Menyimpan…",
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold outline-none transition-[filter,opacity] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
        variant === "primary" ? "bg-primary text-primary-foreground hover:brightness-110" : "border-[1.5px] hover:bg-muted",
        className,
      )}
    >
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {pending ? pendingText : children}
    </button>
  );
}

export function FormMessage({ error, ok, okText }: { error?: string; ok?: boolean; okText?: string }) {
  if (error)
    return (
      <p role="alert" className="text-sm font-medium text-warm">
        {error}
      </p>
    );
  if (ok && okText)
    return (
      <p role="status" className="text-sm font-medium text-success">
        {okText}
      </p>
    );
  return null;
}

export type SheetHandle = { open: () => void; close: () => void };

/**
 * Panel dialog: lembar bawah di HP, kartu tengah di desktop. <dialog> bawaan → fokus terkunci,
 * Escape menutup. Klik latar menutup.
 */
export const Sheet = forwardRef<SheetHandle, { title: string; children: React.ReactNode; wide?: boolean }>(
  function Sheet({ title, children, wide }, ref) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));
    return (
      <dialog
        ref={dialogRef}
        aria-label={title}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        className={cn(
          "menu-sheet mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[32px] bg-card p-0 text-foreground backdrop:bg-sky-950/40 backdrop:backdrop-blur-sm md:m-auto md:rounded-[32px]",
          wide ? "md:max-w-2xl" : "md:max-w-lg",
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-card px-6 pt-5 pb-3">
          <h2 className="font-heading text-xl font-medium">{title}</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Tutup"
            className="grid size-11 place-items-center rounded-full bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>
      </dialog>
    );
  },
);

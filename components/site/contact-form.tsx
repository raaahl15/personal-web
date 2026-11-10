"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Labels = {
  formTitle: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  topic: string;
  topics: string[];
  message: string;
  messagePlaceholder: string;
  send: string;
  sendNote: string;
  errorName: string;
  errorEmail: string;
  errorMessage: string;
};

type Errors = Partial<Record<"name" | "email" | "message", string>>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = 1000;

/**
 * Form kontak Fase 1: validasi di klien lalu membuka aplikasi email (mailto:) dengan
 * pesan terisi. Pengiriman langsung (server action + layanan email) menyusul.
 */
export function ContactForm({ to, labels }: { to: string; labels: Labels }) {
  const [topic, setTopic] = useState(labels.topics[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const body = message.trim();

    const next: Errors = {};
    if (!name) next.name = labels.errorName;
    if (!EMAIL_RE.test(email)) next.email = labels.errorEmail;
    if (!body) next.message = labels.errorMessage;
    setErrors(next);

    const firstInvalid = (["name", "email", "message"] as const).find((k) => next[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const subject = `[${topic}] ${name}`;
    const text = `${body}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  }

  const field = (name: "name" | "email", label: string, placeholder: string, type: string, autoComplete: string) => (
    <div className="flex flex-1 flex-col gap-2">
      <label htmlFor={`contact-${name}`} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={`contact-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
        className={cn(
          "h-13 rounded-[14px] border-[1.5px] bg-background px-4 text-base outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
          errors[name] && "border-warm",
        )}
      />
      {errors[name] && (
        <p id={`contact-${name}-error`} className="text-[13px] font-medium text-warm">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-6 rounded-[32px] bg-card p-6 shadow-[0_16px_40px_rgb(6_41_86/0.1)] sm:p-10 md:rounded-[40px]"
    >
      <h2 className="text-3xl">{labels.formTitle}</h2>
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
        {field("name", labels.name, labels.namePlaceholder, "text", "name")}
        {field("email", labels.email, labels.emailPlaceholder, "email", "email")}
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">{labels.topic}</legend>
        <div className="flex flex-wrap gap-2">
          {labels.topics.map((t) => (
            <label
              key={t}
              className={cn(
                "flex h-11 cursor-pointer items-center rounded-full border px-5 text-sm font-medium text-muted-foreground transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
                topic === t && "border-transparent bg-foreground font-semibold text-background",
              )}
            >
              <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          {labels.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={MAX}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={labels.messagePlaceholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : "contact-message-count"}
          className={cn(
            "resize-y rounded-[14px] border-[1.5px] bg-background p-4 text-base outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
            errors.message && "border-warm",
          )}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-[13px] font-medium text-warm">
            {errors.message}
          </p>
        ) : (
          <p id="contact-message-count" className="text-[13px] text-subtle">
            {message.length} / {MAX}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-subtle">{labels.sendNote}</p>
        <button
          type="submit"
          className="group flex h-14 items-center gap-3 rounded-full bg-primary py-2 pr-2 pl-6 font-semibold text-primary-foreground outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {labels.send}
          <span className="grid size-10 place-items-center rounded-full bg-primary-foreground text-primary">
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </button>
      </div>
    </form>
  );
}

export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
      className="flex h-11 items-center gap-2 self-start rounded-full bg-white/15 px-4 text-sm font-semibold outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}

"use client";

import "@blocknote/shadcn/style.css";
import type { Block, PartialBlock } from "@blocknote/core";
import { en } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "@/components/theme-toggle";
import { blocksToText } from "@/lib/lifeos/journal-text";

// BlockNote belum punya locale Indonesia; teks yang paling sering terlihat diterjemahkan.
const dictionary = {
  ...en,
  placeholders: {
    ...en.placeholders,
    default: "Tulis sesuatu, atau ketik '/' untuk perintah",
    heading: "Judul",
    bulletListItem: "Daftar",
    numberedListItem: "Daftar",
    checkListItem: "Checklist",
    emptyDocument: "Mulai tulis cerita hari ini…",
  },
};

/**
 * Editor blok ala Notion (K-02: BlockNote, varian shadcn → komponen Base UI + token tema kita).
 * Unggah file belum diaktifkan (gambar lewat URL saja) — lihat MASTER.md Bagian 13.
 */
export default function JournalBlocks({
  initialContent,
  onChange,
  label,
}: {
  initialContent: unknown[];
  onChange: (content: Block[], text: string) => void;
  label: string;
}) {
  const theme = useTheme();
  const editor = useCreateBlockNote({
    initialContent: initialContent.length ? (initialContent as PartialBlock[]) : undefined,
    dictionary,
    domAttributes: { editor: { "aria-label": label } },
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={theme}
      onChange={() => onChange(editor.document, blocksToText(editor.document))}
      className="journal-editor"
    />
  );
}

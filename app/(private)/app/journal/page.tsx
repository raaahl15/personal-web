import type { Metadata } from "next";
import { ComingSoon } from "@/components/lifeos/coming-soon";

export const metadata: Metadata = { title: "Jurnal" };

export default function JournalPage() {
  return (
    <ComingSoon
      title="Jurnal"
      phase="Fase 4"
      description="Jurnal harian ala Notion: satu halaman per tanggal yang otomatis dibuat saat dibuka."
      features={[
        "Editor blok (heading, checklist, quote, gambar, kode) dengan BlockNote",
        "Mood 1–5 dan tag per entri",
        "Kalender untuk lompat ke tanggal, plus pencarian teks",
        "Tersimpan otomatis",
      ]}
    />
  );
}
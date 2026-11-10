import type { Metadata } from "next";
import { ComingSoon } from "@/components/lifeos/coming-soon";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <ComingSoon
      title="Projects"
      phase="Fase 3"
      description="Kumpulan project beserta file, link, dan progresnya."
      features={[
        "Deskripsi, status, dan progres otomatis dari task",
        "Lampiran (PDF/gambar) dan link GitHub, Drive, Figma",
        "Switch Publik → otomatis tampil di halaman Portfolio",
        "Switch Unggulan → tampil di halaman Welcome",
      ]}
    />
  );
}
import type { Metadata } from "next";
import { ComingSoon } from "@/components/lifeos/coming-soon";

export const metadata: Metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <ComingSoon
      title="Tasks"
      phase="Fase 3"
      description="Semua tugas kuliah, organisasi, dan KKN di satu tempat."
      features={[
        "Tampilan List dan Kanban (To Do → Dikerjakan → Selesai)",
        "Deadline, prioritas, dan konteks buatan sendiri (Kuliah, BEM, Asprak, GMRT, KKN)",
        "Terhubung ke project — progres project dihitung dari task",
        "Drag & drop antar-kolom",
      ]}
    />
  );
}
import type { Localized } from "@/lib/i18n";

/*
 * Konten profil publik — sumber: CV Rahul (2 halaman, versi sebelum Nov 2026).
 * Data sementara (Fase 1). Mulai Fase 3, project/portfolio pindah ke database
 * dengan kolom jsonb {en, id} yang bentuknya sama dengan Localized di sini.
 *
 * Catatan privasi: nomor HP sengaja TIDAK dicantumkan di situs publik.
 * `end: null` = masih berjalan ("Present" di CV) — perlu dicek ulang (lihat MASTER.md Bagian 13).
 */

export type Period = { start: string; end: string | null }; // "YYYY-MM"

export type Experience = {
  org: string;
  location: string;
  role: Localized;
  period: Period;
  points: Localized<string[]>;
};

export type ExperienceGroup = {
  id: "leadership" | "mentoring" | "teaching";
  title: Localized;
  items: Experience[];
};

export const profile = {
  name: "Rahul Ghulam Hidayatulloh",
  shortName: "Rahul Ghulam",
  headline: {
    en: "Engineering Physics student at Universitas Gadjah Mada",
    id: "Mahasiswa S1 Teknik Fisika Universitas Gadjah Mada",
  } satisfies Localized,
  summary: {
    en: "Engineering Physics undergraduate at Universitas Gadjah Mada with a strong interest in energy systems, instrumentation, and industrial management. Trusted to coordinate projects and lead teams of more than 100 people across several organizations, and has built strong analytical, problem-solving, and teamwork skills through academic work and tutoring.",
    id: "Mahasiswa S1 Teknik Fisika Universitas Gadjah Mada dengan minat kuat pada sistem energi, instrumentasi, dan manajemen industri. Dipercaya mengoordinasikan proyek dan memimpin tim beranggotakan lebih dari 100 orang di berbagai organisasi, serta mengasah kemampuan analitis, pemecahan masalah, dan kerja sama tim melalui kegiatan akademik dan bimbingan belajar.",
  } satisfies Localized,
  contact: {
    email: "rahulghulam15@gmail.com",
    linkedin: "https://linkedin.com/in/rahulghulam",
    website: "https://ralogystudio.wuaze.com", // dari CV — konfirmasi masih dipakai
  },
};

export const education = [
  {
    school: "Universitas Gadjah Mada",
    location: "Yogyakarta",
    degree: { en: "B.Eng. in Engineering Physics", id: "S1 Teknik Fisika" },
    period: { start: "2023-07", end: "2026-06" }, // CV: "Expected" — cek status kelulusan
    points: {
      en: [
        "Relevant coursework: Instrumentation, Process Control, Probability & Statistics, Informatics, Thermodynamics",
        "Head of Bureau, Student Executive Board (BEM) FT UGM — Human Resources Development",
      ],
      id: [
        "Mata kuliah relevan: Instrumentasi, Kontrol Proses, Probabilitas & Statistik, Informatika, Termodinamika",
        "Kepala Biro BEM FT UGM (Biro Pengembangan Sumber Daya Manusia)",
      ],
    },
  },
  {
    school: "SMA Negeri 2 Jember",
    location: "Jember",
    degree: { en: "Science (Mathematics & Natural Sciences)", id: "Jurusan Matematika dan Ilmu Pengetahuan Alam" },
    period: { start: "2020-07", end: "2023-06" },
    points: {
      en: [
        "Communications & Information Coordinator, Student Council (OSIS)",
        "Graphic Design Coordinator, Journalism Team",
      ],
      id: [
        "Koordinator Komunikasi & Informasi (OSIS)",
        "Koordinator Desain Grafis (Tim Jurnalistik)",
      ],
    },
  },
] satisfies {
  school: string;
  location: string;
  degree: Localized;
  period: Period;
  points: Localized<string[]>;
}[];

export const experienceGroups: ExperienceGroup[] = [
  {
    id: "leadership",
    title: { en: "Leadership & Organizations", id: "Kepemimpinan & Pengalaman Organisasi" },
    items: [
      {
        org: "Teknisiade FT UGM",
        location: "Yogyakarta",
        role: { en: "Sponsorship & Fundraising Division Coordinator", id: "Koordinator Divisi Sponsorship & Fundraising" },
        period: { start: "2025-06", end: null },
        points: {
          en: [
            "Developed and executed strategies to secure financial and in-kind sponsorships.",
            "Built and maintained corporate partner relationships, from first outreach to final agreement.",
            "Prepared compelling proposals and presentations to secure event funding.",
          ],
          id: [
            "Mengembangkan dan melaksanakan strategi untuk mendapatkan sponsor finansial dan non-finansial.",
            "Membangun dan memelihara hubungan dengan mitra korporat, dari penjangkauan awal hingga kesepakatan akhir.",
            "Menyusun proposal dan presentasi yang menarik untuk mengamankan pendanaan acara.",
          ],
        },
      },
      {
        org: "BEM KMFT UGM",
        location: "Yogyakarta",
        role: { en: "Head of Student Resources Development Bureau", id: "Kepala Biro Pengembangan Sumber Daya Mahasiswa" },
        period: { start: "2025-04", end: null },
        points: {
          en: [
            "Lead a bureau of 4 directorates, overseeing 20+ staff across the faculty's HR development programs.",
            "Design and run strategic initiatives in staff management, regeneration, and performance evaluation.",
            "Represent BEM KMFT UGM in inter-faculty HR forums and collaborations.",
          ],
          id: [
            "Memimpin biro dengan 4 direktorat, mengawasi lebih dari 20 staf di seluruh program pengembangan SDM fakultas.",
            "Merancang dan melaksanakan inisiatif strategis dalam manajemen staf, regenerasi, dan evaluasi kinerja.",
            "Mewakili BEM KMFT UGM dalam forum dan kolaborasi SDM antar fakultas.",
          ],
        },
      },
      {
        org: "BEM KMFT UGM",
        location: "Yogyakarta",
        role: { en: "Staff, Student Resources Development Bureau", id: "Staf Biro Pengembangan Sumber Daya Mahasiswa" },
        period: { start: "2024-04", end: "2025-02" },
        points: {
          en: [
            "Organized HR development projects and facilitated staff training activities.",
            "Vice Coordinator of the 2023/2024 Farewell Party, coordinating a committee of 100+ members.",
            "Helped evaluate 200+ BEM KMFT staff and prepare 200+ staff report cards.",
          ],
          id: [
            "Mengorganisir proyek pengembangan sumber daya manusia dan memfasilitasi kegiatan pelatihan staf.",
            "Menjabat sebagai Wakil Koordinator Pesta Perpisahan 2023/2024, mengoordinasikan lebih dari 100 anggota komite.",
            "Membantu evaluasi lebih dari 200 staf BEM KMFT dan pembuatan lebih dari 200 rapor staf BEM KMFT.",
          ],
        },
      },
      {
        org: "Gadjah Mada Robotic Team UGM",
        location: "Yogyakarta",
        role: { en: "External Affairs Department Manager", id: "Manajer Departemen Eksternal" },
        period: { start: "2024-10", end: null },
        points: {
          en: [
            "Manage all external activities, including corporate partnerships, sponsorships, and public relations.",
            "Secure financial and technical resources by building a strong network of industry contacts.",
            "Represent the team at official events and competitions to raise its public profile.",
          ],
          id: [
            "Mengelola semua kegiatan eksternal, termasuk kemitraan perusahaan, sponsor, dan hubungan masyarakat.",
            "Mengamankan sumber daya keuangan dan teknis dengan membangun dan memelihara jaringan kontak industri yang kuat.",
            "Mewakili tim di acara dan kompetisi resmi untuk meningkatkan profil dan visibilitas publiknya.",
          ],
        },
      },
      {
        org: "Epsilon Competition Committee DTNTF UGM",
        location: "Yogyakarta",
        role: { en: "Staff, Scientific Paper Competition Division", id: "Staf Divisi Kompetisi Karya Tulis Ilmiah" },
        period: { start: "2024-06", end: "2025-02" },
        points: {
          en: [
            "Helped plan and run the technical side of a scientific paper competition.",
            "Drafted key event documents, including the official rulebook and technical guidelines.",
            "Coordinated with participants and judges to keep the event running smoothly.",
          ],
          id: [
            "Membantu perencanaan dan pelaksanaan teknis kompetisi karya tulis ilmiah.",
            "Menyusun dokumen-dokumen penting acara, termasuk buku peraturan resmi dan panduan teknis.",
            "Berkoordinasi dengan peserta dan juri untuk memastikan kelancaran dan keselarasan acara.",
          ],
        },
      },
      {
        org: "Dewan Energi Mahasiswa UGM",
        location: "Yogyakarta",
        role: { en: "Staff, New & Renewable Energy Research Division (EBTKE)", id: "Staf Divisi Riset Energi Baru dan Terbarukan (EBTKE)" },
        period: { start: "2024-03", end: "2025-02" },
        points: {
          en: [
            "Researched global trends and developments in the renewable energy sector.",
            "Read academic journals regularly to build the division's knowledge base.",
            "Supported the ministry's programs through active committee involvement.",
          ],
          id: [
            "Meneliti tren dan perkembangan global di sektor energi terbarukan.",
            "Membaca jurnal akademik secara berkala untuk mendukung basis pengetahuan divisi.",
            "Berperan aktif dalam mendukung pelaksanaan program kementerian melalui keterlibatan dalam komite.",
          ],
        },
      },
      {
        org: "Pionir Kesatria FT UGM",
        location: "Yogyakarta",
        role: { en: "Staff, Guide Division", id: "Staf Divisi Pemandu" },
        period: { start: "2024-03", end: "2024-08" },
        points: {
          en: [
            "Mentored a group of new engineering students during university orientation.",
            "Delivered official orientation material and coordinated group assignments.",
            "Guided and supported new students as they adapted to university life.",
          ],
          id: [
            "Berperan sebagai mentor bagi sekelompok mahasiswa teknik baru selama program orientasi universitas.",
            "Memberikan materi orientasi resmi dan mengoordinasikan tugas kelompok.",
            "Memberikan bimbingan dan dukungan untuk membantu mahasiswa baru beradaptasi dengan kehidupan perkuliahan.",
          ],
        },
      },
    ],
  },
  {
    id: "mentoring",
    title: { en: "Mentoring & Tutoring", id: "Pengalaman Mentoring & Bimbingan Belajar" },
    items: [
      {
        org: "Engineering Physics Department, UGM",
        location: "Yogyakarta",
        role: { en: "Academic Tutor", id: "Tutor Akademik di Departemen Fisika Teknik" },
        period: { start: "2024-02", end: "2025-07" },
        points: {
          en: [
            "Tutored fellow students in Differential Equations, General Chemistry, and Modern Physics.",
            "Prepared and presented lesson material and practice problems.",
            "Led sessions focused on solving advanced (HOTS) exam problems.",
          ],
          id: [
            "Membimbing mahasiswa lain dalam mata kuliah Persamaan Diferensial, Kimia Dasar, dan Fisika Modern.",
            "Menyusun dan mempresentasikan materi pelajaran dan soal latihan.",
            "Memimpin sesi yang berfokus pada penyelesaian soal-soal ujian tingkat lanjut (HOTS).",
          ],
        },
      },
      {
        org: "Gadjah Mada Robotic Team UGM",
        location: "Yogyakarta",
        role: { en: "Non-Technical Internship Mentor", id: "Mentor Magang Non-Teknis" },
        period: { start: "2024-08", end: "2024-10" },
        points: {
          en: [
            "Trained and onboarded new interns, focusing on non-technical roles and responsibilities.",
            "Assessed intern performance through case studies and direct observation.",
            "Delivered final performance evaluations and recommendations to team leadership.",
          ],
          id: [
            "Melatih dan menerima peserta magang baru, dengan fokus pada peran dan tanggung jawab non-teknis.",
            "Menilai kinerja peserta magang melalui studi kasus dan observasi langsung.",
            "Memberikan evaluasi kinerja akhir dan rekomendasi kepada pimpinan tim.",
          ],
        },
      },
      {
        org: "UTBK Tutoring",
        location: "Yogyakarta",
        role: { en: "UTBK Tutor — Mathematics & General Reasoning", id: "Tutor UTBK Matematika & Penalaran Umum" },
        period: { start: "2024-08", end: "2024-10" },
        points: {
          en: [
            "Prepared and delivered tutoring material for the UTBK Mathematics and General Reasoning subtests.",
            "Explained concepts and exam strategies to prospective university students.",
            "Focused on solving and analyzing advanced (HOTS) problems to prepare students for the exam.",
          ],
          id: [
            "Menyiapkan dan memberikan materi bimbingan belajar untuk subtes UTBK Matematika dan Penalaran Umum.",
            "Menjelaskan materi pelajaran dan strategi ujian kepada calon mahasiswa.",
            "Berfokus pada pemecahan dan analisis soal-soal tingkat lanjut (HOTS) untuk mempersiapkan siswa menghadapi ujian.",
          ],
        },
      },
    ],
  },
  {
    id: "teaching",
    title: { en: "Teaching Assistant & Research", id: "Pengalaman Asisten Pengajar & Penelitian" },
    items: [
      {
        org: "Basic Physics Laboratory, DTNTF UGM",
        location: "Yogyakarta",
        role: { en: "Laboratory Assistant", id: "Asisten Praktikum" },
        period: { start: "2025-03", end: "2025-06" },
        points: {
          en: [
            "Prepared teaching modules and assessment material for the Basic Physics lab.",
            "Wrote pre-/post-test questions and case studies for lab sessions.",
            "Supervised and assisted students during lab work.",
          ],
          id: [
            "Menyusun modul ajar dan materi evaluasi untuk laboratorium Fisika Dasar.",
            "Menyusun soal pra-tes/pasca-tes dan studi kasus untuk sesi praktikum.",
            "Mengawasi dan mendampingi mahasiswa selama praktikum.",
          ],
        },
      },
    ],
  },
];

export const awards = [
  {
    title: { en: "University-Level Finalist", id: "Finalis Tingkat Universitas" },
    event: "Program Kreativitas Mahasiswa (PKM) Kemendikbudristek",
    location: "Yogyakarta",
    period: { start: "2025-03", end: "2025-06" },
    points: {
      en: [
        "Passed the university's internal selection for funding and advanced to the national selection held by Belmawa Kemendikbudristek.",
        "Proposal: “GROMICS — an all-in-one, real-time IoT health monitoring system using non-invasive technology for early detection of non-communicable diseases”.",
      ],
      id: [
        "Berhasil lolos seleksi internal universitas untuk mendapatkan pendanaan dan melaju ke tahap seleksi nasional yang diselenggarakan oleh Belmawa Kemendikbudristek.",
        "Judul proposal: “Sistem Pemantauan Kesehatan Real-Time All in One Berbasis IoT (GROMICS) dengan Teknologi Noninvasif untuk Deteksi Dini Penyakit Tidak Menular”.",
      ],
    },
  },
  {
    title: { en: "2nd Place, Putra Putri Cultural Festival 13", id: "Juara Kedua Putra Putri Festival Budaya 13" },
    event: "Cultural Festival 13 UGM Residence",
    location: "Yogyakarta",
    period: { start: "2024-06", end: "2024-06" },
    points: {
      en: ["Recognized for cultural knowledge, public speaking, and performance at Cultural Festival 13 held by UGM Residence."],
      id: ["Dianugerahi penghargaan di Festival Budaya 13 yang diselenggarakan UGM Residence, atas prestasi di bidang pengetahuan budaya, berbicara di depan umum, dan pertunjukan."],
    },
  },
  {
    title: { en: "1st Place, School Profile Video", id: "Juara 1 Video Profil Sekolah" },
    event: "Kompetisi Video Profil SMA",
    location: "Jember",
    period: { start: "2022-03", end: "2022-03" },
    points: {
      en: [
        "Production lead for the winning video.",
        "Developed the core concept, narrative flow, and central theme of the school profile video.",
        "Formed the production team and coordinated the workflow from start to finish.",
        "Managed the full production schedule, including shooting dates and editing deadlines.",
      ],
      id: [
        "Bertindak sebagai Pimpinan Produksi untuk video pemenang.",
        "Mengembangkan konsep inti, alur naratif, dan tema sentral untuk video profil sekolah.",
        "Membentuk tim produksi dan mengoordinasikan alur kerja proyek dari awal hingga akhir.",
        "Mengelola seluruh jadwal produksi, termasuk jadwal syuting dan tenggat waktu penyuntingan.",
      ],
    },
  },
] satisfies {
  title: Localized;
  event: string;
  location: string;
  period: Period;
  points: Localized<string[]>;
}[];

export const skills = {
  technical: {
    en: ["Data Analysis", "Scientific Research", "Project Management", "Event Management", "Public Speaking", "Mentoring & Training"],
    id: ["Analisis Data", "Riset Ilmiah", "Manajemen Proyek", "Manajemen Acara", "Berbicara di Depan Umum", "Mentoring & Pelatihan"],
  } satisfies Localized<string[]>,
  tools: ["Microsoft Office Suite", "Adobe Photoshop", "Adobe Illustrator", "CorelDRAW"],
  languages: {
    en: ["Indonesian (Native)", "English (Professional working proficiency)"],
    id: ["Bahasa Indonesia (Asli)", "Bahasa Inggris (Kemahiran Kerja Profesional)"],
  } satisfies Localized<string[]>,
  interests: {
    en: ["Industrial Control Systems & Automation", "Instrumentation & Sensor Technology", "Industrial Process Optimization", "Applied Robotics", "Energy Management"],
    id: ["Sistem Kontrol & Otomasi Industri", "Instrumentasi & Teknologi Sensor", "Optimasi Proses Industri", "Robotika Terapan", "Manajemen Energi"],
  } satisfies Localized<string[]>,
};

/*
 * Project portfolio. Sejak Fase 3 sumber utamanya tabel `projects` (is_public = true) lewat
 * lib/data/public-projects.ts; daftar di bawah dipakai sebagai CADANGAN bila database tidak
 * bisa diakses (dan sebagai data awal di supabase/migrations/0001_projects_tasks.sql).
 */
/** Kategori bebas (dari database); contoh: IoT, Creative, Web, Organisasi, Riset. */
export type ProjectCategory = string;

export type Project = {
  slug: string;
  title: Localized;
  shortTitle: string;
  category: ProjectCategory;
  year: string;
  status: "done" | "active";
  summary: Localized;
  /** Fakta yang bisa dipertanggungjawabkan (dari CV / MASTER.md). Peran detail menyusul. */
  highlights: Localized<string[]>;
  result?: Localized;
  /** Gaya cover sementara sampai foto asli ada di Drive `04 - Portfolio Content`. */
  cover: "pulse" | "video" | "dashboard" | "plant" | "cells";
  featured: boolean;
  /** Alat / teknologi utama (kolom `tech_stack`). */
  techStack?: string[];
  /** Tautan publik (GitHub, Google Drive, demo) — hanya http(s). */
  links?: { label: string; url: string }[];
};

export const projects: Project[] = [
  {
    slug: "gromics",
    title: { en: "GROMICS — IoT Health Monitoring", id: "GROMICS — Pemantauan Kesehatan Berbasis IoT" },
    shortTitle: "GROMICS",
    category: "IoT",
    year: "2025",
    status: "done",
    summary: {
      en: "All-in-one real-time health monitoring system using non-invasive sensors for early detection of non-communicable diseases. PKM proposal, university-level finalist (2025).",
      id: "Sistem pemantauan kesehatan real-time all-in-one dengan sensor noninvasif untuk deteksi dini penyakit tidak menular. Proposal PKM, finalis tingkat universitas (2025).",
    },
    highlights: {
      en: [
        "Proposed an all-in-one IoT device that monitors health in real time using non-invasive sensors.",
        "Aimed at early detection of non-communicable diseases without needles or lab visits.",
        "Passed the university's internal funding selection and advanced to the national PKM selection by Belmawa Kemendikbudristek.",
      ],
      id: [
        "Mengusulkan perangkat IoT all-in-one yang memantau kesehatan secara real-time dengan sensor noninvasif.",
        "Ditujukan untuk deteksi dini penyakit tidak menular tanpa jarum atau kunjungan ke laboratorium.",
        "Lolos seleksi internal pendanaan universitas dan melaju ke seleksi nasional PKM oleh Belmawa Kemendikbudristek.",
      ],
    },
    result: { en: "PKM university-level finalist", id: "Finalis PKM tingkat universitas" },
    cover: "pulse",
    featured: true,
  },
  {
    slug: "school-profile-video",
    title: { en: "SMAN 2 Jember Profile Video", id: "Video Profil SMAN 2 Jember" },
    shortTitle: "SMAN 2 Jember Profile",
    category: "Creative",
    year: "2022",
    status: "done",
    summary: {
      en: "Led production of the school profile video that won 1st place — concept, narrative, team, and schedule.",
      id: "Memimpin produksi video profil sekolah yang meraih Juara 1 — konsep, alur cerita, tim, dan jadwal produksi.",
    },
    highlights: {
      en: [
        "Production lead for the winning video.",
        "Developed the core concept, narrative flow, and central theme.",
        "Formed the production team and managed the schedule from shooting to editing deadlines.",
      ],
      id: [
        "Pimpinan produksi video pemenang.",
        "Mengembangkan konsep inti, alur naratif, dan tema sentral.",
        "Membentuk tim produksi dan mengelola jadwal dari syuting hingga tenggat penyuntingan.",
      ],
    },
    result: { en: "1st place, school profile video competition", id: "Juara 1 kompetisi video profil sekolah" },
    cover: "video",
    featured: true,
  },
  {
    slug: "life-os",
    title: { en: "Life OS — this website", id: "Life OS — situs ini" },
    shortTitle: "Life OS — this website",
    category: "Web",
    year: "2026",
    status: "active",
    summary: {
      en: "My public portfolio plus a private dashboard for journal, tasks, projects and money. Next.js 16 + Supabase.",
      id: "Portfolio publik sekaligus dashboard pribadi untuk jurnal, task, project, dan keuangan. Next.js 16 + Supabase.",
    },
    highlights: {
      en: [
        "Bilingual public site (English and Indonesian) with a dark-to-light visual story.",
        "Private Life OS: daily dashboard, block-based journal, Kanban tasks, IDR/USD money and an investment journal.",
        "Designed in FigCraft with a shared token system for light and dark mode.",
      ],
      id: [
        "Situs publik dua bahasa (Inggris dan Indonesia) dengan alur visual gelap ke terang.",
        "Life OS pribadi: dashboard harian, jurnal berbasis blok, task Kanban, keuangan IDR/USD, dan jurnal investasi.",
        "Didesain di FigCraft dengan sistem token bersama untuk mode terang dan gelap.",
      ],
    },
    cover: "dashboard",
    featured: true,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    links: [{ label: "GitHub", url: "https://github.com/raaahl15/personal-web" }],
  },
  {
    slug: "dme-capstone",
    title: {
      en: "DME Capstone — I&C Design for a Dimethyl Ether Plant",
      id: "DME Capstone — Desain Sistem I&C Pabrik Dimethyl Ether",
    },
    shortTitle: "DME Capstone",
    category: "Engineering",
    year: "2026",
    status: "active",
    summary: {
      en: "Front-End Engineering Design (FEED) of the instrumentation & control system for the reactor area of a methanol-dehydration DME plant. Engineering Physics capstone (PSTF), UGM 2026/2027 — I lead a five-person engineering firm as Project Manager.",
      id: "Front-End Engineering Design (FEED) sistem instrumentasi & kontrol untuk area reaktor pabrik DME berbasis dehidrasi metanol. Capstone Teknik Fisika (PSTF), UGM 2026/2027 — saya memimpin firma rekayasa beranggotakan lima orang sebagai Project Manager.",
    },
    highlights: {
      en: [
        "Project Manager of a five-person firm: weekly supervision, work orders, Gantt schedule, and stage-gate reviews.",
        "Process simulation in DWSIM with a heat & material balance feeding a Python pipeline for sizing calculations (flow orifice, control valves) and cross-document tag validation.",
        "Engineering deliverables to ISA-5.1 and NAMUR NA 35: P&ID, instrument index & I/O list, functional design specification and control narrative.",
        "Built a web operations cockpit (React + Vite + Firebase) for the team: work orders, schedule, RACI, meeting minutes, document library, and stage gates.",
      ],
      id: [
        "Project Manager firma lima orang: bimbingan mingguan, work order, jadwal Gantt, dan review stage-gate.",
        "Simulasi proses di DWSIM dengan neraca massa & energi yang menjadi masukan pipeline Python untuk perhitungan sizing (orifice laju alir, control valve) dan validasi tag lintas dokumen.",
        "Deliverable rekayasa sesuai ISA-5.1 dan NAMUR NA 35: P&ID, instrument index & I/O list, functional design specification dan control narrative.",
        "Membangun web operations cockpit (React + Vite + Firebase) untuk tim: work order, jadwal, RACI, notulen, pustaka dokumen, dan stage-gate.",
      ],
    },
    cover: "plant",
    featured: false,
    techStack: ["DWSIM", "Python", "AutoCAD (DXF)", "ISA-5.1", "NAMUR NA 35", "React", "Vite", "Firebase"],
    links: [{ label: "GitHub", url: "https://github.com/raaahl15/dashboardcapstone" }],
  },
  {
    slug: "cd4-cell-classification",
    title: {
      en: "CD4 Cell Classification — Undergraduate Thesis",
      id: "Klasifikasi Sel CD4 — Skripsi",
    },
    shortTitle: "CD4 Cell Classification",
    category: "Research",
    year: "2026",
    status: "active",
    summary: {
      en: "Undergraduate thesis: classifying CD4 cell conditions in HIV infection from imaging flow cytometry images, using physical and bio-optical feature extraction with machine learning.",
      id: "Skripsi: klasifikasi kondisi sel CD4 pada infeksi HIV dari citra imaging flow cytometry, memakai ekstraksi fitur fisis dan bio-optik dengan machine learning.",
    },
    highlights: {
      en: [
        "Extracts interpretable physical and bio-optical features from single-cell images, so every feature has a physical meaning, instead of a black-box deep learning model.",
        "Compares Logistic Regression, Random Forest, and SVM with nested k-fold validation (grid search inside the training folds, testing on the outer fold).",
        "Validation revealed batch-effect leakage that inflated per-cell scores; the evaluation was redesigned to keep results honest.",
        "Reproducible workflow: code and LaTeX manuscript on GitHub (PDF built by GitHub Actions), datasets on Google Drive, heavy runs on Google Colab.",
      ],
      id: [
        "Mengekstrak fitur fisis dan bio-optik yang bisa ditafsirkan dari citra sel tunggal, sehingga tiap fitur punya arti fisis, bukan model deep learning yang sulit dijelaskan.",
        "Membandingkan Logistic Regression, Random Forest, dan SVM dengan validasi k-fold bersarang (grid search di dalam fold latih, pengujian di fold luar).",
        "Validasi mengungkap kebocoran efek batch yang membuat skor per sel tampak terlalu bagus; evaluasi dirancang ulang agar hasilnya jujur.",
        "Alur kerja yang bisa diulang: kode dan naskah LaTeX di GitHub (PDF dibangun GitHub Actions), dataset di Google Drive, komputasi berat di Google Colab.",
      ],
    },
    cover: "cells",
    featured: false,
    techStack: ["Python", "scikit-learn", "scikit-image", "OpenCV", "pandas", "Google Colab", "LaTeX"],
    links: [
      { label: "GitHub", url: "https://github.com/raaahl15/Project-Skripsi" },
      { label: "Google Drive", url: "https://drive.google.com/drive/folders/1L5EdiZuWsGFqOQ64QzMGHmxBUs63yKJ6" },
    ],
  },
];

/** Angka singkat untuk welcome page (semua dari CV). */
export const stats = [
  { value: 100, suffix: "+", label: { en: "committee members coordinated", id: "anggota panitia dikoordinasikan" } },
  { value: 200, suffix: "+", label: { en: "staff evaluated at BEM KMFT", id: "staf BEM KMFT dievaluasi" } },
  { value: 7, suffix: "", label: { en: "organisations & committees", id: "organisasi & kepanitiaan" } },
  { value: 3, suffix: "", label: { en: "awards, incl. PKM finalist", id: "penghargaan, termasuk finalis PKM" } },
] satisfies { value: number; suffix: string; label: Localized }[];

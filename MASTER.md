# MASTER — Personal Web "Life OS"

> **File induk project.** Semua konsep, sistem, keputusan, catatan pengerjaan
> (history), dan saran ke depan dicatat di sini. Kalau ada yang berubah, file ini
> yang di-update lebih dulu.

| | |
|---|---|
| Pemilik | Rahul Ghulam |
| Repo | https://github.com/raaahl15/personal-web |
| Google Drive | https://drive.google.com/drive/folders/13VVrjm4MkPGJBJFvxNU29PSw40nHE-U0 |
| Status saat ini | **Fase 0 — Persiapan:** mengumpulkan referensi desain; FigCraft siap untuk desain via prompt |
| Terakhir diperbarui | 2026-11-10 |

## Daftar Isi

**Bagian A — Konsep & Sistem**
1. Ide Besar · 2. Peta Menu · 3. Arsitektur · 4. Database · 5. Struktur Folder ·
6. Desain Visual · 7. Roadmap · 8. Keamanan · 9. Keputusan Terbuka ·
10. Penyimpanan (GitHub & Drive)

**Bagian B — Catatan Berjalan**
11. Log Keputusan · 12. Log Pengerjaan (History) · 13. Saran & Ide ke Depan ·
14. Cara Memperbarui File Ini

---

# BAGIAN A — KONSEP & SISTEM

---

## 1. Ide Besar

Personal web ini punya **dua wajah** dalam satu aplikasi:

| Wajah | Siapa yang lihat | Isi | Sifat |
|---|---|---|---|
| **Public Site** | Semua orang (recruiter, teman, dosen) | Welcome page, About, Portfolio, Kontak | Statis, cepat, SEO-friendly |
| **Life OS (Private)** | Hanya kamu (wajib login) | Dashboard harian, Journal, Tasks & Projects, Money, dll | Dinamis, data tersimpan di database |

Analogi: Public Site = **etalase toko**, Life OS = **ruang kerja di belakang toko**.
Keduanya satu domain, satu codebase, satu desain (tema *cosmic* biru-ungu yang sudah
ada di `index.html` tetap dipakai).

Prinsip yang dipegang:

1. **Modular** — tiap fitur (journal, money, tasks) adalah *modul* berdiri sendiri.
   Mau nambah fitur baru (habit tracker, reading list) tinggal nambah modul, nggak
   bongkar yang lama.
2. **Data milik sendiri** — semua data di database kamu, bisa di-export kapan saja.
3. **Public ← Private** — project yang ada di Life OS bisa ditandai `public`, otomatis
   muncul di halaman Portfolio. Jadi portfolio nggak perlu di-update manual.
4. **Mobile-first** — dipakai sehari-hari, jadi harus enak dibuka di HP (bisa jadi PWA).

---

## 2. Peta Menu (Sitemap)

```
/                       → Welcome page (hero "Welcome to my website")
/about                  → Profil, skill, pengalaman, organisasi
/portfolio              → Daftar project publik (diambil dari modul Projects)
/portfolio/[slug]       → Detail project (deskripsi, gambar, tech stack, link)
/contact                → Form kontak / link sosmed
/login                  → Login (hanya kamu)

/app                    → [PRIVATE] Dashboard "Today"
/app/journal            → Journaling harian ala Notion
/app/journal/[date]     → Halaman jurnal per tanggal
/app/tasks              → Tugas & to-do (kuliah, organisasi, KKN)
/app/projects           → Kumpulan project + file/link + progres
/app/projects/[id]      → Detail project (task, catatan, lampiran)
/app/money              → Money management (transaksi, budget, laporan)
/app/settings           → Profil, kategori, export data
```

### Penjelasan tiap modul

**🏠 Welcome Page (`/`)**
Kesan pertama. Hero animasi kosmik + kalimat sambutan + 2 tombol: *Lihat Portfolio*
dan *Tentang Saya*. Di bawahnya preview 3 project unggulan (otomatis dari data
project yang ditandai `featured`).

**💼 Portfolio (`/portfolio`)**
Grid kartu project dengan filter kategori (IoT, Web, Organisasi, Riset). Datanya
bukan di-hardcode, tapi dari tabel `projects` yang `is_public = true`.

**📅 Dashboard Today (`/app`)** — pusat kontrol harian
- Sapaan + tanggal + quote/mood hari ini
- Task yang jatuh tempo hari ini & minggu ini
- Ringkasan keuangan bulan ini (pemasukan, pengeluaran, sisa budget)
- Tombol cepat: *Tulis jurnal hari ini*, *Catat pengeluaran*, *Tambah task*

**📓 Journal (`/app/journal`)** — ala Notion
- Satu halaman per hari (otomatis dibuat saat dibuka)
- Editor berbasis *block* (heading, checklist, quote, gambar, kode) → pakai **BlockNote**
- Mood (1–5) & tag per entri
- Tampilan kalender untuk lompat ke tanggal tertentu, plus pencarian teks

**✅ Tasks (`/app/tasks`)**
- Tampilan *List* dan *Kanban* (To Do → In Progress → Done)
- Field: judul, deadline, prioritas, konteks (Kuliah / BEM / Asprak / GMRT / KKN), project terkait
- Bisa dihubungkan ke project

**🗂️ Projects (`/app/projects`)** — "kumpulan tugas/project yang bisa diakses"
- Setiap project punya: deskripsi, status, progres (dihitung dari task), lampiran
  (file PDF/gambar di storage), link (GitHub, Drive, Figma)
- Switch `is_public` → tampil di Portfolio
- Switch `featured` → tampil di Welcome page

**💰 Money (`/app/money`)**
- Akun/dompet: Cash, Bank, E-wallet (GoPay, OVO, dll)
- Transaksi: pemasukan / pengeluaran / transfer antar akun
- Kategori (Makan, Transport, Kos, Organisasi, ...) + budget bulanan per kategori
- Laporan: grafik pengeluaran per kategori, tren bulanan

**⚙️ Settings**
Kelola kategori, akun, profil publik, dan **export semua data ke JSON/CSV**.

### Fitur lanjutan (nanti, setelah inti stabil)
Habit tracker · Reading/Watch list · Goals tahunan · Global search (⌘K) ·
Reminder via email/Telegram · Integrasi Google Calendar.

---

## 3. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                     Browser / HP (PWA)                  │
└───────────────┬─────────────────────────────────────────┘
                │ HTTPS
┌───────────────▼─────────────────────────────────────────┐
│             Next.js App  (di-host di Vercel)            │
│  ┌──────────────────┐        ┌────────────────────────┐ │
│  │ Public pages     │        │ Private /app/*         │ │
│  │ (SSG, cepat)     │        │ (dicek login via       │ │
│  │                  │        │  middleware)           │ │
│  └──────────────────┘        └────────────────────────┘ │
│            Server Actions / Route Handlers              │
└───────────────┬─────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────┐
│                       Supabase                          │
│  Auth (login)  │  Postgres (data)  │  Storage (file)    │
│          Row Level Security: data hanya milik user      │
└─────────────────────────────────────────────────────────┘
```

### Tech stack yang direkomendasikan

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Satu project untuk public (SEO) & private app; routing sudah rapi per folder |
| Styling | **Tailwind CSS** | Sudah dipakai di `index.html`, tinggal pindahkan token warna |
| Komponen UI | **shadcn/ui** + **lucide-react** | Komponen siap pakai (dialog, tabel, form), ikon sama dengan yang sekarang |
| Database + Auth + File | **Supabase** | Gratis untuk skala personal, Postgres asli, login & storage sudah tersedia |
| Editor jurnal | **BlockNote** | Editor block ala Notion, tinggal pasang |
| Grafik keuangan | **Recharts** | Ringan, gampang dipakai di React |
| Validasi form | **Zod** + **React Hook Form** | Data yang masuk ke DB selalu valid |
| Hosting | **Vercel** | Gratis, auto-deploy tiap `git push` ke `main` |

> Kenapa tidak tetap satu file `index.html`? File itu sekarang sudah 66 KB dan
> semua halaman ditumpuk jadi satu (`page-home`, `page-portfolio`, `page-dashboard`,
> dst. ditukar pakai `display:none`). Untuk fitur yang butuh **menyimpan data**
> (jurnal, uang, task) dan **login**, kita butuh backend + database — satu file
> HTML statis tidak bisa menyimpan data dengan aman.

---

## 4. Desain Database

Semua tabel punya `user_id` dan dilindungi **Row Level Security (RLS)**:
`user_id = auth.uid()` → data cuma bisa dibaca/ditulis pemiliknya.

```
profiles            (id, full_name, headline, bio, avatar_url, socials jsonb)

projects            (id, user_id, title, slug, summary, content, category,
                     status[idea|active|done|archived], cover_url,
                     tech_stack text[], links jsonb,
                     is_public bool, featured bool, start_date, end_date,
                     created_at, updated_at)

project_files       (id, project_id, name, storage_path, mime_type, size)

tasks               (id, user_id, project_id?, title, description,
                     status[todo|doing|done], priority[low|med|high],
                     context, due_date, completed_at, position, created_at)

journal_entries     (id, user_id, entry_date UNIQUE per user, title,
                     content jsonb  ← format block BlockNote,
                     mood smallint, tags text[], created_at, updated_at)

accounts            (id, user_id, name, type[cash|bank|ewallet],
                     initial_balance numeric)

categories          (id, user_id, name, type[income|expense], icon, color)

transactions        (id, user_id, account_id, category_id?,
                     type[income|expense|transfer], amount numeric,
                     to_account_id?, note, occurred_at, created_at)

budgets             (id, user_id, category_id, month date, amount numeric)
```

Relasi penting:
- `projects 1—N tasks` → progres project = task `done` / total task
- `projects 1—N project_files` → lampiran disimpan di Supabase Storage
- `accounts 1—N transactions`, `categories 1—N transactions`
- Saldo akun **dihitung** (`initial_balance + Σ transaksi`), tidak disimpan, supaya tidak pernah selisih

---

## 5. Struktur Folder

```
personal-web/
├─ app/
│  ├─ (public)/
│  │  ├─ page.tsx                 ← Welcome
│  │  ├─ about/page.tsx
│  │  ├─ portfolio/page.tsx
│  │  ├─ portfolio/[slug]/page.tsx
│  │  └─ contact/page.tsx
│  ├─ (auth)/login/page.tsx
│  └─ app/                        ← Life OS (private)
│     ├─ layout.tsx               ← sidebar + cek login
│     ├─ page.tsx                 ← Dashboard Today
│     ├─ journal/…
│     ├─ tasks/…
│     ├─ projects/…
│     ├─ money/…
│     └─ settings/…
├─ components/
│  ├─ ui/                         ← shadcn (button, card, dialog…)
│  ├─ layout/                     ← Navbar, Sidebar, Footer
│  └─ cosmic/                     ← elemen visual tema (planet, bintang, orbit)
├─ features/                      ← logika per modul (query, action, schema)
│  ├─ journal/
│  ├─ tasks/
│  ├─ projects/
│  └─ money/
├─ lib/supabase/                  ← client & server helper
├─ supabase/migrations/           ← SQL skema database (versi terkontrol)
├─ middleware.ts                  ← proteksi /app/*
├─ MASTER.md                      ← dokumen ini
└─ legacy/index.html              ← versi lama, jadi referensi desain
```

Aturannya: **satu fitur = satu folder di `features/`**. Kalau nanti nambah
habit tracker → `features/habits/` + `app/app/habits/`. Selesai.

---

## 6. Desain Visual (melanjutkan yang sudah ada)

> ⏳ **Sementara.** Isi di bawah diambil dari `index.html` lama. Akan disusun ulang
> setelah referensi desain terkumpul di Drive `02 - Design References` (lihat K-06).

Token warna dari `index.html` dipertahankan dan dipindah ke `tailwind.config`:

| Token | Hex | Dipakai untuk |
|---|---|---|
| `deep-space` | `#02081C` | Background utama |
| `blue-dom` | `#0073FF` | Warna utama, tombol, link |
| `blue-light` | `#80B9FF` | Teks aksen, garis |
| `purple` | `#7000FF` | Gradien, highlight |
| `magenta` | `#D9008A` | Aksen sekunder |
| `pink` | `#FF4D9B` | Badge, notifikasi |
| `coral` | `#FF6B6B` | Pengeluaran / peringatan |

Font: **Montserrat** (judul) + **Inter** (isi).
Public site boleh penuh animasi kosmik (planet, orbit, typewriter); Life OS dibuat
**lebih tenang** — panel kaca gelap, animasi minimal — karena dipakai lama tiap hari.

---

## 7. Roadmap Pengerjaan

Kerjakan bertahap, tiap fase menghasilkan sesuatu yang bisa langsung dipakai.

| Fase | Target | Hasil |
|---|---|---|
| **0. Persiapan & Fondasi** | Kumpulkan referensi desain → isi Bagian 6, kunci isi tiap halaman; lalu setup Next.js + Tailwind + shadcn dari awal, simpan `index.html` lama ke `legacy/` | Desain final + project baru jalan di Vercel |
| **1. Public Site** | Welcome, About, Portfolio (data sementara dari file JSON), Contact | Website publik live ✅ |
| **2. Auth & Shell** | Supabase, login, middleware `/app`, sidebar Life OS | Ruang private bisa diakses |
| **3. Projects & Tasks** | CRUD project + task + lampiran, Kanban; Portfolio mulai ambil data dari DB | Kumpulan tugas/project jalan |
| **4. Journal** | Editor BlockNote, satu entri per hari, mood, kalender, search | Journaling harian jalan |
| **5. Money** | Akun, kategori, transaksi, budget, grafik | Money management jalan |
| **6. Dashboard Today** | Gabungkan ringkasan semua modul di `/app` | Satu layar untuk hari ini |
| **7. Polish** | PWA (install di HP), export data, dark/light, fitur lanjutan | Siap dipakai harian |

Saran: **jangan loncat fase**. Fase 1 saja sudah cukup untuk punya website
yang bisa dikirim ke orang. Fase berikutnya menambah alat bantu harian.

---

## 8. Keamanan & Data

- Hanya **satu akun** (kamu). Matikan sign-up publik di Supabase.
- Semua tabel pakai **RLS**; kunci `service_role` tidak pernah dikirim ke browser.
- Environment variable (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) disimpan di Vercel, **tidak di-commit**.
- Halaman `/app/*` diberi `noindex` agar tidak masuk Google.
- Backup: fitur export JSON di Settings + backup otomatis bawaan Supabase.

---

## 9. Keputusan yang Perlu Kamu Tentukan

1. **Nama domain** — misal `rahulghulam.dev` / `rahulghulam.my.id` (opsional, Vercel kasih domain gratis).
2. **Konteks task** — apakah kategori tetap (Kuliah, BEM, Asprak, GMRT, KKN) atau bebas dibuat sendiri?
3. **Mata uang** — cukup IDR, atau perlu multi-currency?
4. **Bahasa situs publik** — Indonesia, Inggris, atau dua bahasa?

---

## 10. Penyimpanan: GitHub & Google Drive

| Disimpan di | Isi |
|---|---|
| **GitHub** (repo) | Kode, `MASTER.md` ini, aset final yang dipakai web |
| **Google Drive** | Referensi desain, file mentah/besar, bahan portfolio, backup data |

Struktur folder Drive **Personal Web**:

```
Personal Web/
├─ README.md               ← link ke repo + aturan penyimpanan
├─ 01 - Docs               ← export PDF dokumen (baca offline)
├─ 02 - Design References  ← referensi desain dari luar
│  ├─ welcome/ portfolio/ dashboard/ journal/ money/   ← screenshot per halaman
│  └─ links.txt            ← link + "kenapa suka" + nama screenshot
├─ 03 - Assets             ← foto profil, logo, font, ilustrasi (mentah)
├─ 04 - Portfolio Content  ← bahan per project (foto, laporan, video demo)
├─ 05 - Backups            ← export data Life OS (JSON/CSV) + README lama
└─ 06 - Design Files       ← file desain FigCraft (.figcraft) + export PNG
```

Aturan:
1. `MASTER.md` hanya diedit di GitHub → satu sumber kebenaran, tidak ada dua versi.
2. Nama file di Drive: `YYYY-MM-DD_nama-singkat.ext` (contoh `2026-11-09_ref-hero-dark.png`).
3. Aset yang sudah final → dioptimasi lalu masuk ke repo (`public/`).

### Format referensi desain
- **Foto/screenshot** (PNG/JPG/WebP) → paling ideal, bisa langsung dianalisis AI.
- **Video** (termasuk TikTok) → AI tidak bisa menonton video / membuka link TikTok.
  Sertakan 2–4 screenshot momen penting + catatan singkat (animasi/interaksi apa
  yang disukai) + link sumber asli (Dribbble/Awwwards/website) bila disebut di video.
- Catat di `links.txt` per referensi: link + "kenapa suka" + nama file screenshot.

### Alat desain: FigCraft (ArtCraft)
Desain dibuat lewat prompt ke Claude Code, yang menggambar langsung di FigCraft.

| | |
|---|---|
| Aplikasi | FigCraft (ArtCraft) — `C:\Program Files\ArtCraft\FigCraft\` |
| Koneksi | MCP server `figcraft` (user-scope di `~/.claude.json`): `figcraft-cli.exe mcp --attach 47821 --timeout 120` |
| Cara buka | **Wajib** lewat shortcut Desktop **"FigCraft (Claude)"** (= `figcraft.exe --control 47821`) |
| Tool utama | `create_node`, `set_properties`, `batch`, `run_command`, `inspect_document`, `screenshot`, `export`, `save_file` |

Alur kerja desain:
1. Buka FigCraft via shortcut → buka session Claude Code.
2. Beri prompt (misal: *"welcome page desktop 1440px, background gelap, hero besar"*).
3. Claude menggambar → ambil `screenshot` untuk cek → revisi lewat prompt.
4. File desain (`.figcraft`) + export PNG disimpan ke Drive `06 - Design Files/`;
   keputusan desain final dicatat di Bagian 6.

---

# BAGIAN B — CATATAN BERJALAN

---

## 11. Log Keputusan

Keputusan penting yang sudah disepakati. Jangan diubah tanpa menambah baris baru
yang menjelaskan alasannya.

| # | Tanggal | Keputusan | Alasan |
|---|---|---|---|
| K-01 | 2026-11-09 | Web dibagi dua: **Public Site** + **Life OS (private)** dalam satu aplikasi | Satu codebase, portfolio bisa otomatis dari data project |
| K-02 | 2026-11-09 | Stack: Next.js + TypeScript + Tailwind + shadcn/ui + Supabase, hosting Vercel | Butuh login & database; gratis untuk skala personal |
| K-03 | 2026-11-09 | Pengerjaan **mulai dari awal**; `index.html` lama hanya jadi referensi | Versi lama satu file 66 KB, tidak bisa menyimpan data |
| K-04 | 2026-11-09 | GitHub untuk kode & dokumen, Google Drive untuk bahan mentah & file besar | Pemisahan jelas, tidak ada duplikasi dokumen |
| K-05 | 2026-11-09 | Semua konsep, history, dan saran dicatat di **satu file `MASTER.md`** | Satu tempat acuan; mudah dilacak |
| K-06 | 2026-11-09 | Desain visual menunggu referensi dari Rahul (tema kosmik lama belum tentu dipakai) | Desain ingin dimulai ulang berdasarkan referensi baru |
| K-07 | 2026-11-10 | Alat desain: **FigCraft (ArtCraft)** yang dikendalikan Claude via MCP | Desain bisa dibuat & direvisi lewat prompt; tidak perlu Figma |
| K-08 | 2026-11-10 | Referensi desain utama berupa screenshot + catatan; video/TikTok hanya pelengkap | AI tidak bisa menonton video atau membuka link TikTok |

---

## 12. Log Pengerjaan (History)

Urutan terbaru di atas. Setiap sesi kerja menambah satu entri.

### 2026-11-10 — Sesi 4: Format referensi & koneksi FigCraft
- Ditetapkan format referensi desain: foto/screenshot utama; video & TikTok
  dilengkapi screenshot + catatan + link sumber asli (lihat Bagian 10).
- FigCraft (ArtCraft, desktop) dihubungkan ke Claude Code lewat MCP mode *attach*
  port 47821; dibuat shortcut Desktop "FigCraft (Claude)". Tes `tools/list`
  berhasil (19 tool). Backup config: `~/.claude.json.bak-figcraft`.
- Repo di-clone ke laptop: `D:\rahul\personal-web`.
- Google Drive: dibuat subfolder `welcome/ portfolio/ dashboard/ journal/ money/`
  + template `links.txt` di `02 - Design References`; folder baru `06 - Design Files`;
  `README.md` Drive diperbarui (versi lama dipindah ke `05 - Backups`).

### 2026-11-09 — Sesi 3: File master
- `docs/KONSEP.md` dipindah & dikembangkan menjadi `MASTER.md` di root repo.
- Ditambah Bagian B: Log Keputusan, Log Pengerjaan, Saran & Ide, cara update.
- Ditambah `CLAUDE.md` berisi aturan agar setiap sesi kerja selalu mencatat ke file ini.

### 2026-11-09 — Sesi 2: Google Drive & rencana dokumentasi
- Dibuat folder Google Drive **Personal Web** + 5 subfolder + `README.md`.
- Dibuat `README.md` di repo yang menautkan ke folder Drive.
- Diputuskan: pengerjaan dimulai dari awal, Rahul mengumpulkan referensi desain dulu.

### 2026-11-09 — Sesi 1: Konsep & sistem
- Analisis repo lama: satu file `index.html` (Tailwind CDN, tema kosmik, halaman
  home/portfolio/projects/profile/dashboard ditukar dengan `display:none`, tanpa
  penyimpanan data).
- Disusun konsep Public Site + Life OS, sitemap, arsitektur, skema database,
  struktur folder, token desain, roadmap 8 fase, catatan keamanan.

### 2026-05-10 — Versi awal (sebelum dokumen ini)
- Upload `portfolio.html`, lalu di-rename menjadi `index.html`.

---

## 13. Saran & Ide ke Depan

### Langkah berikutnya (prioritas)
- [x] Hubungkan alat desain (FigCraft) ke Claude Code — 2026-11-10
- [ ] Buka session Claude Code baru → izinkan server `figcraft` → tes koneksi.
- [ ] Sesi desain pertama di FigCraft: welcome page (desktop + mobile).
- [ ] **Rahul:** kumpulkan 5–15 referensi desain di Drive `02 - Design References`
      (pisahkan: welcome page, portfolio, dashboard, journal, money).
- [ ] **Rahul:** jawab Keputusan Terbuka di Bagian 9 (domain, konteks task, mata uang, bahasa).
- [ ] Susun ulang Bagian 6 (Desain Visual) berdasarkan referensi.
- [ ] Kunci isi teks tiap halaman publik (About, daftar project yang ditampilkan).
- [ ] Mulai Fase 0: setup project Next.js baru, pindahkan `index.html` ke `legacy/`.

### Saran
- Mulai dari **situs publik dulu** (Fase 1) supaya cepat punya sesuatu yang bisa dibagikan.
- Siapkan konten portfolio sejak sekarang di Drive `04 - Portfolio Content`
  (satu subfolder per project: foto, ringkasan 2–3 kalimat, peran kamu, tech stack, link).
- Dari dashboard lama, konteks yang sudah terlihat: BEM KM FT UGM, Asprak Fisika
  Dasar, GMRT, KKN Saba Mortara → kandidat awal kategori task & project.
- Kalau `MASTER.md` sudah terlalu panjang (>1000 baris), pecah bagian fitur ke
  `docs/features/*.md`, tapi tetap ditautkan dari sini.

### Bank ide (belum dijadwalkan)
- Habit tracker, reading/watch list, goals tahunan
- Global search (⌘K) lintas journal, task, project
- Reminder via email/Telegram, integrasi Google Calendar
- Sinkron otomatis dokumen ke Google Drive via GitHub Action
- Mode PWA agar bisa di-install di HP

---

## 14. Cara Memperbarui File Ini

Setiap kali ada pengerjaan:

1. **Log Pengerjaan (12):** tambah entri baru paling atas —
   `### YYYY-MM-DD — Sesi N: judul` + poin apa yang dikerjakan.
2. **Log Keputusan (11):** kalau ada keputusan baru / perubahan, tambah baris `K-xx`.
3. **Saran & Ide (13):** centang yang selesai, tambah langkah berikutnya.
4. **Bagian A:** kalau konsep/sistem berubah, edit bagian terkait.
5. **Header:** perbarui *Status saat ini* dan *Terakhir diperbarui*.

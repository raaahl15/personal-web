# Konsep & Sistem — Personal Web "Life OS"

> Dokumen ini adalah cetak biru (blueprint) untuk personal website Rahul Ghulam.
> Tujuannya supaya arah project jelas dulu sebelum ngoding ulang, dan supaya
> nggak gonta-ganti konsep lagi.

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
├─ docs/KONSEP.md                 ← dokumen ini
└─ legacy/index.html              ← versi lama, jadi referensi desain
```

Aturannya: **satu fitur = satu folder di `features/`**. Kalau nanti nambah
habit tracker → `features/habits/` + `app/app/habits/`. Selesai.

---

## 6. Desain Visual (melanjutkan yang sudah ada)

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
| **0. Fondasi** | Setup Next.js + Tailwind + shadcn, pindahkan token warna, simpan `index.html` lama ke `legacy/` | Project baru jalan di Vercel |
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

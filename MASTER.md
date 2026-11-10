# MASTER — Personal Web "Life OS"

> **File induk project.** Semua konsep, sistem, keputusan, catatan pengerjaan
> (history), dan saran ke depan dicatat di sini. Kalau ada yang berubah, file ini
> yang di-update lebih dulu.

| | |
|---|---|
| Pemilik | Rahul Ghulam |
| Repo | https://github.com/raaahl15/personal-web |
| Google Drive | https://drive.google.com/drive/folders/13VVrjm4MkPGJBJFvxNU29PSw40nHE-U0 |
| Status saat ini | **Fase 0 — Persiapan:** **desain UI/UX v1.0 selesai di FigCraft** (5 halaman, 27 frame: design system, situs publik desktop+mobile, Life OS desktop+mobile, light/dark via variabel); project Next.js 16 dua bahasa sudah disiapkan + konten dari CV; berikutnya Rahul review desain → unggah file ke Drive → deploy Vercel → mulai Fase 1 |
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
Keduanya satu domain, satu codebase, satu desain (biru langit + glassmorphism,
lihat Bagian 6 dan K-09).

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

Situs publik dua bahasa (K-17): Inggris tanpa prefix (`/about`), Indonesia dengan
prefix `/id` (`/id/about`). Life OS (`/app/*`) hanya bahasa Indonesia.

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
/app/money/invest       → Portofolio trading/investasi (forex, saham, crypto, dll)
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
- Field: judul, deadline, prioritas, konteks, project terkait
- **Konteks dibuat sendiri** (K-15): bisa tambah, ganti nama, ganti warna/ikon, hapus
  di Settings. Isian awal: Kuliah, BEM, Asprak, GMRT, KKN. Konteks yang dihapus tidak
  menghapus task-nya; task jadi "tanpa konteks".
- Bisa dihubungkan ke project

**🗂️ Projects (`/app/projects`)** — "kumpulan tugas/project yang bisa diakses"
- Setiap project punya: deskripsi, status, progres (dihitung dari task), lampiran
  (file PDF/gambar di storage), link (GitHub, Drive, Figma)
- Switch `is_public` → tampil di Portfolio
- Switch `featured` → tampil di Welcome page

**💰 Money (`/app/money`)**
- Akun/dompet: Cash, Bank, E-wallet (GoPay, OVO, dll), Broker/Exchange (akun trading)
- **Dua mata uang: IDR dan USD** (K-16). Setiap akun punya mata uangnya sendiri;
  transfer IDR ↔ USD mencatat jumlah keluar & jumlah masuk (kurs tersirat).
- Total kekayaan & laporan ditampilkan dalam IDR memakai kurs harian USD→IDR
  (disimpan di tabel `exchange_rates`; diisi manual dulu, otomatis dari API nanti).
- Transaksi: pemasukan / pengeluaran / transfer antar akun
- Kategori (Makan, Transport, Kos, Organisasi, ...) + budget bulanan per kategori
- Laporan: grafik pengeluaran per kategori, tren bulanan

**📈 Invest (`/app/money/invest`)** — trading & investasi (K-16)
- Aset dengan kelas: forex, saham, crypto, lainnya (reksadana, obligasi, emas, …)
- Catat trade: beli/jual (atau long/short untuk forex), jumlah, harga, fee, tanggal,
  akun broker, catatan/alasan masuk (jurnal trading)
- Posisi terbuka + rata-rata harga, P/L terealisasi per trade, ringkasan per kelas aset
- Harga terkini diisi manual dulu; integrasi API harga (crypto/saham/forex) nanti
- Dikerjakan **setelah** Money dasar stabil (lihat Roadmap Fase 5)

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
| Framework | **Next.js 16.4 (App Router, Turbopack, Cache Components) + TypeScript** | Satu project untuk public (SEO) & private app; routing sudah rapi per folder |
| Styling | **Tailwind CSS** | Sudah dipakai di `index.html`, tinggal pindahkan token warna |
| Komponen UI | **shadcn/ui** (CLI v4, style `base-nova` / Base UI) + **lucide-react** | Komponen siap pakai (dialog, tabel, form), ikon sama dengan yang sekarang |
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
                     -- title/summary/content berupa jsonb {en, id} untuk situs 2 bahasa (K-17)
                     status[idea|active|done|archived], cover_url,
                     tech_stack text[], links jsonb,
                     is_public bool, featured bool, start_date, end_date,
                     created_at, updated_at)

project_files       (id, project_id, name, storage_path, mime_type, size)

contexts            (id, user_id, name, color, icon, position)   ← dibuat sendiri (K-15)

tasks               (id, user_id, project_id?, context_id?, title, description,
                     status[todo|doing|done], priority[low|med|high],
                     due_date, completed_at, position, created_at)
                     -- context_id ON DELETE SET NULL

journal_entries     (id, user_id, entry_date UNIQUE per user, title,
                     content jsonb  ← format block BlockNote,
                     mood smallint, tags text[], created_at, updated_at)

accounts            (id, user_id, name, type[cash|bank|ewallet|broker],
                     currency[IDR|USD], initial_balance numeric)

categories          (id, user_id, name, type[income|expense], icon, color)

transactions        (id, user_id, account_id, category_id?,
                     type[income|expense|transfer], amount numeric,
                     to_account_id?, to_amount numeric?,  ← jumlah masuk bila beda mata uang
                     note, occurred_at, created_at)

budgets             (id, user_id, category_id, month date, amount numeric)  ← dalam IDR

exchange_rates      (id, rate_date, base='USD', quote='IDR', rate numeric)

-- Invest (K-16)
assets              (id, user_id, symbol, name, class[forex|stock|crypto|other],
                     quote_currency[IDR|USD], last_price numeric?, price_updated_at?)

trades              (id, user_id, account_id, asset_id,
                     side[buy|sell|long|short], quantity numeric, price numeric,
                     fee numeric, opened_at, closed_at?, close_price numeric?,
                     realized_pnl numeric?, note, created_at)
```

Relasi penting:
- `projects 1—N tasks` → progres project = task `done` / total task
- `projects 1—N project_files` → lampiran disimpan di Supabase Storage
- `accounts 1—N transactions`, `categories 1—N transactions`
- Saldo akun **dihitung** (`initial_balance + Σ transaksi`), tidak disimpan, supaya tidak pernah selisih
- Saldo selalu dalam mata uang akun; konversi ke IDR hanya saat ditampilkan (pakai `exchange_rates`)
- `contexts 1—N tasks`, `assets 1—N trades`, `accounts 1—N trades`

---

## 5. Struktur Folder

```
personal-web/
├─ app/
│  ├─ [lang]/                     ← situs publik en | id (i18n bawaan Next.js, K-18)
│  │  ├─ layout.tsx               ← root layout publik (font, tema, metadata)
│  │  ├─ dictionaries.ts          ← loader teks UI per bahasa
│  │  ├─ dictionaries/en.json, id.json
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
│  └─ theme-toggle.tsx            ← toggle dark/light (animasi lingkaran menyusul)
├─ features/                      ← logika per modul (query, action, schema)
│  ├─ journal/
│  ├─ tasks/
│  ├─ projects/
│  └─ money/
├─ content/profile.ts             ← profil, pendidikan, pengalaman, prestasi, skill (dari CV, {en,id})
├─ lib/i18n.ts                    ← daftar locale, tipe Localized, localePath()
├─ lib/supabase/                  ← client & server helper
├─ supabase/migrations/           ← SQL skema database (versi terkontrol)
├─ proxy.ts                       ← routing bahasa; nanti juga proteksi /app/* (Next 16: middleware → proxy)
├─ MASTER.md                      ← dokumen ini
└─ legacy/index.html              ← versi lama, jadi referensi desain
```

Aturannya: **satu fitur = satu folder di `features/`**. Kalau nanti nambah
habit tracker → `features/habits/` + `app/app/habits/`. Selesai.

---

## 6. Desain Visual

> Disusun 2026-11-10 dari 3 gambar + 6 video referensi di Drive
> `02 - Design References` (K-09, K-10, K-11). Detail visual final (hex warna
> fungsional, ukuran) dikunci saat desain di FigCraft.

### Arah desain
**Bersih, lapang, glassmorphism, biru langit monokrom, sudut sangat bulat, dark/light
mode sebagai fitur utama.** Menggantikan tema kosmik ungu-magenta dari `index.html`
lama. Nuansa "langit malam" tetap terasa lewat ujung gelap palet (dark mode).

### Referensi yang dipakai
| File (Drive `02 - Design References`) | Yang diambil |
|---|---|
| `_umum/design layout inspiration.jpg` (Orizon Design, "New Way Of Living") | Tata letak, kartu kaca, sidebar & navbar pil |
| `_umum/Sky Blue Premium Palette.jpg` | Palet warna 16 tingkat |
| `_umum/Perfect Font Pairing Formula!💠.jpg` | Aturan pasangan font → dipilih Outfit + Inter |

### Layout & komponen
- **Bingkai utama** bersudut sangat bulat (radius ±32px) berisi visual/foto
  *full-bleed* sebagai latar.
- **Judul raksasa** tipis, semi-transparan, menumpuk di atas visual.
- **Kartu kaca (glassmorphism)** mengambang: putih/gelap transparan + `backdrop-blur`,
  sudut bulat, bayangan halus.
- **Sidebar ikon vertikal berbentuk pil** (kiri): navigasi + avatar + notifikasi;
  **toggle dark/light** di bagian bawah.
- **Navbar atas berbentuk pil**: tombol di kiri–kanan, filter/menu di tengah.
- Detail: tombol panah bulat ↗, angka statistik besar (mis. "10K+"), tumpukan avatar,
  ikon aksi bulat (like/save/share).

Penerapan per wajah:
- **Public Site / Welcome:** hero di dalam bingkai + judul besar + kartu kaca
  berisi project unggulan & statistik singkat.
- **Life OS:** sidebar pil = navigasi app; kartu kaca = widget dashboard (task hari ini,
  ringkasan uang, jurnal). Animasi lebih minimal karena dipakai harian.

### Palet warna — Sky Blue (monokrom)
| Nama | Hex | | Nama | Hex |
|---|---|---|---|---|
| Cloud | `#F0F7FF` | | Cerulean | `#1E7DFF` |
| Arctic Sky | `#E1F0FF` | | Deep Sky | `#1662CC` |
| Mist Blue | `#CDE4FF` | | Azure | `#0F4FA3` |
| Light Sky | `#B6D8FF` | | Twilight Blue | `#0A3B7A` |
| Clear Sky | `#97C9FF` | | Evening Sky | `#062956` |
| Day Sky | `#78BAFF` | | Night Blue | `#041A35` |
| Bright Sky | `#5CAEFF` | | Midnight | `#021024` |
| Pure Sky | `#3D9BFF` | | Ink Sky | `#010A16` |

> Hex dibaca dari teks gambar; urutan nama Mist Blue/Light Sky dan
> Twilight/Evening/Night Blue perlu dicek ulang di gambar aslinya.

Pemakaian — sudah diterapkan sebagai token di `app/globals.css` (skala `sky-50…950`
+ token semantik shadcn untuk light/dark):

| Peran | Light mode | Dark mode |
|---|---|---|
| Latar halaman | Cloud `#F0F7FF` | Ink Sky `#010A16` |
| Permukaan / kartu | Arctic Sky `#E1F0FF` (kaca putih) | Midnight `#021024` (kaca gelap) |
| Garis / border | Mist Blue `#CDE4FF` | Evening Sky `#062956` |
| Aksen utama (tombol, link) | Deep Sky `#1662CC` (K-19) | Pure Sky `#3D9BFF` |
| Ring fokus / grafik | Cerulean `#1E7DFF` | Pure Sky `#3D9BFF` |
| Teks utama | Midnight `#021024` | Cloud `#F0F7FF` |
| Teks sekunder | Azure `#0F4FA3` | Clear Sky `#97C9FF` |

Warna fungsional di luar palet (dipakai secukupnya): **oranye hangat** (seperti
cahaya lampu di referensi layout) untuk pengeluaran/peringatan/notifikasi, dan
hijau lembut untuk pemasukan/sukses — nilai hex ditentukan saat desain di FigCraft.

### Tipografi
- **Judul:** **Outfit** (sans geometris; bobot tipis–sedang untuk judul raksasa, tebal
  untuk angka statistik).
- **Isi & UI:** **Inter**.
- Kombinasi sans + sans sesuai aturan referensi font pairing (hindari serif+serif,
  script+script). Keduanya tersedia di Google Fonts / `next/font`.

### Animasi
Dianalisis 2026-11-10 dari 6 video di Drive `02 - Design References` (frame diambil
otomatis dari video; easing/kecepatan masih perkiraan).

**Benang merah:** hampir semua referensi memakai alur **gelap → terang** saat
scroll. Dark/light mode dijadikan "alur cerita" welcome page, bukan sekadar setting.

| Video | Sumber | Yang diambil |
|---|---|---|
| `welcome/suka untuk welcome page animasinya` | @heroinspo (web bank "Clarity is the real luxury") | Pembuka gelap + garis cahaya biru-ungu "warp"; latar berubah gelap → putih → biru langit saat scroll; angka statistik menghitung naik; judul sans + aksen *serif miring* |
| `welcome/efect geser websitenya kebawah` | @fraxbit | Hero gelap teks besar → bagian terang; parallax gambar vs konten; kartu muncul sambil bergeser naik |
| `welcome/suka animasinya` | @samanastudio ("Montfort Trading") | Scroll sinematik "kamera menembus adegan" (gunung → awan → bumi → hutan); judul huruf renggang terbelah saat zoom. Berat → opsional, hanya untuk hero |
| `login/suka untuk animasi login page` | @esther252005 | Panel overlay geser kiri-kanan (Sign In ↔ Create Account) + teks crossfade. Ambil animasinya, warna diganti Sky Blue; panel kedua diisi konten lain (hanya 1 akun) |
| `portfolio/suka untuk animasi di portfolio` | portfolio Eka Wahyu Maulidan | **Kartu folder yang terbuka saat hover (kertas menyembul)** untuk Projects/Certificates/Awards; navbar pil dengan indikator aktif bergeser; latar garis kontur topografi; timeline Education/Experience; teks raksasa "PORTOFOLIO" membesar sebagai transisi; tab + carousel kartu. (Efek hover foto → topeng: opsional) |
| `_umum/suka bagian transisi dari dark mode ke light mode` | @chard0xx | **Ganti tema dengan lingkaran membesar dari tombol toggle** (View Transitions API + `clip-path: circle()`); nama raksasa outline berjalan (marquee) di belakang foto; judul efek mengetik; carousel coverflow 3D; penutup tipografi tebal "LET'S WORK TOGETHER" + kartu kontak |

**Penerapan per halaman:**

| Halaman | Animasi |
|---|---|
| Welcome | Pembuka gelap + cahaya warp → scroll gelap → terang (biru langit); counter angka; parallax ringan; (opsional) hero sinematik menembus adegan |
| About | Nama raksasa outline berjalan di belakang foto; timeline pendidikan/pengalaman |
| Portfolio | Kartu folder terbuka saat hover; carousel coverflow; judul efek mengetik; teks raksasa sebagai transisi antar bagian |
| Contact | Penutup tipografi tebal + kartu kontak |
| Login | Panel geser + crossfade |
| Global | Toggle dark/light dengan lingkaran membesar; navbar pil dengan indikator aktif bergeser |
| Life OS | Minimal: transisi tema + kartu fade-in; tanpa efek berat |

**Acuan kualitas:** setiap halaman dicek dengan Pre-Delivery Checklist skill
UI/UX Pro Max (kontras 4.5:1 di light & dark, fokus keyboard terlihat, target sentuh
≥44px, ikon SVG bukan emoji, responsif 375/768/1024/1440px, `prefers-reduced-motion`).

**Catatan teknis (untuk Fase 1):** animasi scroll & transisi pakai **Motion**
(Framer Motion) atau GSAP ScrollTrigger; ganti tema pakai View Transitions API;
hormati `prefers-reduced-motion` (animasi berat dimatikan).

**Tambahan tipografi dari referensi:** aksen *serif miring* untuk 1–2 kata di judul
→ **dipakai: Instrument Serif Italic** (K-24), hanya untuk 1–2 kata aksen (mis. "*website.*").

### Desain UI/UX v1.0 (FigCraft) — 2026-11-10

File: `2026-11-10_personal-web-ui-v1.0.figcraft` (lokal: `D:\rahul\personal-web-design\`,
plus `export/` berisi 5 PDF per halaman, 4 PNG, `tokens-v1.0.css`). **Belum diunggah ke
Drive `06 - Design Files`** (lihat Bagian 13).

| Halaman FigCraft | Isi |
|---|---|
| 00 · Cover & Design System | Cover, Foundations (palet 16, token Light/Dark, tipografi, radius/efek), Components, Motion & Interaction spec |
| 01 · Public Site — Desktop (1440) | Welcome, About, Portfolio, Project Detail (GROMICS), Contact, Login |
| 02 · Public Site — Mobile (375) | Welcome, Menu terbuka, Portfolio |
| 03 · Life OS — Desktop (1440×1024) | Today (Light + Dark), Journal, Tasks (Kanban), Money, Invest, Projects, Settings |
| 04 · Life OS — Mobile (375) | Today (Light + Dark), bottom sheet catat pengeluaran |

**Token tema (variabel FigCraft, koleksi `Theme`, mode Light / Dark)** — dipakai di semua
komponen; ganti mode = ganti tema (dark mode di desain cukup duplikat frame + set mode).

| Token | Light | Dark | Pakai untuk |
|---|---|---|---|
| bg | `#F0F7FF` | `#010A16` | latar halaman |
| surface | `#FFFFFF` | `#021024` | kartu solid, editor, form |
| glass / glass-stroke | `#FFFFFF` 70% / `#FFFFFF` 90% | `#062956` 55% / `#3D9BFF` 18% | kartu kaca + blur 24 |
| muted | `#E1F0FF` | `#041A35` | chip, track progress, input |
| border | `#CDE4FF` | `#062956` | garis |
| text / text-2 / text-3 | `#021024` / `#0F4FA3` / `#4A6890` | `#F0F7FF` / `#97C9FF` / `#78BAFF` | teks utama / sekunder / meta (semua ≥4.5:1) |
| primary / on-primary | `#1662CC` / `#FFFFFF` | `#3D9BFF` / `#010A16` | tombol, link, nav aktif |
| primary-soft | `#CDE4FF` | `#0A3B7A` | chip/latar aktif |
| ring | `#1E7DFF` | `#3D9BFF` | fokus (2px + halo 4px) |
| success / success-soft | `#15803D` / `#DCFCE7` | `#4ADE80` / `#052E16` | pemasukan, selesai (K-22) |
| warm / warm-soft | `#C2410C` / `#FFEDD5` | `#FB923C` / `#431407` | pengeluaran, peringatan, prioritas tinggi (K-22) |
| chart-1/2/3 | `#1662CC` `#5CAEFF` `#0A3B7A` | `#3D9BFF` `#97C9FF` `#CDE4FF` | grafik |

**Skala & bentuk:** Display Outfit ExtraLight 104–136 · H1 Outfit Light 64 · H2 Outfit
Regular 40 · H3 Outfit Medium 24 · angka Outfit SemiBold (tabular) · body Inter 16–18 /
150–160% · label Inter SemiBold 12 +14% huruf kapital. Radius 12 (input), 20 (kartu kecil),
28–32 (kartu/bingkai), pill (tombol, nav). Kaca: blur 24 + border 1px + bayangan
`0 12 32 #062956/10%`. Target sentuh ≥44px.

**Komponen (main component di halaman 00):** Button/Primary, Button/Glass, Button/Small,
Button/Outline, IconButton, ThemeToggle, LangSwitch, Navbar/Public, Navbar/Mobile,
Sidebar/LifeOS, BottomNav/LifeOS (5 item), FilterTabs, Field, StatCard, TaskRow,
TransactionRow. Ikon = vektor gaya lucide (stroke 1.75–2).

**Catatan pola halaman:**
- Welcome: hero gelap (mode Dark) → section transisi gradien gelap→terang + 4 statistik →
  project unggulan (kartu folder, kertas menyembul) → cuplikan About (nama raksasa marquee)
  → penutup "LET'S WORK TOGETHER" → footer.
- Life OS: sidebar pil ikon + tooltip (aria-label wajib); widget kaca di atas latar dengan
  blob blur; Money menampilkan saldo per akun dalam mata uangnya + total IDR dengan kurs
  manual; transfer IDR→USD menampilkan dua jumlah + kurs tersirat (K-16).
- Kontras dicek: teks putih **tidak** boleh di atas Pure Sky/Bright Sky (≈2.9:1) — gradien
  berisi teks dimulai dari Azure/Deep Sky (K-23).

**Selisih dengan kode saat ini (`app/globals.css`) yang perlu disamakan di Fase 1:**
`--card` light masih Arctic Sky (desain: putih untuk `surface`, Arctic Sky untuk `muted`);
belum ada token `success`, `warm-soft`/`success-soft`, `text-3`, `glass`/`glass-stroke`;
`--chart-1` light masih Cerulean (desain: Deep Sky).

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
| **5. Money** | Akun IDR/USD, kategori, transaksi, budget, grafik, kurs; lalu sub-modul Invest (aset, trade, P/L) | Money management + jurnal trading jalan |
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

Semua sudah dijawab 2026-11-10 → K-14 s.d. K-17.

1. ~~Nama domain~~ → pakai `*.vercel.app` dulu; nama domain sendiri dipikirkan nanti (K-14).
2. ~~Konteks task~~ → dibuat sendiri, bisa tambah/ganti/hapus (K-15).
3. ~~Mata uang~~ → IDR + USD, plus sub-modul Invest untuk forex/saham/crypto (K-16).
4. ~~Bahasa situs publik~~ → dua bahasa, Inggris + Indonesia (K-17).

Masih terbuka:
- Nama domain sendiri (sebelum situs dibagikan luas).
- ~~Bahasa default situs publik~~ → **Inggris**, dikonfirmasi Rahul 2026-11-10 (K-17).

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
│  ├─ _umum/               ← referensi lintas halaman (layout, palet, font, toggle tema)
│  ├─ welcome/ portfolio/ login/ dashboard/ journal/ money/   ← referensi per halaman
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
- **Video** → unggah **file videonya** ke Drive (bukan link TikTok); Claude bisa
  mengambil frame dan menganalisisnya (K-12). Nama file = apa yang disukai
  (contoh `suka animasi login page.mp4`). Link TikTok saja tidak bisa dibuka.
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

Catatan teknis FigCraft (ditemukan Sesi 7):
- Font **Outfit** dan **Instrument Serif** belum terpasang di laptop, dan Inter bawaan sistem
  tidak punya style Medium. Di setiap sesi, Claude memuat file font resmi Google Fonts lewat
  `text.loadFont` (hanya untuk sesi itu). Supaya permanen: pasang Outfit, Inter (variable),
  dan Instrument Serif di Windows, atau aktifkan *Download fonts* di menu Text ▸ Missing fonts.
- `page.select` di dalam `batch` tidak andal → pindah halaman dengan `run_command` terpisah.
- Hindari child `sizing: fill` di dalam parent `hug` (tinggi jadi 0).

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
| K-09 | 2026-11-10 | Arah visual baru: **biru langit monokrom + glassmorphism + sudut bulat + dark/light mode**; tema kosmik ungu-magenta lama ditinggalkan | Sesuai referensi layout & palet "Sky Blue Premium" dari Rahul; lebih tenang untuk dipakai harian |
| K-10 | 2026-11-10 | Font: **Outfit** (judul) + **Inter** (isi), menggantikan Montserrat | Dipilih Rahul (opsi A); cocok dengan judul sans geometris di referensi layout |
| K-11 | 2026-11-10 | Konsep animasi: alur **gelap → terang** saat scroll, toggle tema lingkaran membesar, kartu folder di portfolio; Life OS animasi minimal | Hasil analisis 6 video referensi Rahul |
| K-12 | 2026-11-10 | Video referensi dianalisis langsung oleh Claude (ambil frame otomatis); screenshot manual tidak wajib lagi (merevisi K-08) | Frame bisa diekstrak dari file video di Drive; link TikTok tetap tidak bisa dibuka |
| K-13 | 2026-11-10 | Skill **UI/UX Pro Max** dipasang sebagai skill acuan project (`.claude/skills/ui-ux-pro-max/`); dipakai untuk aturan UX, aksesibilitas, animasi, pedoman stack & checklist — **tidak** untuk mengganti gaya/palet/font yang sudah diputuskan | Permintaan Rahul; uji `--design-system` otomatis menyarankan Brutalism + Caveat yang bertentangan dengan K-09/K-10, jadi keputusan MASTER.md diutamakan |
| K-14 | 2026-11-10 | Domain: pakai `*.vercel.app` dulu; domain sendiri diputuskan nanti | Gratis, cukup selama pengembangan |
| K-15 | 2026-11-10 | Konteks task **dibuat sendiri** (tabel `contexts`, bisa tambah/ganti/hapus); isian awal Kuliah, BEM, Asprak, GMRT, KKN | Kegiatan berubah tiap semester |
| K-16 | 2026-11-10 | Money mendukung **IDR + USD** (mata uang per akun, kurs harian untuk total dalam IDR) + sub-modul **Invest** (forex, saham, crypto, instrumen lain) | Rahul aktif trading di berbagai instrumen; akun broker sering dalam USD |
| K-17 | 2026-11-10 | Situs publik **dua bahasa** (Inggris default, Indonesia di `/id`) pakai next-intl; Life OS hanya Indonesia | Portfolio bisa dibaca recruiter luar & lokal; Life OS cuma dipakai sendiri |
| K-18 | 2026-11-10 | i18n memakai **cara bawaan Next.js 16** (`app/[lang]`, `proxy.ts` rewrite/redirect, kamus JSON) — bukan next-intl (merevisi K-17 bagian library) | Didukung resmi di Next 16.4 + Cache Components; tanpa dependensi tambahan; kebutuhan hanya 2 bahasa |
| K-19 | 2026-11-10 | Warna tombol utama light mode = **Deep Sky `#1662CC`**, bukan Cerulean | Teks putih di Cerulean hanya 3.9:1 (gagal WCAG AA 4.5:1); Deep Sky 5.8:1 |
| K-20 | 2026-11-10 | Konten publik awal diambil dari **CV Rahul** (versi sebelum Nov 2026) → `content/profile.ts`; nomor HP tidak ditampilkan | Bahan paling lengkap yang ada; privasi |
| K-21 | 2026-11-10 | **Desain UI/UX v1.0** di FigCraft menjadi acuan implementasi Fase 1–7; tema dibangun dengan **variabel FigCraft** (koleksi `Palette` + `Theme` mode Light/Dark), bukan warna mentah | Satu sumber token untuk light/dark; mudah diekspor ke CSS (`tokens-v1.0.css`) |
| K-22 | 2026-11-10 | Warna fungsional dikunci: success `#15803D`/`#4ADE80`, warm `#C2410C`/`#FB923C` (+ versi soft), teks meta `text-3` `#4A6890`/`#78BAFF`; permukaan kartu light = putih | Melengkapi Bagian 6 yang menunggu hex fungsional; semua lolos 4.5:1 |
| K-23 | 2026-11-10 | Teks putih hanya di atas Deep Sky/Azure atau lebih gelap; gradien yang berisi teks dimulai dari `#0F4FA3`/`#1662CC` | Putih di atas Pure Sky ≈2.9:1 (gagal WCAG AA), ditemukan saat cek kontras |
| K-24 | 2026-11-10 | Aksen **Instrument Serif Italic** dipakai untuk 1–2 kata di judul besar | Sesuai referensi video welcome; menutup opsi yang terbuka di Bagian 6 |
| K-25 | 2026-11-10 | Navigasi Life OS: desktop = sidebar pil ikon + tooltip; mobile = bottom nav 5 item (Today, Journal, Tasks, Money, More); situs publik mobile = top bar + menu layar penuh | Aturan skill: bottom nav ≤5, target sentuh ≥44px, label aksesibel |

---

## 12. Log Pengerjaan (History)

Urutan terbaru di atas. Setiap sesi kerja menambah satu entri.

### 2026-11-10 — Sesi 7: Desain UI/UX v1.0 di FigCraft
- Koneksi MCP `figcraft` **berhasil** (attach 127.0.0.1:47821).
- Skill UI/UX Pro Max dipakai untuk aturan glassmorphism, pola landing portfolio, chart
  (line/bar, label nilai, jangan andalkan warna saja), preset GSAP; gaya/palet/font tetap
  mengikuti K-09/K-10.
- Dibuat file `2026-11-10_personal-web-ui-v1.0.figcraft` (5 halaman, 27 frame):
  - **00** Cover, Foundations (palet 16 sebagai variabel, token Theme Light/Dark, tipografi,
    radius/efek), Components (16 main component), Motion & Interaction spec.
  - **01** Welcome, About, Portfolio, Project Detail GROMICS, Contact, Login (desktop 1440).
  - **02** Welcome, Menu terbuka, Portfolio (mobile 375).
  - **03** Today Light + Dark, Journal (editor blok + menu `/`), Tasks Kanban (konteks
    sendiri, state drag), Money (akun IDR/USD, transfer berkurs, budget), Invest (ekuitas,
    posisi terbuka, jurnal trading), Projects (switch Publik/Unggulan), Settings (konteks,
    export JSON/CSV).
  - **04** Today mobile Light + Dark, bottom sheet catat pengeluaran.
- Konten memakai data CV (`content/profile.ts`); data Life OS = contoh (dummy).
- Perbaikan selama review screenshot: kontras teks putih di gradien (K-23), layout kolaps
  (fill di dalam hug), teks outline variable font yang menampilkan kontur → diganti teks
  "ghost" berisi, font Outfit/Instrument Serif/Inter Medium dimuat manual.
- Export: 5 PDF per halaman, 4 PNG (cover, welcome, Today light/dark), `tokens-v1.0.css`
  di `D:\rahul\personal-web-design\export\`.
- Unggah ke Drive `06 - Design Files` **gagal** (izin tool Google Drive `create_file`
  ditolak di sesi ini) → perlu diunggah manual atau izin ditambahkan.
- Keputusan baru K-21 s.d. K-25; Bagian 6 dilengkapi spesifikasi v1.0.

### 2026-11-10 — Sesi 6: Rapikan Drive referensi
- Dicek ulang root Drive: `03 - Assets` dan `README.md` **ternyata ada**; catatan
  Sesi 5 bahwa keduanya tidak ditemukan keliru (hasil pencarian waktu itu terpotong).
- Dibuat subfolder baru `_umum/` (referensi lintas halaman) dan `login/` di
  `02 - Design References`; 9 referensi dipindah: `_umum/` (3 gambar + video toggle
  tema), `welcome/` (3 video), `portfolio/` (1 video), `login/` (1 video).
  Path di Bagian 6 dan struktur di Bagian 10 diperbarui.
- MCP `figcraft` masih gagal terhubung ("Connection closed").
- Rahul menjawab 4 keputusan terbuka → K-14 (vercel.app), K-15 (konteks task bebas),
  K-16 (IDR + USD + modul Invest), K-17 (dua bahasa). Diperbarui: sitemap & modul
  (Bagian 2), skema database (Bagian 4: `contexts`, `currency`, `to_amount`,
  `exchange_rates`, `assets`, `trades`, konten project jsonb `{en,id}`), struktur
  folder (`[locale]`, `messages/`), Roadmap Fase 5, Bagian 9.
- Rahul mengonfirmasi bahasa default situs publik = Inggris, dan setuju menyiapkan
  teks dua bahasa (Claude bantu draf terjemahan).
- **Konten dari CV** (K-20): seluruh isi CV (ringkasan, pendidikan, 7 pengalaman
  organisasi, 3 mentoring, 1 asisten praktikum, 3 prestasi, skill) disusun dua bahasa
  di `content/profile.ts`; 2 kandidat project portfolio: GROMICS (IoT) & video profil SMA.
- **Setup project Next.js** (awal Fase 0 teknis): Next.js 16.4.6 + React 19.3 +
  Tailwind 4.3 + shadcn CLI v4 (`base-nova`) + lucide. `index.html` lama dipindah ke
  `legacy/`. Token warna Sky Blue (light/dark), font Outfit + Inter (`next/font`),
  toggle tema tanpa kedip (inline script), `prefers-reduced-motion`, routing dua bahasa
  (K-18), halaman sementara berisi nama + ringkasan + kontak. Build & lint lolos;
  tes routing: `/`→en, `/id`→id, `/en/*`→308 ke tanpa prefix, locale asing→404.
- Semua commit di-merge (fast-forward) ke `main` dan di-push; sebelumnya `origin/main`
  masih berisi commit lama (upload `portfolio.html`). Deploy Vercel menunggu Rahul login.
- Ditemukan: Next 16 mengganti `middleware.ts` menjadi `proxy.ts`; AGENTS.md bawaan
  meminta membaca dokumentasi di `node_modules/next/dist/docs/` sebelum menulis kode.

### 2026-11-10 — Sesi 5: Analisis referensi & arah desain visual
- Dicek progres GitHub + Drive. Ditemukan: referensi (3 gambar, 6 video) diunggah
  langsung ke `02 - Design References` (subfolder per halaman masih kosong);
  folder `03 - Assets` dan `README.md` root Drive tidak ditemukan.
- Dianalisis 3 gambar referensi (layout, palet Sky Blue, font pairing) → Bagian 6
  disusun ulang: layout, komponen, palet + pemakaian light/dark, tipografi.
- Keputusan K-09 (arah visual biru langit + glassmorphism) dan K-10 (Outfit + Inter).
- 6 video referensi dianalisis langsung (unduh dari Drive → ambil frame dengan
  OpenCV) → bagian Animasi di Bagian 6 diisi; keputusan K-11 dan K-12.
- Dipasang skill **UI/UX Pro Max** (v2.15.0) di `.claude/skills/ui-ux-pro-max/`;
  aturan pemakaian ditulis di `CLAUDE.md`; keputusan K-13.
- MCP `figcraft` gagal terhubung di sesi ini (aplikasi belum dibuka via shortcut).

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
- [x] Buka session Claude Code baru → izinkan server `figcraft` → tes koneksi — 2026-11-10
- [x] Sesi desain pertama di FigCraft → **desain UI/UX v1.0 lengkap** (27 frame) — 2026-11-10
- [ ] **Rahul:** review desain v1.0 di FigCraft (buka `D:\rahul\personal-web-design\…v1.0.figcraft`
      atau PDF di `export/`); tulis revisi sebagai komentar FigCraft atau di chat → v1.1.
- [ ] **Rahul:** unggah folder `D:\rahul\personal-web-design\` ke Drive `06 - Design Files/2026-11-10_ui-v1.0/`
      (atau beri izin tool Google Drive `create_file` agar Claude yang mengunggah).
- [ ] **Rahul (opsional):** pasang font Outfit, Inter (variable) & Instrument Serif di Windows
      agar FigCraft tidak perlu memuat font tiap sesi.
- [ ] Fase 1: samakan `app/globals.css` dengan token v1.0 (lihat "Selisih dengan kode" di Bagian 6),
      lalu bangun komponen (Navbar pil, Button, kartu kaca, kartu folder) dan halaman Welcome.
- [ ] Desain v1.1 (setelah review): halaman About/Contact mobile, Login mobile, Journal & Money
      mobile, state kosong/loading/error, foto asli & cover project.
- [x] **Rahul:** kumpulkan referensi desain di Drive `02 - Design References` — 2026-11-10 (3 gambar, 6 video)
- [x] Susun ulang Bagian 6 (Desain Visual) berdasarkan referensi gambar — 2026-11-10
- [x] Analisis 6 video referensi → bagian Animasi di Bagian 6 — 2026-11-10
- [x] Rapikan Drive: pindahkan referensi ke subfolder per halaman; cek `03 - Assets` & `README.md` root — 2026-11-10
- [ ] Perbarui template `links.txt` di Drive: aturan "video wajib disertai screenshot" sudah tidak berlaku (K-12).
- [x] **Rahul:** jawab Keputusan Terbuka di Bagian 9 (domain, konteks task, mata uang, bahasa) — 2026-11-10
- [x] **Rahul:** konfirmasi bahasa default situs publik → Inggris — 2026-11-10
- [x] Siapkan teks halaman publik dalam **dua bahasa** (EN + ID) dari CV — 2026-11-10 (`content/profile.ts`)
- [ ] **Rahul:** cek data CV yang mungkin sudah berubah per Nov 2026: status kelulusan
      UGM (CV: lulus Jun 2026), jabatan "Present" (Teknisiade, Kepala Biro BEM, Manajer
      Eksternal GMRT), apakah `ralogystudio.wuaze.com` masih dipakai, pengalaman baru
      (KKN, dll).
- [ ] **Rahul:** bahan project portfolio di Drive `04 - Portfolio Content` (foto, peran,
      tech stack, link) — minimal GROMICS; tambah project lain bila ada.
- [ ] **Rahul:** foto profil untuk situs → Drive `03 - Assets`.
- [x] Mulai Fase 0: setup project Next.js baru, pindahkan `index.html` ke `legacy/` — 2026-11-10
- [x] Merge branch kerja ke `main` + push ke GitHub — 2026-11-10
- [ ] **Rahul:** hubungkan repo ke **Vercel** (vercel.com → login GitHub → Import
      `personal-web` → Deploy; setelan default Next.js) → situs sementara di `*.vercel.app`.
      Catat URL-nya di header file ini.
- Catatan: cek data CV, bahan project, dan foto profil (3 poin di atas) ditunda sampai
  desain UI/UX versi 1 selesai — **desain v1.0 sudah selesai (Sesi 7)**, jadi ketiganya
  bisa dikerjakan sekarang; foto & cover project akan menggantikan placeholder gradien di desain.
- [ ] Kunci isi teks tiap halaman publik (About, daftar project yang ditampilkan).

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

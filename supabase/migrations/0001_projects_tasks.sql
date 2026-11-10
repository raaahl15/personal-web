-- ============================================================================
-- Fase 3 — Projects & Tasks (MASTER.md Bagian 4, K-15, K-17, K-30)
-- Jalankan SEKALI di Supabase → SQL Editor → New query → Run.
-- Aman dijalankan ulang (pakai IF NOT EXISTS / ON CONFLICT / DROP POLICY IF EXISTS).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper: updated_at otomatis
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- contexts — konteks task buatan sendiri (K-15)
-- ---------------------------------------------------------------------------
create table if not exists public.contexts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 40),
  color       text not null default '#1e7dff' check (color ~ '^#[0-9a-fA-F]{6}$'),
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists contexts_user_idx on public.contexts (user_id, position);

-- ---------------------------------------------------------------------------
-- projects — teks publik dua bahasa {en, id} (K-17)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  slug         text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        jsonb not null default '{"en": "", "id": ""}'::jsonb,
  summary      jsonb not null default '{"en": "", "id": ""}'::jsonb,
  highlights   jsonb not null default '{"en": [], "id": []}'::jsonb,
  result       jsonb,
  category     text not null default 'Web',
  status       text not null default 'active' check (status in ('idea', 'active', 'done', 'archived')),
  cover_style  text not null default 'pulse' check (cover_style in ('pulse', 'video', 'dashboard')),
  cover_url    text,
  tech_stack   text[] not null default '{}',
  links        jsonb not null default '[]'::jsonb,
  is_public    boolean not null default false,
  featured     boolean not null default false,
  start_date   date,
  end_date     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, slug)
);
create index if not exists projects_user_idx on public.projects (user_id, updated_at desc);
create index if not exists projects_public_idx on public.projects (is_public) where is_public;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------------------
create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id    uuid references public.projects (id) on delete set null,
  context_id    uuid references public.contexts (id) on delete set null,   -- konteks dihapus → task tetap ada
  title         text not null check (char_length(title) between 1 and 200),
  description   text,
  status        text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority      text not null default 'med' check (priority in ('low', 'med', 'high')),
  due_date      date,
  completed_at  timestamptz,
  position      double precision not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists tasks_user_status_idx on public.tasks (user_id, status, due_date);
create index if not exists tasks_project_idx on public.tasks (project_id);
create index if not exists tasks_context_idx on public.tasks (context_id);

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- project_files — metadata lampiran (file aslinya di Storage bucket "project-files")
-- ---------------------------------------------------------------------------
create table if not exists public.project_files (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id    uuid not null references public.projects (id) on delete cascade,
  name          text not null,
  storage_path  text not null unique,
  mime_type     text,
  size          bigint,
  created_at    timestamptz not null default now()
);
create index if not exists project_files_project_idx on public.project_files (project_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: semua data hanya milik pemiliknya (MASTER.md Bagian 8)
-- ---------------------------------------------------------------------------
alter table public.contexts      enable row level security;
alter table public.projects      enable row level security;
alter table public.tasks         enable row level security;
alter table public.project_files enable row level security;

drop policy if exists "contexts: owner" on public.contexts;
create policy "contexts: owner" on public.contexts
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "projects: owner" on public.projects;
create policy "projects: owner" on public.projects
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Portfolio publik: siapa pun boleh MEMBACA project yang ditandai publik (K-01 prinsip 3).
drop policy if exists "projects: public read" on public.projects;
create policy "projects: public read" on public.projects
  for select to anon, authenticated
  using (is_public);

drop policy if exists "tasks: owner" on public.tasks;
create policy "tasks: owner" on public.tasks
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "project_files: owner" on public.project_files;
create policy "project_files: owner" on public.project_files
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Storage: bucket privat untuk lampiran. Path file: <user_id>/<project_id>/<nama>
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', false, 52428800)   -- 50 MB (batas paket Free)
on conflict (id) do nothing;

drop policy if exists "project-files: owner read" on storage.objects;
create policy "project-files: owner read" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "project-files: owner insert" on storage.objects;
create policy "project-files: owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "project-files: owner delete" on storage.objects;
create policy "project-files: owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------------------------
-- Data awal untuk akun pemilik (ganti email bila berbeda)
-- ---------------------------------------------------------------------------
do $$
declare
  owner uuid;
begin
  select id into owner from auth.users where email = 'rahulghulam15@gmail.com';
  if owner is null then
    raise notice 'Akun pemilik tidak ditemukan — data awal dilewati.';
    return;
  end if;

  -- Konteks awal (K-15)
  if not exists (select 1 from public.contexts where user_id = owner) then
    insert into public.contexts (user_id, name, color, position) values
      (owner, 'Kuliah', '#1e7dff', 0),
      (owner, 'BEM',    '#0a3b7a', 1),
      (owner, 'Asprak', '#5caeff', 2),
      (owner, 'GMRT',   '#fb923c', 3),
      (owner, 'KKN',    '#4ade80', 4);
  end if;

  -- Project dari Portfolio Fase 1 (content/profile.ts)
  insert into public.projects
    (user_id, slug, title, summary, highlights, result, category, status, cover_style, is_public, featured, start_date, end_date)
  values
    (owner, 'gromics',
     '{"en": "GROMICS — IoT Health Monitoring", "id": "GROMICS — Pemantauan Kesehatan Berbasis IoT"}',
     '{"en": "All-in-one real-time health monitoring system using non-invasive sensors for early detection of non-communicable diseases. PKM proposal, university-level finalist (2025).", "id": "Sistem pemantauan kesehatan real-time all-in-one dengan sensor noninvasif untuk deteksi dini penyakit tidak menular. Proposal PKM, finalis tingkat universitas (2025)."}',
     '{"en": ["Proposed an all-in-one IoT device that monitors health in real time using non-invasive sensors.", "Aimed at early detection of non-communicable diseases without needles or lab visits.", "Passed the university''s internal funding selection and advanced to the national PKM selection by Belmawa Kemendikbudristek."], "id": ["Mengusulkan perangkat IoT all-in-one yang memantau kesehatan secara real-time dengan sensor noninvasif.", "Ditujukan untuk deteksi dini penyakit tidak menular tanpa jarum atau kunjungan ke laboratorium.", "Lolos seleksi internal pendanaan universitas dan melaju ke seleksi nasional PKM oleh Belmawa Kemendikbudristek."]}',
     '{"en": "PKM university-level finalist", "id": "Finalis PKM tingkat universitas"}',
     'IoT', 'done', 'pulse', true, true, '2025-03-01', '2025-06-30'),
    (owner, 'school-profile-video',
     '{"en": "SMAN 2 Jember Profile Video", "id": "Video Profil SMAN 2 Jember"}',
     '{"en": "Led production of the school profile video that won 1st place — concept, narrative, team, and schedule.", "id": "Memimpin produksi video profil sekolah yang meraih Juara 1 — konsep, alur cerita, tim, dan jadwal produksi."}',
     '{"en": ["Production lead for the winning video.", "Developed the core concept, narrative flow, and central theme.", "Formed the production team and managed the schedule from shooting to editing deadlines."], "id": ["Pimpinan produksi video pemenang.", "Mengembangkan konsep inti, alur naratif, dan tema sentral.", "Membentuk tim produksi dan mengelola jadwal dari syuting hingga tenggat penyuntingan."]}',
     '{"en": "1st place, school profile video competition", "id": "Juara 1 kompetisi video profil sekolah"}',
     'Creative', 'done', 'video', true, true, '2022-03-01', '2022-03-31'),
    (owner, 'life-os',
     '{"en": "Life OS — this website", "id": "Life OS — situs ini"}',
     '{"en": "My public portfolio plus a private dashboard for journal, tasks, projects and money. Next.js 16 + Supabase.", "id": "Portfolio publik sekaligus dashboard pribadi untuk jurnal, task, project, dan keuangan. Next.js 16 + Supabase."}',
     '{"en": ["Bilingual public site (English and Indonesian) with a dark-to-light visual story.", "Private Life OS: daily dashboard, block-based journal, Kanban tasks, IDR/USD money and an investment journal.", "Designed in FigCraft with a shared token system for light and dark mode."], "id": ["Situs publik dua bahasa (Inggris dan Indonesia) dengan alur visual gelap ke terang.", "Life OS pribadi: dashboard harian, jurnal berbasis blok, task Kanban, keuangan IDR/USD, dan jurnal investasi.", "Didesain di FigCraft dengan sistem token bersama untuk mode terang dan gelap."]}',
     null,
     'Web', 'active', 'dashboard', true, true, '2026-11-01', null)
  on conflict (user_id, slug) do nothing;
end;
$$;

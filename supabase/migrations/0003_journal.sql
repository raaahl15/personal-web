-- ============================================================================
-- Fase 4 — Journal (MASTER.md Bagian 2 & 4)
-- Jalankan di Supabase → SQL Editor → New query → Run (setelah 0001).
-- Aman dijalankan ulang.
-- ============================================================================

create table if not exists public.journal_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  entry_date    date not null,
  title         text not null default '' check (char_length(title) <= 200),
  content       jsonb not null default '[]'::jsonb,          -- blok BlockNote
  content_text  text not null default '',                    -- teks polos untuk pencarian & cuplikan
  mood          smallint check (mood between 1 and 5),
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, entry_date)                               -- satu entri per hari
);
create index if not exists journal_user_date_idx on public.journal_entries (user_id, entry_date desc);
create index if not exists journal_tags_idx on public.journal_entries using gin (tags);

drop trigger if exists journal_entries_updated_at on public.journal_entries;
create trigger journal_entries_updated_at before update on public.journal_entries
  for each row execute function public.set_updated_at();

alter table public.journal_entries enable row level security;

drop policy if exists "journal_entries: owner" on public.journal_entries;
create policy "journal_entries: owner" on public.journal_entries
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Run in Supabase SQL editor (once).
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  inputs jsonb not null,
  outputs jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists plans_slug_idx on public.plans (slug);

alter table public.plans enable row level security;

-- Service role bypasses RLS. If you ever use the anon key from the client, add policies here.

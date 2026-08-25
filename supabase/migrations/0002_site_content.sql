-- Contenu éditable du site (admin) — une seule ligne "main"
create table if not exists public.site_content (
  id          text primary key default 'main',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Lecture publique (le site affiche le contenu)
drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

-- Écriture uniquement via service_role (API Vercel admin)
-- Pas de policy INSERT/UPDATE pour anon.

insert into public.site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

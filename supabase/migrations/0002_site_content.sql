-- Contenu éditable du site (admin dashboard)
create table if not exists public.site_content (
  id          text primary key default 'main',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;
-- Accès uniquement via service_role (API Vercel) — pas de policy publique.

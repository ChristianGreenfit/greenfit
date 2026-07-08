-- ============================================================
-- GreenFit — Système d'abonnement (port du plugin WordPress)
-- Tables équivalentes à wp_abonnement_users / wp_abonnement_orders
-- ============================================================

create table if not exists public.abonnement_users (
  id          bigint generated always as identity primary key,
  email       text not null,
  info        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists abonnement_users_email_idx
  on public.abonnement_users (email);

-- Statuts (repris du CheckoutController) :
--   0 = créé (avant paiement)
--   1 = STATUS_PREPARE       (page de paiement Saferpay initialisée)
--   2 = STATUS_CONFIRM       (paiement encaissé)
--   3 = STATUS_CONTRACT_CREATED (contrat créé via SOAP)
create table if not exists public.abonnement_orders (
  id              bigint generated always as identity primary key,
  user_id         bigint not null references public.abonnement_users (id),
  info            jsonb not null default '{}'::jsonb,
  amount          numeric(10, 2) not null default 0,
  status          smallint not null default 0,
  saferpay_token  text,
  transaction_id  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists abonnement_orders_user_idx
  on public.abonnement_orders (user_id);

create index if not exists abonnement_orders_status_idx
  on public.abonnement_orders (status);

-- Ces tables ne sont manipulées QUE par les Edge Functions
-- (via la service_role key qui bypass la RLS). On active la RLS
-- sans policy publique : aucun accès direct depuis le navigateur.
alter table public.abonnement_users  enable row level security;
alter table public.abonnement_orders enable row level security;

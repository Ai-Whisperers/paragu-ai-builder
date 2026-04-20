-- Subscription-based retention tables for meal-prep + delivery tenants
-- (De Abasto a Casa is the first consumer). Customer portal lands on top of
-- these. Current endpoints:
--   POST   /api/subscriptions/pause
--   POST   /api/subscriptions/skip
--   PATCH  /api/subscriptions/preferences

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null,
  customer_email text not null,
  customer_name text,
  plan_key text not null,
  cadence text not null default 'weekly' check (cadence in ('weekly', 'biweekly', 'monthly')),
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled', 'pending')),
  started_at timestamptz not null default now(),
  paused_from timestamptz,
  paused_until timestamptz,
  next_delivery_at timestamptz,
  preferences jsonb not null default '{}'::jsonb,
  source text,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscriptions_site_email_unique_ci
  on public.subscriptions (site_slug, lower(customer_email));
create index if not exists subscriptions_site_status_idx
  on public.subscriptions (site_slug, status);
create index if not exists subscriptions_next_delivery_idx
  on public.subscriptions (next_delivery_at) where status = 'active';

alter table public.subscriptions enable row level security;

create policy if not exists "service role full access subscriptions"
  on public.subscriptions for all
  to service_role
  using (true)
  with check (true);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();


-- Append-only event log for every state transition.
create table if not exists public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  kind text not null check (kind in ('created', 'pause', 'resume', 'skip', 'preferences_updated', 'cancel', 'payment_failed', 'delivery_completed')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists subscription_events_sub_idx
  on public.subscription_events (subscription_id, created_at desc);
create index if not exists subscription_events_kind_idx
  on public.subscription_events (kind, created_at desc);

alter table public.subscription_events enable row level security;

create policy if not exists "service role full access subscription_events"
  on public.subscription_events for all
  to service_role
  using (true)
  with check (true);

comment on table public.subscriptions is
  'Customer subscriptions for recurring delivery/service tenants. Scoped by site_slug; customer_email is the auth key until the portal ships session auth.';
comment on table public.subscription_events is
  'Append-only audit log of subscription state changes. Every endpoint that mutates a subscription also inserts an event row.';

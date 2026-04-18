-- Leads table scoped per tenant site
-- Each row represents one inbound lead from a contact/consultation form.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null,
  locale text not null,
  name text not null,
  email text not null,
  phone text,
  country text,
  program_interest text,
  objective text,
  source text,
  referer text,
  utm jsonb not null default '{}'::jsonb,
  crm_synced_at timestamptz,
  email_subscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_site_created_idx on public.leads (site_slug, created_at desc);
create index if not exists leads_email_idx on public.leads (email);

-- Enforce case-insensitive unique (site_slug, email) at DB level to prevent duplicate spam.
create unique index if not exists leads_site_email_unique_ci
  on public.leads (site_slug, lower(email));

alter table public.leads enable row level security;

-- Service role inserts only. Public role has no access.
create policy if not exists "service role inserts leads"
  on public.leads for insert
  to service_role
  with check (true);

create policy if not exists "service role reads leads"
  on public.leads for select
  to service_role
  using (true);

-- Auto-update updated_at on any row change.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

comment on table public.leads is 'Inbound leads from tenant site contact forms. Forwarded to CRM/email adapters at capture time.';

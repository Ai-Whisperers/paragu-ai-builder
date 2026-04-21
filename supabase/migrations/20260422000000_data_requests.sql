-- Data requests: GDPR / Paraguay Ley 1.682 subject-access / deletion / portability.
-- Each row has a 30-day SLA timer (`due_at`). Service role only — no public reads.

create table if not exists public.data_requests (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null,
  email text not null,
  kind text not null check (kind in ('access', 'rectification', 'deletion', 'portability', 'objection')),
  description text,
  identity_proof text,
  status text not null default 'received' check (status in ('received', 'verifying', 'in_progress', 'fulfilled', 'rejected')),
  due_at timestamptz not null,
  fulfilled_at timestamptz,
  handler_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists data_requests_site_due_idx
  on public.data_requests (site_slug, due_at);
create index if not exists data_requests_status_idx
  on public.data_requests (status);
create index if not exists data_requests_email_idx
  on public.data_requests (email);

alter table public.data_requests enable row level security;

create policy if not exists "service role inserts data_requests"
  on public.data_requests for insert
  to service_role
  with check (true);

create policy if not exists "service role reads data_requests"
  on public.data_requests for select
  to service_role
  using (true);

create policy if not exists "service role updates data_requests"
  on public.data_requests for update
  to service_role
  using (true)
  with check (true);

drop trigger if exists data_requests_set_updated_at on public.data_requests;
create trigger data_requests_set_updated_at
  before update on public.data_requests
  for each row execute function public.set_updated_at();

comment on table public.data_requests is
  'GDPR / Paraguay Ley 1.682 data-subject requests. 30-day SLA timer tracked in due_at; status progresses received → verifying → in_progress → fulfilled|rejected.';

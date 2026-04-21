-- tenant_notes: free-form per-tenant log for admin observations during the
-- premium grace period and beyond. Used by /admin/tenants/[slug].
--
-- RLS: service-role-only (matching analytics_events pattern). Admin pages
-- access via the server-side createClient() that uses the service-role key.
--
-- Note: an earlier draft tried to gate via public.profiles.role = 'admin',
-- but that table does not exist in this project. Existing /admin/leads page
-- references it too — it currently fails the admin check at runtime. Pending
-- a separate decision on whether to introduce a profiles table or keep
-- service-role-only enforcement at the route level.

create table if not exists public.tenant_notes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  body text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists tenant_notes_business_id_created_at_idx
  on public.tenant_notes (business_id, created_at desc);

alter table public.tenant_notes enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='tenant_notes' and policyname='service_role full access') then
    create policy "service_role full access" on public.tenant_notes
      for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='tenant_notes' and policyname='anon no access') then
    create policy "anon no access" on public.tenant_notes
      for all to anon using (false) with check (false);
  end if;
end $$;

comment on table public.tenant_notes is
  'Free-form admin notes per tenant. Used during the premium grace period to log observations and decisions.';

-- /admin/inbox — audit trail for status + assignment changes on public.leads.
--
-- Answers "who changed this lead from X → Y, and when?" Without this we have
-- updated_at + current values but no history. Once a lead moves through the
-- pipeline there's no way to review the decisions.
--
-- actor is an email string (matches admin auth model — env allowlist, no
-- users table). field + old_value + new_value keep shape simple — one row
-- per field change, JSON-free.

create table if not exists public.lead_audit_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor text,
  field text not null,
  old_value text,
  new_value text,
  created_at timestamptz not null default now()
);

create index if not exists lead_audit_log_lead_id_created_idx
  on public.lead_audit_log (lead_id, created_at desc);

alter table public.lead_audit_log enable row level security;

-- service-role-only pattern matches public.leads
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='lead_audit_log' and policyname='service_role full access'
  ) then
    create policy "service_role full access" on public.lead_audit_log
      for all to service_role using (true) with check (true);
  end if;
end $$;

comment on table public.lead_audit_log is
  'Append-only audit trail for lead pipeline changes — status, assignment, close_reason.';

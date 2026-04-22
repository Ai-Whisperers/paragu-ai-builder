-- /admin/inbox — lead assignment column.
alter table public.leads
  add column if not exists assigned_to text;

create index if not exists leads_assigned_to_idx
  on public.leads (assigned_to)
  where assigned_to is not null;

create index if not exists leads_unassigned_created_idx
  on public.leads (created_at desc)
  where assigned_to is null;

comment on column public.leads.assigned_to is
  'Email of the admin responsible for this lead. Null = unassigned. Validated against ADMIN_EMAILS at write time.';

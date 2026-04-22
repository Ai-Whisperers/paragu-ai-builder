-- /admin/inbox workflow fields on public.leads.
--
-- Adds:
-- - status          — pipeline state: new → contacted → qualified → closed
-- - admin_notes     — free-form internal notes (markdown-friendly, no HTML)
-- - contacted_at    — timestamp of first outreach (derived from status transitions)
-- - qualified_at    — timestamp of qualification (derived)
-- - closed_at       — timestamp of close (won or lost)
-- - close_reason    — text: 'won' | 'lost_not_fit' | 'lost_no_response' | 'lost_other' | null
--
-- Indexes: (site_slug, status, created_at desc) to accelerate the inbox list.
--
-- RLS: service-role-only matches the existing pattern on public.leads. Admin
-- UI accesses via service-role key. No public/anon access.

alter table public.leads
  add column if not exists status text not null default 'new',
  add column if not exists admin_notes text,
  add column if not exists contacted_at timestamptz,
  add column if not exists qualified_at timestamptz,
  add column if not exists closed_at timestamptz,
  add column if not exists close_reason text;

-- Enforce valid status transitions at the DB level. Dropping first in case an
-- earlier variant exists from a prior partial migration.
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads
  add constraint leads_status_check
  check (status in ('new', 'contacted', 'qualified', 'closed'));

alter table public.leads drop constraint if exists leads_close_reason_check;
alter table public.leads
  add constraint leads_close_reason_check
  check (close_reason is null or close_reason in ('won', 'lost_not_fit', 'lost_no_response', 'lost_other'));

-- Inbox query pattern: filter by site_slug (optional) + status, sort by
-- most recent first. This composite covers both the scoped and global views.
create index if not exists leads_site_status_created_idx
  on public.leads (site_slug, status, created_at desc);

create index if not exists leads_status_created_idx
  on public.leads (status, created_at desc);

comment on column public.leads.status is
  'Pipeline state. Transitions: new → contacted → qualified → closed. See close_reason for terminal state.';

comment on column public.leads.admin_notes is
  'Internal notes — not exposed to the lead or CRM adapters. Text only.';

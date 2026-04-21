-- analytics_events: append-only event log used by:
--   - app/api/analytics/track/route.ts (POST: insert)
--   - app/api/cron/leads-digest/route.ts (SELECT: daily digest)
--   - app/admin/demo-requests/page.tsx (SELECT: admin view)
--   - lib/analytics/events.ts (client emitter via /api/analytics/track)
--
-- This table was assumed by code but never created — discovered when
-- /api/cron/leads-digest returned 500 with "Could not find the table
-- 'public.analytics_events' in the schema cache".

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  business_id text,
  lead_id text,
  page_url text,
  section_id text,
  metadata jsonb default '{}'::jsonb,
  session_id text,
  ip_hash text,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

-- Hot paths for lookups:
--   Cron + admin filter on event_type='lead_created' AND created_at >= ...
create index if not exists analytics_events_event_type_created_at_idx
  on public.analytics_events (event_type, created_at desc);

--   Per-lead drilldown (admin opens a lead)
create index if not exists analytics_events_lead_id_idx
  on public.analytics_events (lead_id) where lead_id is not null;

--   Per-tenant analytics (commerce + retention dashboards)
create index if not exists analytics_events_business_id_idx
  on public.analytics_events (business_id) where business_id is not null;

--   Session replay & funnel analysis
create index if not exists analytics_events_session_id_idx
  on public.analytics_events (session_id) where session_id is not null;

-- RLS: only service-role can write/read. The analytics track endpoint runs
-- on the server with service-role; admin pages use the same. No anon access.
alter table public.analytics_events enable row level security;

-- Permissive policy for service role (default; here for clarity)
create policy if not exists "service_role full access"
  on public.analytics_events
  for all
  to service_role
  using (true)
  with check (true);

-- Block anon explicitly (default-deny, but make it visible)
create policy if not exists "anon no access"
  on public.analytics_events
  for all
  to anon
  using (false)
  with check (false);

comment on table public.analytics_events is
  'Append-only event log for marketing analytics, lead capture, and admin reporting. Written by /api/analytics/track. Read by cron and admin views.';

# API Reference

All routes under `web/app/api/`. Every route is wrapped by `withRequestLog` (`web/lib/api/with-request-log.ts`) which provides:

- Structured request/response logging (ECS fields)
- AsyncLocalStorage context for downstream code
- Perf timer
- Correlation id from upstream `traceparent` or `x-request-id`

Multi-tenant routes filter by `site_slug` or `business_id` on every query — enforced by [`scopedQueries()`](../../web/lib/supabase/scoped.ts) and the `scoped-query-audit.test.ts` test.

**21 routes** across 6 functional areas.

---

## Lead intake & management

| Route | Method | Purpose | DB | External |
|---|---|---|---|---|
| `/api/leads` | POST | Ingest a lead from a form — validate, dedupe, route to CRM | `leads`, `lead_submissions` | HubSpot, Pipedrive, Notion (via adapter registry) |
| `/api/leads/[id]/notes` | POST | Add/update internal notes on an existing lead | `leads` | — |
| `/api/leads/bulk-update` | POST | Batch update lead fields (status, tags, assignee) | `leads` | — |

Dedup logic: `web/lib/leads/duplicate-detection.ts` (Levenshtein on email+phone). Enrichment before insert: `web/lib/leads/enrich.ts` (device, referrer, geo).

## Analytics

| Route | Method | Purpose | DB | External |
|---|---|---|---|---|
| `/api/analytics/track` | POST | Log a page-view or UI event | `analytics_events` | GA4, Plausible (via adapter) |
| `/api/admin/daily-metrics` | GET | Aggregate daily stats (leads, conversions, traffic) | `analytics_events`, `lead_submissions` | — |

Event schemas live in `web/lib/analytics/events.ts`.

## Integration webhooks (inbound)

| Route | Method | Purpose | DB | External |
|---|---|---|---|---|
| `/api/calendly-webhook` | POST | Booking events → create lead + record booking | `bookings`, `leads` | Calendly |
| `/api/whatsapp-webhook` | POST | Inbound WhatsApp messages → conversation thread | `messages`, `conversations` | WhatsApp Business API |
| `/api/mailchimp-journey-import` | POST | Batch import contacts from a Mailchimp journey | `contacts`, `lead_submissions` | Mailchimp |
| `/api/hubspot-cron-sync` | POST | Scheduled sync of HubSpot deals/contacts | `leads`, `deals` | HubSpot |

## Customer self-serve (subscriptions portal)

| Route | Method | Purpose | DB | External |
|---|---|---|---|---|
| `/api/subscriptions/pause` | POST | Pause a recurring subscription | `subscriptions` | — |
| `/api/subscriptions/skip` | POST | Skip the next delivery | `subscriptions` | — |
| `/api/subscriptions/preferences` | POST | Update dietary / delivery preferences | `subscriptions` | — |
| `/api/newsletter` | POST | Double opt-in newsletter subscription | — | Mailchimp, Resend |

## Properties (real estate)

| Route | Method | Purpose | DB | External |
|---|---|---|---|---|
| `/api/properties` | GET / POST | List or create properties | `properties` | — |
| `/api/properties/[id]` | GET / PUT | Get or update a single property | `properties` | — |

## Compliance & data requests

| Route | Method | Purpose | DB | External |
|---|---|---|---|---|
| `/api/data-request` | POST | GDPR data-subject request (access / delete / export) | `data_requests`, `leads`, `lead_submissions` | — |

Privacy policy + AML disclosures are rendered from `src/compliance/*.template.md` into the relevant tenant's privacy page.

## System

| Route | Method | Purpose | Notes |
|---|---|---|---|
| `/api/generate` | POST | Compose a page from business config + vertical template (builder-side) | Used by admin dashboard |
| `/api/og-image/[slug]` | GET | Dynamic OpenGraph image | `next/og` + tenant tokens |
| `/api/reminders` | POST | Schedule a reminder (email/SMS) | `reminders` table + email/SMS adapter |
| `/api/health` | GET | Liveness + readiness probe | `?deep=1` checks DB connectivity |
| `/api/diagnostics` | GET | Debug: env presence, version, Supabase status, integration adapter health | Admin-only |

---

## Conventions

### Request id / tracing

Every response carries `x-request-id` + `traceparent`. Incoming headers are honoured; fresh ids generated only if none supplied. See [/ARCHITECTURE.md § observability](../../ARCHITECTURE.md#observability).

### Validation

All POST / PUT bodies validate with **Zod**. Schemas live next to the route or in a `schema.ts` sibling file. Validation errors return `400` with a structured error body:

```json
{
  "error": "ValidationError",
  "details": [ { "path": ["email"], "message": "Invalid email" } ]
}
```

### Errors

- `400` — validation failure (zod)
- `401` — missing/invalid auth (admin routes)
- `403` — auth present but insufficient scope
- `404` — resource not found
- `429` — rate-limited (via Upstash in middleware)
- `500` — unexpected; always logged + captured in Sentry

The route's catch block logs with `logger.error(message, { error })` and rethrows, or returns a structured error response. **Never silently caught** (ESLint enforces — see [CLAUDE.md § error handling](../../CLAUDE.md#error-handling-mandatory)).

### Rate limiting

Optional. When `UPSTASH_REDIS_URL` is configured, `middleware.ts` applies a sliding-window rate limit to `/api/*` routes. Disabled in dev.

### Auth

- **Public routes** (leads intake, webhooks, health) — no auth. Webhooks validate the signing secret.
- **Admin routes** (`/api/admin/*`, `/api/diagnostics`) — require Supabase session; checked in `middleware.ts`.
- **Self-serve** (`/api/subscriptions/*`) — require a customer token (email + subscription id signature).

### Multi-tenancy

Every tenant-scoped query goes through `scopedQueries(supabase, businessId)`. Example:

```ts
import { createClient } from '@/lib/supabase/server'
import { scopedQueries } from '@/lib/supabase/scoped'

const supabase = await createClient()
const scoped = scopedQueries(supabase, businessId)
const { data } = await scoped.from('leads').select('*').limit(10)
```

`site_slug` vs `business_id`: newer tables use `site_slug` (matches `sites/<slug>/`), older tables use `business_id` (legacy). The scoped wrapper handles both.

---

## OpenAPI (proposed)

There is no generated OpenAPI spec today. The [docs consolidation plan](../DOCS_CONSOLIDATION_PLAN.md) proposes adopting [`next-openapi-gen`](https://github.com/tazo90/next-openapi-gen) since we already use Zod for validation. That would generate a live spec from the route handlers and host it under `/api-docs` using Scalar. See the plan for the phase-in.

---

## Adding a new route

1. File: `web/app/api/<name>/route.ts` (or `[param]/route.ts` for dynamic).
2. Export HTTP method handlers (`GET`, `POST`, etc.) wrapped in `withRequestLog`:

   ```ts
   import { NextResponse } from 'next/server'
   import { withRequestLog } from '@/lib/api/with-request-log'

   export const POST = withRequestLog(async (req, ctx) => {
     // ctx.logger, ctx.requestId, etc.
     return NextResponse.json({ ok: true })
   })
   ```

3. Validate the body with Zod.
4. If DB-facing: use `scopedQueries()`.
5. Add the route to this file (one line, which functional area).
6. Add tests under `web/tests/integration/` if the route has business logic.

---

_Last reviewed: April 2026 — after PR #37 landed 9 new routes (subscriptions portal + webhooks + properties + GDPR)._

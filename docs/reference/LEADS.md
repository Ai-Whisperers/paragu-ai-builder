# Leads Reference

> Lead management: import, enrichment, outreach, conversion tracking.

## Architecture

```
Import (Google Maps / Manual) → Enrich → Contact → Convert → Onboard
         │                          │          │           │
    leads table                enrichment    outreach   subscriptions
```

## Tables

`leads` - Primary lead table:
- `id`, `business_id`, `name`, `phone`, `email`, `whatsapp`
- `type` - Business category
- `address`, `neighborhood`, `city`
- `source` - Import source (google_maps, manual, referral)
- `status` - new/contacted/interested/onboarded/closed
- `data_json` - Flexible profile data
- `last_contacted_at`, `notes`

## Key Modules

| File | Purpose |
|------|---------|
| `web/lib/leads/duplicate-detection.ts` | Dedup logic for imported leads |
| `web/lib/leads/enrich.ts` | Lead data enrichment |
| `web/app/api/cron/leads-digest/route.ts` | Daily summary email |
| `web/app/admin/leads/` | Admin panel UI (5 components) |

## Lead Status Flow

```
new → contacted → interested → onboarding → onboarded
  ↓        ↓           ↓
closed  unqualified  dormant
```

## Admin UI Components (in `web/components/admin/leads/`)

| Component | Purpose |
|-----------|---------|
| `lead-constants.tsx` | Status colors, labels, categories |
| `leads-filters.tsx` | Filter by status, city, type, source |
| `leads-bulk-actions.tsx` | Batch status update, export |
| `lead-table-row.tsx` | Individual lead row with actions |
| `lead-detail-panel.tsx` | Full lead profile detail view |

## API Endpoints

- `GET /api/admin/leads` - List with filters
- `POST /api/admin/leads` - Create lead
- `PUT /api/admin/leads/:id` - Update lead
- `POST /api/admin/leads/:id/contact` - Log outreach event
- `GET /api/cron/leads-digest` - Daily digest (cron)

---

_Last updated: April 24, 2026_

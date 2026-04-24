# Analytics Reference

> Event tracking, metrics, and analytics pipeline for tenant sites and admin.

## Architecture

```
User action → Analytics event → Supabase → Admin dashboard
     │
     ├── Google Analytics (gtag)
     ├── Internal event table (analytics_events)
     └── Marketing events
```

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/analytics/events.ts` | Base analytics event types |
| `web/lib/analytics/commerce-events.ts` | Commerce-specific events |
| `web/lib/analytics/marketing-events.ts` | Marketing funnel events |
| `web/lib/analytics/gtag-shared.ts` | Google Analytics gtag setup |

## Event Types

- **Page view**: Section impressions, page navigation
- **Commerce**: Add to cart, checkout, purchase
- **Marketing**: Lead capture, demo view, signup
- **Engagement**: Click, scroll, form submission

## Tables

`analytics_events` - All events stored with:
- `business_id` - Tenant context
- `event_type` - Event category
- `event_data` - JSONB payload
- `session_id` - Visitor session
- `visitor_id` - Anonymous visitor
- `created_at` - Event timestamp

## Admin Dashboard

Analytics are viewable at `/admin/analytics`:
- Event counts over time
- Conversion funnels
- Per-tenant breakdowns
- Top sections by impression

## Google Analytics

Compatible with standard gtag.js via `gtag-shared.ts`.
Send custom events via `gtag('event', ...)` alongside internal tracking.

---

_Last updated: April 24, 2026_

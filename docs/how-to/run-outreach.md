# Outreach Runbook

> Lead outreach workflows: WhatsApp, email, SMS, and follow-up automation.

## Channels

| Channel | Status | Implementation |
|---------|--------|---------------|
| WhatsApp | ✅ Active | `web/lib/outreach/templates.ts` generates `wa.me` links |
| Email | ✅ Active | Resend transactional emails via `email-templates.ts` |
| SMS | 🔄 Planned | Future integration |
| Call | 🔄 Planned | Future integration |

## Outreach Flow

1. Lead imported from Google Maps / manual entry
2. Generate personalized message from template
3. Send via selected channel
4. Log event to `outreach_events` table
5. Schedule follow-up based on response
6. Update lead status (contacted → interested → onboarded)

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/outreach/templates.ts` | Message templates with `{{placeholders}}` |
| `web/lib/outreach/tracking.ts` | Event tracking for outreach (log, open, click) |
| `web/app/api/cron/leads-digest/route.ts` | Daily lead summary email |

## Event Types

- `whatsapp_sent` / `email_sent` - Initial contact
- `demo_viewed` / `demo_shared` - Demo engagement
- `onboarding_started` / `onboarding_completed` - Lead progress
- `payment_initiated` - Signup
- `meeting_scheduled` / `meeting_completed` - Sales calls

## Feature Flags

- `MAILCHIMP_JOURNEY_ENABLED` - Gates Mailchimp Customer Journeys API
  - When `false`: falls back to manual status tracking
  - When `true`: sends leads to Mailchimp automation

## Related

- [LEADS.md](../reference/LEADS.md) - Lead management system
- [ANALYTICS.md](../reference/ANALYTICS.md) - Event tracking pipeline

---

_Last updated: April 24, 2026_

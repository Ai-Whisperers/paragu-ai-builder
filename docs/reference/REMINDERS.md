# Reminders Reference

> Automated reminder system for lead follow-ups and scheduled tasks.

## Architecture

```
Cron job → Scheduler → Event → Notification (email/WhatsApp)
```

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/reminders/scheduler.ts` | Reminder scheduling logic |
| `web/app/api/cron/leads-digest/route.ts` | Daily digest cron |

## How It Works

1. Reminders are triggered via Supabase cron jobs
2. Scheduler checks `reminders` table for due items
3. Sends notification via configured channel
4. Logs delivery to `outreach_events` table
5. Updates reminder status (sent/completed)

## Reminder Types

- **Follow-up**: Schedule re-contact for unresponsive leads
- **Digest**: Daily summary of new leads and activity
- **Expiry**: Subscription trial ending, payment due
- **Custom**: Ad-hoc reminders with custom messages

## Data Model

Reminders are stored in `outreach_events` with `event_type` and `scheduled_at` fields.
Future: dedicated `reminders` table with recurrence support.

---

_Last updated: April 24, 2026_

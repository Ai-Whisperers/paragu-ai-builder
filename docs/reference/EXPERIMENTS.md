# Experiments Reference

> A/B testing and content variant system for optimizing tenant sites.

## Architecture

```
Site → Section → Experiment → Variant → Impression → Conversion
```

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/experiments/ab-test.ts` | A/B test assignment and tracking |
| `web/lib/experiments/hero-variant.ts` | Hero section variant testing |

## How It Works

1. Experiments are defined per tenant in `site.json` or DB config
2. Visitor is bucketed by ID (cookies or fingerprint)
3. Variant rendered based on bucket assignment
4. Events logged to `analytics_events` table
5. Results viewable in admin dashboard

## Variant Types

- **Hero**: Different hero image, headline, or CTA text
- **Layout**: Section order, spacing, or style tweaks
- **Content**: Different copy variants (e.g., tone, offer)

## Data Model

```sql
CREATE TABLE experiment_assignments (
  id UUID PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  experiment_key TEXT NOT NULL,
  variant TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Implemented via `use-section-impression` hook and analytics event pipeline.

---

_Last updated: April 24, 2026_

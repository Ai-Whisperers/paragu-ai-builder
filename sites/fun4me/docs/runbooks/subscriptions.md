# Runbook — Subscription boxes billing

Fun4Me's "Caja Sorpresa" monthly subscription requires recurring billing infrastructure.

## Supabase DDL

```sql
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL, -- 'discovery', 'premium', 'vip'
  sku text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'paused', 'cancelled', 'past_due'
  
  billing_cycle text NOT NULL DEFAULT 'monthly', -- 'monthly', 'quarterly', 'yearly'
  next_billing_date date NOT NULL,
  last_billing_date date,
  
  shipping_address jsonb NOT NULL,
  personalization jsonb, -- tier-specific preferences
  
  price_cents int NOT NULL, -- in PYG cents (÷100 for display)
  
  started_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  cancellation_reason text,
  
  pause_start_date date,
  pause_end_date date,
  
  pagopar_subscription_id text, -- reference to Pagopar recurring
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  billing_period date NOT NULL, -- e.g. 2026-06-01 for June box
  shipped_at timestamptz,
  order_id uuid REFERENCES orders(id),
  contents jsonb, -- snapshot of what was in this box
  tracking_number text,
  delivered_at timestamptz,
  customer_feedback jsonb,
  UNIQUE(subscription_id, billing_period)
);

CREATE INDEX idx_sub_user ON subscriptions(user_id);
CREATE INDEX idx_sub_next_billing ON subscriptions(next_billing_date) WHERE status = 'active';
CREATE INDEX idx_sub_status ON subscriptions(business_id, status);

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own subs" ON subscriptions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users see own shipments" ON subscription_shipments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM subscriptions s WHERE s.id = subscription_id AND s.user_id = auth.uid())
  );
```

## Billing flow options

### Option A: Pagopar recurring (if supported)

Pagopar has limited recurring support. Confirm at onboarding:
- Does Pagopar offer subscription API?
- What's the retry policy on failed payments?
- Can we update card on file?

If yes → use native. Simpler.

### Option B: Custom billing job (Pagopar card tokens)

If Pagopar doesn't support true subscriptions:

1. At initial signup, charge via Pagopar. Save tokenized card reference.
2. Daily cron job:
   - Find subscriptions where `next_billing_date = today`.
   - Attempt charge via Pagopar with saved token.
   - On success: create shipment record, advance `next_billing_date` by cycle.
   - On failure: mark `past_due`, email customer, retry in 48h.
3. After 3 failed retries: cancel subscription, notify.

### Option C: Stripe (international)

Stripe has mature subscriptions but:
- Requires clients to have international card (Visa/MC).
- Statement descriptor internacional.
- Currency conversion issues.
- Not ideal for PYG-native tenants.

**Recommendation:** Option B (custom job with Pagopar token).

## Box curation workflow

Each tier has different complexity:

### Discovery (minimal personalization)
- Same box for all subscribers that month
- Owner pre-selects box contents by 15th of previous month
- Stored in `subscription_shipments.contents` as snapshot

### Premium (medium personalization)
- Rules engine: respect category exclusions from `personalization`
- Variations allowed (e.g., if customer said "no BDSM", substitute with lingerie)
- Owner approves final composition 15th of previous month

### VIP (high personalization)
- 30-min consultation via WhatsApp 10 days before box ship date
- Custom selection per customer
- Owner logs preferences in CRM
- Box assembled individually

## Shipping

All boxes ship on 10th of month. Cutoff for new sign-ups that count for current month: 25th of previous month.

## Cancellation / pause flow

Client-side:
- `/fun4me/account/subscriptions` page
- Shows current sub, next box date, pause/cancel buttons
- Cancel: confirmation modal ("perderás acceso a precios exclusivos"), grace period 48h
- Pause: up to 3 months, auto-resume

Server-side:
- Cancel immediately stops future billing, current month still ships.
- Pause updates `pause_start_date` and `pause_end_date`, skips billing during pause.

## Churn reduction tactics

- "Skip this month" option (less drastic than cancel)
- Pre-cancellation offer: 25% off next 3 months
- Feedback survey on cancellation (required, 1 question)
- Win-back email 90 days post-cancel

## Pricing

Content already in `content/subscriptions.json`:
- Discovery: Gs. 149k/mo, 420k/quarter, 1.59M/year
- Premium: Gs. 299k/mo, 849k/quarter, 3.19M/year
- VIP: Gs. 599k/mo, 1.7M/quarter, 6.49M/year (cap 20 slots)

Annual pre-pay saves customer ~10%, improves our cash flow.

## Engineering estimate

Custom billing (Option B): 4-5 days engineering:
- 1 day: schema + RLS + API routes
- 2 days: daily billing cron + error handling
- 1 day: client-side account pages
- 1 day: email + WhatsApp notifications

## Priority

Phase 3 (Month 3). Highly dependent on Pagopar subscription capability decision.

## Risk: churn

Subscription boxes have industry-average churn 10-15% per month. Plan for this:
- Unit economics: average subscriber lifetime 8-10 months.
- ROI on acquisition cost: acquire customer at Gs. 50k, break-even in 1-2 months.

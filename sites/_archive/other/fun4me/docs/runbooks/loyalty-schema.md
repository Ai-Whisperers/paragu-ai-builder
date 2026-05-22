# Runbook — Loyalty points schema

Platform-level tables for Fun4Me's "Placer Plus" loyalty program (and future tenants with loyalty).

## Supabase DDL

```sql
-- Points ledger (source of truth)
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points int NOT NULL, -- can be negative (redemption)
  balance_after int NOT NULL, -- snapshot after this tx
  reason text NOT NULL, -- 'purchase', 'signup', 'first_purchase', 'referral_signup', 'review_approved', 'birthday', 'redemption', 'expiration', 'adjustment'
  reference_type text, -- 'order', 'review', 'referral', etc.
  reference_id uuid, -- FK depending on reference_type
  expires_at timestamptz, -- null for non-expiring entries
  created_at timestamptz DEFAULT now(),
  CONSTRAINT points_non_zero CHECK (points != 0)
);

CREATE INDEX idx_loyalty_business_user ON loyalty_points(business_id, user_id);
CREATE INDEX idx_loyalty_expires ON loyalty_points(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_loyalty_created ON loyalty_points(created_at DESC);

-- User tier snapshot (materialized for performance)
CREATE TABLE IF NOT EXISTS public.loyalty_user_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_tier text NOT NULL DEFAULT 'plata', -- 'plata', 'oro', 'platino'
  tier_started_at timestamptz NOT NULL DEFAULT now(),
  tier_reviewed_at timestamptz, -- next review date
  available_points int NOT NULL DEFAULT 0,
  lifetime_points_earned int NOT NULL DEFAULT 0,
  lifetime_points_redeemed int NOT NULL DEFAULT 0,
  annual_spend int NOT NULL DEFAULT 0, -- for tier calculation, rolling 12mo
  last_activity_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

CREATE INDEX idx_loyalty_state_tier ON loyalty_user_state(business_id, current_tier);
CREATE INDEX idx_loyalty_state_review ON loyalty_user_state(tier_reviewed_at);

-- Redemption tokens (generated codes)
CREATE TABLE IF NOT EXISTS public.loyalty_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  points_used int NOT NULL,
  reward_type text NOT NULL, -- 'discount', 'free_product', 'free_shipping'
  reward_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  used_in_order_id uuid REFERENCES orders(id)
);

CREATE INDEX idx_redemption_code ON loyalty_redemptions(code);
CREATE INDEX idx_redemption_user ON loyalty_redemptions(user_id);

-- RLS
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_user_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own points" ON loyalty_points
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users see own state" ON loyalty_user_state
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users see own redemptions" ON loyalty_redemptions
  FOR SELECT USING (user_id = auth.uid());

-- Service role can write (server-side only)
CREATE POLICY "Service role full access points" ON loyalty_points
  FOR ALL USING (auth.role() = 'service_role');
-- (similar for other tables)
```

## Background jobs

### 1. Points expiration (daily, 03:00 AM PY)
```
SELECT * FROM loyalty_points 
WHERE expires_at < now() 
AND NOT EXISTS (
  SELECT 1 FROM loyalty_points p2 
  WHERE p2.reference_type = 'expiration_of' 
  AND p2.reference_id = loyalty_points.id
);
```
For each: insert negative point entry reason='expiration'. Update user_state.available_points.

### 2. Tier review (monthly)
For each user:
- Calculate rolling 12mo spend.
- Compare to tier thresholds.
- Upgrade immediately on reaching threshold.
- Downgrade only at annual review (one-year lock-in protection).

### 3. Birthday job (daily)
Find users with birthday today, award 500 pts, trigger email/WA notification.

## Platform API endpoints

- `GET /api/loyalty` — current state + recent history
- `POST /api/loyalty/redeem` — create redemption code
- `GET /api/loyalty/redemptions` — list active codes
- `POST /api/loyalty/apply-code` — apply to current cart (uses redemption)

## Integration points in commerce

When an order completes:
1. Calculate points based on subtotal (exclude shipping, gift wrap).
2. Apply tier multiplier from user_state.current_tier.
3. Insert loyalty_points row with reason='purchase', reference to order.
4. Update user_state.available_points and lifetime_points_earned.
5. Recalculate annual_spend, check for tier upgrade.

When a review is approved:
1. Insert 50 pt entry with reason='review_approved'.
2. Update state.

When a referral completes first order:
1. Insert 500 pt entry for referrer.
2. State update.

## Fraud prevention

- Cap points per month: 10,000 pts max earning per user (prevents abuse).
- Block redemptions if account < 30 days old and no completed orders.
- Flag anomalies (100x average spend spikes) for manual review.
- Rate limit redemption endpoint: 5 per day per user.

## Client-side display

The `loyalty.json` content file (already created) drives UI strings. Platform needs:
- `/fun4me/account/loyalty` page showing current tier, points, history
- Progress bar to next tier
- Redemption catalog (from loyalty.json.redemptionOptions)
- Invite-a-friend CTA

## Rollout

- Phase 3.3 (Month 3).
- Can launch without loyalty and bolt on later — data is not back-filled (users earn starting from activation date).
- Optional: back-fill points for existing customers on launch as "welcome bonus" to drive engagement.

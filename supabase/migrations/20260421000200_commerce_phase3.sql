-- =============================================================================
-- Commerce Phase 3 — discounts, abandoned cart recovery, analytics, FX
-- =============================================================================

-- Discounts: per-business coupon codes. Redemption tracked separately.
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percent', 'fixed_amount', 'free_shipping')),
  value_cents INTEGER,            -- used when type='fixed_amount'
  value_percent NUMERIC(5,2),     -- used when type='percent', 0-100
  min_subtotal_cents INTEGER DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'PYG',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  max_uses INTEGER,
  max_uses_per_customer INTEGER DEFAULT 1,
  uses_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, code)
);

CREATE INDEX idx_discounts_code ON discounts(business_id, code) WHERE status = 'active';

ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON discounts
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public read active codes" ON discounts
  FOR SELECT TO anon USING (status = 'active' AND (ends_at IS NULL OR ends_at > NOW()));

CREATE TRIGGER discounts_updated_at
  BEFORE UPDATE ON discounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Redemption ledger: prevents double-use per customer.
CREATE TABLE discount_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  discount_id UUID NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (discount_id, order_id)
);

CREATE INDEX idx_redemptions_customer ON discount_redemptions(discount_id, customer_email);

ALTER TABLE discount_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON discount_redemptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Abandoned cart recovery touches. Each row = one email sent.
CREATE TABLE cart_recovery_touches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  step INTEGER NOT NULL CHECK (step IN (1, 2, 3)),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recovery_token TEXT NOT NULL,
  recovered_at TIMESTAMPTZ,
  UNIQUE (cart_id, step)
);

CREATE INDEX idx_recovery_token ON cart_recovery_touches(recovery_token);

ALTER TABLE cart_recovery_touches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON cart_recovery_touches
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Exchange rates for multi-currency display.
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency CHAR(3) NOT NULL,
  to_currency CHAR(3) NOT NULL,
  rate NUMERIC(14,6) NOT NULL,
  as_of DATE NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (from_currency, to_currency, as_of)
);

CREATE INDEX idx_exchange_rates_lookup ON exchange_rates(from_currency, to_currency, as_of DESC);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON exchange_rates
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON exchange_rates FOR SELECT TO anon USING (true);

-- Daily metrics materialized view. Refreshed by cron.
CREATE MATERIALIZED VIEW commerce_daily_metrics AS
SELECT
  business_id,
  DATE_TRUNC('day', created_at) AS day,
  currency,
  COUNT(*) FILTER (WHERE status IN ('paid', 'fulfilled', 'shipped', 'delivered')) AS paid_orders,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed_orders,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_orders,
  COALESCE(SUM(total_cents) FILTER (WHERE status IN ('paid', 'fulfilled', 'shipped', 'delivered')), 0) AS gmv_cents,
  COALESCE(AVG(total_cents) FILTER (WHERE status IN ('paid', 'fulfilled', 'shipped', 'delivered')), 0) AS aov_cents
FROM orders
GROUP BY business_id, DATE_TRUNC('day', created_at), currency;

CREATE UNIQUE INDEX idx_commerce_daily_metrics ON commerce_daily_metrics (business_id, day, currency);

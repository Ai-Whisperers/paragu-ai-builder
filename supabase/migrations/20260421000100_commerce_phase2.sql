-- =============================================================================
-- Commerce Phase 2 — inventory logs, shipping zones, email outbox
-- =============================================================================

-- Inventory audit trail. Append-only: every qty change writes a row.
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('order', 'refund', 'manual_adjust', 'return', 'damage', 'initial')),
  reference_type TEXT,
  reference_id UUID,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id, created_at DESC);
CREATE INDEX idx_inventory_logs_business ON inventory_logs(business_id, created_at DESC);

ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON inventory_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Shipping zones: per-business shipping cost rules. rules_json supports
-- flat ({type:flat, cents}), weight-based, or cart-total-based.
CREATE TABLE shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  countries TEXT[] NOT NULL DEFAULT ARRAY['PY'],
  regions TEXT[],
  rules_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_zones_business ON shipping_zones(business_id, status);

ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON shipping_zones
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated read" ON shipping_zones FOR SELECT TO authenticated USING (true);

CREATE TRIGGER shipping_zones_updated_at
  BEFORE UPDATE ON shipping_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Outbox for transactional emails. Writes are decoupled from HTTP replies
-- so webhook/order flows never block on SMTP/Resend latency.
CREATE TABLE commerce_email_outbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  template TEXT NOT NULL CHECK (template IN (
    'order_confirmation', 'order_paid', 'order_shipped', 'order_refunded', 'low_stock_digest'
  )),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_outbox_pending ON commerce_email_outbox(created_at)
  WHERE status = 'pending';

ALTER TABLE commerce_email_outbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON commerce_email_outbox
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER email_outbox_updated_at
  BEFORE UPDATE ON commerce_email_outbox
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

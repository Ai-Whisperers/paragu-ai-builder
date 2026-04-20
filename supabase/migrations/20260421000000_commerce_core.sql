-- =============================================================================
-- Paragu-AI Builder - Commerce Core (Phase 1 MVP)
-- =============================================================================
-- B2C storefront tables: products, carts, orders, transactions, webhooks.
-- Separate from SaaS `payments`/`subscriptions` which bill merchants for the
-- Paragu-AI platform itself. Money stored as integer cents (currency-agnostic).
-- All tables scoped by business_id; RLS defaults to service_role only.
-- =============================================================================

-- =============================================================================
-- BUSINESS_COUNTERS
-- Generic per-business counter table (used for order numbers, future sequences).
-- =============================================================================
CREATE TABLE business_counters (
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (business_id, name)
);

ALTER TABLE business_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON business_counters
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Atomic increment-and-return.
CREATE OR REPLACE FUNCTION next_counter(p_business_id UUID, p_name TEXT)
RETURNS BIGINT AS $$
DECLARE
  v_next BIGINT;
BEGIN
  INSERT INTO business_counters (business_id, name, value)
    VALUES (p_business_id, p_name, 1)
    ON CONFLICT (business_id, name) DO UPDATE
      SET value = business_counters.value + 1, updated_at = NOW()
    RETURNING value INTO v_next;
  RETURN v_next;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PRODUCTS
-- Catalog items. One row per SKU. Images live in Supabase Storage; the JSONB
-- array holds {url, alt, width, height, isCover} objects.
-- =============================================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  compare_at_price_cents INTEGER CHECK (compare_at_price_cents IS NULL OR compare_at_price_cents >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'PYG',
  sku TEXT,
  inventory_qty INTEGER NOT NULL DEFAULT 0,
  inventory_policy TEXT NOT NULL DEFAULT 'deny' CHECK (inventory_policy IN ('deny', 'continue')),
  low_stock_threshold INTEGER DEFAULT 3,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  weight_grams INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  is_seed BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, slug)
);

CREATE INDEX idx_products_business_status ON products(business_id, status);
CREATE INDEX idx_products_category ON products(business_id, category) WHERE category IS NOT NULL;
CREATE INDEX idx_products_low_stock ON products(business_id, inventory_qty)
  WHERE status = 'active' AND inventory_qty <= 3;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON products
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public read active products" ON products
  FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "Authenticated read" ON products
  FOR SELECT TO authenticated USING (true);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- CARTS
-- One per shopper session. Anon carts identified by session_token (httpOnly
-- cookie); logged-in carts by user_id. Merge happens on login in lib/commerce.
-- =============================================================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID,
  session_token TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
    'open', 'checkout', 'converted', 'abandoned', 'expired'
  )),
  currency CHAR(3) NOT NULL DEFAULT 'PYG',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (user_id IS NOT NULL OR session_token IS NOT NULL)
);

CREATE INDEX idx_carts_business_user ON carts(business_id, user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_carts_session ON carts(business_id, session_token) WHERE session_token IS NOT NULL;
CREATE INDEX idx_carts_expiry ON carts(expires_at) WHERE status = 'open';

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON carts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- CART_ITEMS
-- One row per product in a cart. unit_price_cents is a snapshot at add time;
-- the final order re-reads the live product price inside create_order_txn.
-- =============================================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON cart_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- ORDERS
-- Source of truth once checkout starts. State machine enforced in app layer.
-- order_number is human-readable and unique per business (e.g. PRG-2026-000123).
-- =============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
  order_number TEXT NOT NULL,
  user_id UUID,
  cart_id UUID REFERENCES carts(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'awaiting_payment', 'paid', 'failed', 'cancelled', 'refunded',
    'fulfilled', 'shipped', 'delivered'
  )),
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  shipping_cents INTEGER NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
  tax_cents INTEGER NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
  discount_cents INTEGER NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'PYG',
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  placed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, order_number)
);

CREATE INDEX idx_orders_business_status ON orders(business_id, status);
CREATE INDEX idx_orders_customer_email ON orders(business_id, customer_email);
CREATE INDEX idx_orders_user ON orders(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_orders_created ON orders(business_id, created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Customer reads own orders" ON orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ORDER_ITEMS
-- product_snapshot freezes {name, sku, image_url, category} so later edits to
-- products don't rewrite order history.
-- =============================================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_snapshot JSONB NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  line_total_cents INTEGER NOT NULL CHECK (line_total_cents >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON order_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- STOREFRONT_TRANSACTIONS
-- Gateway-side payment attempts. Distinct from SaaS `payments`.
-- UNIQUE (provider, provider_payment_id) = webhook dedup anchor.
-- =============================================================================
CREATE TABLE storefront_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL CHECK (provider IN ('mercado_pago', 'bancard', 'manual')),
  provider_payment_id TEXT,
  provider_preference_id TEXT,
  status TEXT NOT NULL CHECK (status IN (
    'created', 'pending', 'authorized', 'approved', 'in_process',
    'rejected', 'refunded', 'cancelled', 'failed'
  )),
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency CHAR(3) NOT NULL,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_code TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_payment_id)
);

CREATE INDEX idx_storefront_tx_order ON storefront_transactions(order_id);
CREATE INDEX idx_storefront_tx_business_status ON storefront_transactions(business_id, status);
CREATE INDEX idx_storefront_tx_preference ON storefront_transactions(provider_preference_id)
  WHERE provider_preference_id IS NOT NULL;

ALTER TABLE storefront_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON storefront_transactions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER storefront_tx_updated_at
  BEFORE UPDATE ON storefront_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- WEBHOOK_EVENTS
-- Dedup + audit trail. provider_event_id is the webhook provider's own id.
-- Replayed webhooks hit the UNIQUE constraint and become no-ops.
-- =============================================================================
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  signature_valid BOOLEAN NOT NULL,
  processed_at TIMESTAMPTZ,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_event_id)
);

CREATE INDEX idx_webhook_events_pending ON webhook_events(created_at)
  WHERE processed_at IS NULL;
CREATE INDEX idx_webhook_events_order ON webhook_events(order_id)
  WHERE order_id IS NOT NULL;

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON webhook_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- IDEMPOTENCY_KEYS
-- Dedup checkout POSTs: same key + body hash returns the cached response.
-- Cleaned up by the same cron that expires carts.
-- =============================================================================
CREATE TABLE idempotency_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  body_hash TEXT NOT NULL,
  response_status INTEGER NOT NULL,
  response_body JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, key)
);

CREATE INDEX idx_idempotency_expiry ON idempotency_keys(expires_at);

ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON idempotency_keys
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- create_order_txn
-- Atomic: reads cart, validates live prices + stock, inserts order + items,
-- decrements inventory, marks cart 'checkout'. Rolls back on any failure.
-- =============================================================================
CREATE OR REPLACE FUNCTION create_order_txn(
  p_business_id UUID,
  p_cart_id UUID,
  p_customer_email TEXT,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_shipping_address JSONB,
  p_shipping_cents INTEGER,
  p_tax_cents INTEGER,
  p_discount_cents INTEGER,
  p_user_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_order_id UUID := uuid_generate_v4();
  v_order_number TEXT;
  v_currency CHAR(3);
  v_subtotal BIGINT := 0;
  v_item RECORD;
  v_product RECORD;
  v_line_total BIGINT;
BEGIN
  -- Lock cart row and verify it belongs to this business
  SELECT currency INTO v_currency
    FROM carts
    WHERE id = p_cart_id AND business_id = p_business_id AND status = 'open'
    FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'cart_not_found_or_closed' USING ERRCODE = 'P0001';
  END IF;

  -- Generate human-readable order number: PRG-YYYY-NNNNNN
  v_order_number := 'PRG-'
    || TO_CHAR(NOW(), 'YYYY')
    || '-'
    || LPAD(next_counter(p_business_id, 'order_number')::TEXT, 6, '0');

  -- Create shell order (totals filled at the end)
  INSERT INTO orders (
    id, business_id, order_number, user_id, cart_id, status,
    subtotal_cents, shipping_cents, tax_cents, discount_cents, total_cents,
    currency, customer_email, customer_name, customer_phone, shipping_address,
    notes, placed_at
  ) VALUES (
    v_order_id, p_business_id, v_order_number, p_user_id, p_cart_id, 'awaiting_payment',
    0, p_shipping_cents, p_tax_cents, p_discount_cents, 0,
    v_currency, p_customer_email, p_customer_name, p_customer_phone, p_shipping_address,
    p_notes, NOW()
  );

  -- Walk cart items, lock each product, verify stock, insert order_items
  FOR v_item IN
    SELECT ci.product_id, ci.quantity
      FROM cart_items ci
      WHERE ci.cart_id = p_cart_id
      ORDER BY ci.created_at
  LOOP
    SELECT id, name, sku, price_cents, currency, inventory_qty, inventory_policy,
           (images->0->>'url') AS cover_url, category, status
      INTO v_product
      FROM products
      WHERE id = v_item.product_id AND business_id = p_business_id
      FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'product_missing:%', v_item.product_id USING ERRCODE = 'P0002';
    END IF;
    IF v_product.status <> 'active' THEN
      RAISE EXCEPTION 'product_inactive:%', v_item.product_id USING ERRCODE = 'P0003';
    END IF;
    IF v_product.currency <> v_currency THEN
      RAISE EXCEPTION 'currency_mismatch:%', v_item.product_id USING ERRCODE = 'P0004';
    END IF;
    IF v_product.inventory_policy = 'deny' AND v_product.inventory_qty < v_item.quantity THEN
      RAISE EXCEPTION 'out_of_stock:%', v_item.product_id USING ERRCODE = 'P0005';
    END IF;

    v_line_total := v_product.price_cents::BIGINT * v_item.quantity;
    v_subtotal := v_subtotal + v_line_total;

    INSERT INTO order_items (
      business_id, order_id, product_id, product_snapshot,
      quantity, unit_price_cents, line_total_cents
    ) VALUES (
      p_business_id, v_order_id, v_product.id,
      jsonb_build_object(
        'name', v_product.name,
        'sku', v_product.sku,
        'image_url', v_product.cover_url,
        'category', v_product.category
      ),
      v_item.quantity, v_product.price_cents, v_line_total
    );

    -- Conditional decrement (respects inventory_policy)
    IF v_product.inventory_policy = 'deny' THEN
      UPDATE products
        SET inventory_qty = inventory_qty - v_item.quantity
        WHERE id = v_product.id AND inventory_qty >= v_item.quantity;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'out_of_stock_race:%', v_item.product_id USING ERRCODE = 'P0005';
      END IF;
    ELSE
      UPDATE products SET inventory_qty = inventory_qty - v_item.quantity
        WHERE id = v_product.id;
    END IF;
  END LOOP;

  IF v_subtotal = 0 THEN
    RAISE EXCEPTION 'empty_cart' USING ERRCODE = 'P0006';
  END IF;

  UPDATE orders
    SET subtotal_cents = v_subtotal,
        total_cents = v_subtotal + p_shipping_cents + p_tax_cents - p_discount_cents
    WHERE id = v_order_id;

  UPDATE carts SET status = 'checkout' WHERE id = p_cart_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Done. Remember to flip `commerce.enabled` per business type in src/registry/
-- and seed at least one product before exposing storefront routes.
-- =============================================================================

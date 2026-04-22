-- Fix: create_order_txn uses uuid_generate_v4() which lives in the
-- `extensions` schema, but the function has `SET search_path TO 'public'`
-- so the call failed in prod with:
--   ERROR: function uuid_generate_v4() does not exist
--
-- Every checkout attempt returned 400 `order_create_failed`. Discovered
-- 2026-04-22 while smoke-testing fun4me's manual-transfer flow after
-- the admin-client RLS fix (PR #253).
--
-- gen_random_uuid() is built into Postgres 13+, lives in pg_catalog,
-- and doesn't depend on any extension — simpler and standard.
-- Recorded in memory: checkout-runtime-config.md.

CREATE OR REPLACE FUNCTION public.create_order_txn(
  p_business_id uuid,
  p_cart_id uuid,
  p_customer_email text,
  p_customer_name text,
  p_customer_phone text,
  p_shipping_address jsonb,
  p_shipping_cents integer,
  p_tax_cents integer,
  p_discount_cents integer,
  p_user_id uuid DEFAULT NULL::uuid,
  p_notes text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  v_order_id UUID := gen_random_uuid();
  v_order_number TEXT;
  v_currency CHAR(3);
  v_subtotal BIGINT := 0;
  v_item RECORD;
  v_product RECORD;
  v_line_total BIGINT;
BEGIN
  SELECT currency INTO v_currency FROM carts
    WHERE id = p_cart_id AND business_id = p_business_id AND status = 'open' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'cart_not_found_or_closed' USING ERRCODE = 'P0001'; END IF;

  v_order_number := 'PRG-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(next_counter(p_business_id, 'order_number')::TEXT, 6, '0');

  INSERT INTO orders (id, business_id, order_number, user_id, cart_id, status,
    subtotal_cents, shipping_cents, tax_cents, discount_cents, total_cents,
    currency, customer_email, customer_name, customer_phone, shipping_address, notes, placed_at)
  VALUES (v_order_id, p_business_id, v_order_number, p_user_id, p_cart_id, 'awaiting_payment',
    0, p_shipping_cents, p_tax_cents, p_discount_cents, 0,
    v_currency, p_customer_email, p_customer_name, p_customer_phone, p_shipping_address, p_notes, NOW());

  FOR v_item IN SELECT ci.product_id, ci.quantity FROM cart_items ci WHERE ci.cart_id = p_cart_id ORDER BY ci.created_at LOOP
    SELECT id, name, sku, price_cents, currency, inventory_qty, inventory_policy,
      (images->0->>'url') AS cover_url, category, status
      INTO v_product FROM products WHERE id = v_item.product_id AND business_id = p_business_id FOR UPDATE;

    IF NOT FOUND THEN RAISE EXCEPTION 'product_missing:%', v_item.product_id USING ERRCODE = 'P0002'; END IF;
    IF v_product.status <> 'active' THEN RAISE EXCEPTION 'product_inactive:%', v_item.product_id USING ERRCODE = 'P0003'; END IF;
    IF v_product.currency <> v_currency THEN RAISE EXCEPTION 'currency_mismatch:%', v_item.product_id USING ERRCODE = 'P0004'; END IF;
    IF v_product.inventory_policy = 'deny' AND v_product.inventory_qty < v_item.quantity THEN
      RAISE EXCEPTION 'out_of_stock:%', v_item.product_id USING ERRCODE = 'P0005';
    END IF;

    v_line_total := v_product.price_cents::BIGINT * v_item.quantity;
    v_subtotal := v_subtotal + v_line_total;

    INSERT INTO order_items (business_id, order_id, product_id, product_snapshot, quantity, unit_price_cents, line_total_cents)
    VALUES (p_business_id, v_order_id, v_product.id,
      jsonb_build_object('name', v_product.name, 'sku', v_product.sku, 'image_url', v_product.cover_url, 'category', v_product.category),
      v_item.quantity, v_product.price_cents, v_line_total);

    IF v_product.inventory_policy = 'deny' THEN
      UPDATE products SET inventory_qty = inventory_qty - v_item.quantity
        WHERE id = v_product.id AND inventory_qty >= v_item.quantity;
      IF NOT FOUND THEN RAISE EXCEPTION 'out_of_stock_race:%', v_item.product_id USING ERRCODE = 'P0005'; END IF;
    ELSE
      UPDATE products SET inventory_qty = inventory_qty - v_item.quantity WHERE id = v_product.id;
    END IF;
  END LOOP;

  IF v_subtotal = 0 THEN RAISE EXCEPTION 'empty_cart' USING ERRCODE = 'P0006'; END IF;

  UPDATE orders SET subtotal_cents = v_subtotal, total_cents = v_subtotal + p_shipping_cents + p_tax_cents - p_discount_cents
    WHERE id = v_order_id;
  UPDATE carts SET status = 'checkout' WHERE id = p_cart_id;

  RETURN v_order_id;
END;
$function$;

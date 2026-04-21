-- =============================================================================
-- Atomic inventory adjust — used by inventory.ts for refunds/returns/manual
-- adjustments. Respects deny policy: negative deltas that would leave
-- inventory_qty < 0 under 'deny' fail; 'continue' allows going negative.
-- =============================================================================

CREATE OR REPLACE FUNCTION adjust_inventory(
  p_business_id UUID,
  p_product_id UUID,
  p_delta INTEGER
) RETURNS INTEGER AS $$
DECLARE
  v_policy TEXT;
  v_new_qty INTEGER;
BEGIN
  SELECT inventory_policy INTO v_policy
    FROM products
    WHERE id = p_product_id AND business_id = p_business_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'product_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF p_delta < 0 AND v_policy = 'deny' THEN
    UPDATE products
      SET inventory_qty = inventory_qty + p_delta
      WHERE id = p_product_id
        AND business_id = p_business_id
        AND inventory_qty >= -p_delta
      RETURNING inventory_qty INTO v_new_qty;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'out_of_stock' USING ERRCODE = 'P0005';
    END IF;
  ELSE
    UPDATE products
      SET inventory_qty = inventory_qty + p_delta
      WHERE id = p_product_id AND business_id = p_business_id
      RETURNING inventory_qty INTO v_new_qty;
  END IF;

  RETURN v_new_qty;
END;
$$ LANGUAGE plpgsql;

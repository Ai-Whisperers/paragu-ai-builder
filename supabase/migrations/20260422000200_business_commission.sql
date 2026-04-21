-- =============================================================================
-- Platform commission on tenant sales (PR 6 of 8)
-- =============================================================================
-- Pagopar split billing at the gateway: each order becomes tipo_pedido
-- "COMERCIO-HEREDADO" and we prepend a commission compras_items entry with
-- Paragu-AI's own public_key. Pagopar settles the tenant's share to their
-- bank, our commission to Paragu-AI's bank — we never hold the money.
--
-- commission_percent: 0.00–100.00, default 5.00 (5%)
-- commission_flat_cents: fixed PYG fee per order, default 0
-- commission_exempt_until: during the 3-month free-premium window, no
--   commission line is added. NULL means "not exempt".
-- =============================================================================

ALTER TABLE businesses
  ADD COLUMN commission_percent NUMERIC(5,2) NOT NULL DEFAULT 5.00
    CHECK (commission_percent >= 0 AND commission_percent <= 100),
  ADD COLUMN commission_flat_cents INTEGER NOT NULL DEFAULT 0
    CHECK (commission_flat_cents >= 0),
  ADD COLUMN commission_exempt_until TIMESTAMPTZ;

-- Index for fast lookup when building storefront analytics ("how much
-- commission did we earn from businesses NOT in the free-premium window").
CREATE INDEX idx_businesses_commission_exempt
  ON businesses(commission_exempt_until)
  WHERE commission_exempt_until IS NOT NULL;

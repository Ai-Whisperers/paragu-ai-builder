-- =============================================================================
-- Commerce — Pagopar swap (PR 1 of 5)
-- =============================================================================
-- Replaces Mercado Pago with Pagopar as the primary payment provider for PY.
-- Adds Pagopar and dLocal to the allowed provider list; removes mercado_pago.
--
-- Safe to run: no existing rows reference 'mercado_pago' because commerce has
-- not yet been enabled on any live tenant. If that changes before this PR
-- ships, the ALTER will fail loudly — fix by migrating those rows first.
-- =============================================================================

ALTER TABLE storefront_transactions
  DROP CONSTRAINT storefront_transactions_provider_check;

ALTER TABLE storefront_transactions
  ADD CONSTRAINT storefront_transactions_provider_check
    CHECK (provider IN ('pagopar', 'bancard', 'dlocal', 'manual'));

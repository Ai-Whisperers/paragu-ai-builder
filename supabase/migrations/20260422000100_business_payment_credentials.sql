-- =============================================================================
-- Per-business payment credentials (PR 4 of 5)
-- =============================================================================
-- Each merchant brings their own Pagopar (and eventually MP/dLocal) tokens.
-- Tokens are encrypted in the app layer with AES-256-GCM keyed by
-- COMMERCE_CREDENTIALS_KEY before insert; the DB sees only ciphertext + iv +
-- tag JSON. RLS = service_role only — never reachable from anon/authenticated.
-- =============================================================================

CREATE TABLE business_payment_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('pagopar', 'bancard', 'dlocal', 'manual')),
  -- Encrypted credentials blob: { fields: { name: { iv, ct, tag } } }
  encrypted_secrets JSONB NOT NULL,
  -- Non-secret per-provider config (environment, region, public key safe to log).
  public_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, provider)
);

CREATE INDEX idx_payment_creds_business_active
  ON business_payment_credentials(business_id, provider)
  WHERE status = 'active';

ALTER TABLE business_payment_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON business_payment_credentials
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER business_payment_credentials_updated_at
  BEFORE UPDATE ON business_payment_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

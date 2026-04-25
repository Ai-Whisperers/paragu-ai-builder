-- ============================================================================
-- Subscriptions + data-request tables for customer portal + GDPR flow.
--
-- Feeds /api/subscriptions/* and /api/data-request.
-- Multi-tenant via site_slug.
-- ============================================================================

-- ----- subscriptions -----
CREATE TABLE IF NOT EXISTS subscriptions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_slug      TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  plan_id        TEXT NOT NULL,                            -- matches tier name in content (e.g. "L2-Pareja")
  status         TEXT NOT NULL DEFAULT 'active'
                 CHECK (status IN ('trialing', 'active', 'paused', 'canceled', 'past_due')),
  started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  paused_from    TIMESTAMPTZ,
  paused_until   TIMESTAMPTZ,
  canceled_at    TIMESTAMPTZ,
  preferences    JSONB,                                    -- dietary, household size, dislikes, delivery window
  external_id    TEXT,                                     -- Stripe subscription id if applicable
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_slug_email ON subscriptions (site_slug, customer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status    ON subscriptions (status);

CREATE TABLE IF NOT EXISTS subscription_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  kind            TEXT NOT NULL CHECK (kind IN ('pause', 'resume', 'skip_week', 'preferences_updated', 'billing')),
  payload         JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_events_sub ON subscription_events (subscription_id, created_at DESC);

DROP TRIGGER IF EXISTS subscriptions_set_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_set_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Scope reads: customers can only read their own row (enforced by RLS using
-- the `customer_email` JWT claim added by the auth layer).
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_owner_select ON subscriptions
  FOR SELECT
  TO authenticated
  USING (customer_email = (auth.jwt() ->> 'email'));
CREATE POLICY subscriptions_service_all ON subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscription_events_service_all ON subscription_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ----- data_requests (GDPR / Ley 1.682) -----
CREATE TABLE IF NOT EXISTS data_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_slug     TEXT NOT NULL,
  email         TEXT NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('access', 'rectification', 'deletion', 'portability', 'objection')),
  description   TEXT,
  identity_proof TEXT,
  status        TEXT NOT NULL DEFAULT 'received'
                CHECK (status IN ('received', 'in_progress', 'completed', 'rejected')),
  due_at        TIMESTAMPTZ NOT NULL,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_requests_site  ON data_requests (site_slug);
CREATE INDEX IF NOT EXISTS idx_data_requests_email ON data_requests (email);
CREATE INDEX IF NOT EXISTS idx_data_requests_due   ON data_requests (due_at);

DROP TRIGGER IF EXISTS data_requests_set_updated_at ON data_requests;
CREATE TRIGGER data_requests_set_updated_at
  BEFORE UPDATE ON data_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY data_requests_service_all ON data_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ----- tenant_content_overrides (for `cli pull-content`) -----
CREATE TABLE IF NOT EXISTS tenant_content_overrides (
  tenant_slug TEXT NOT NULL,
  locale      TEXT NOT NULL,
  payload     JSONB NOT NULL,
  updated_by  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_slug, locale)
);

ALTER TABLE tenant_content_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_content_service_all ON tenant_content_overrides
  FOR ALL TO service_role USING (true) WITH CHECK (true);

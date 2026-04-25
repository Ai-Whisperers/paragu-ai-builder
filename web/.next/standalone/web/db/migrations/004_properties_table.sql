-- ============================================================================
-- Properties table for real-estate tenants (nexa-propiedades + future PY/UY).
--
-- Feeds /api/properties and the `property-listings` section's
-- `listings-from-api` variant. Multi-tenant via site_slug.
-- ============================================================================

CREATE TABLE IF NOT EXISTS properties (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_slug      TEXT NOT NULL,
  external_id    TEXT,                                        -- e.g. MLS id
  transaction    TEXT NOT NULL CHECK (transaction IN ('venta', 'alquiler', 'temporal')),
  property_type  TEXT NOT NULL,                              -- casa, departamento, terreno, oficina, ...
  title          TEXT NOT NULL,
  description    TEXT,
  price          BIGINT,                                      -- stored as integer in smallest unit (Gs 1, USD cents)
  price_currency TEXT NOT NULL DEFAULT 'PYG',
  bedrooms       SMALLINT,
  bathrooms      SMALLINT,
  area_sqm       NUMERIC(10,2),
  neighborhood   TEXT,
  city           TEXT,
  country        TEXT NOT NULL DEFAULT 'PY',
  lat            NUMERIC(10,6),
  lng            NUMERIC(10,6),
  features       JSONB,                                       -- amenities, tags, etc.
  images         JSONB,                                       -- [{src, alt, order}]
  featured       BOOLEAN NOT NULL DEFAULT false,
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rented', 'pending', 'hidden')),
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_site_slug      ON properties (site_slug);
CREATE INDEX IF NOT EXISTS idx_properties_transaction    ON properties (transaction);
CREATE INDEX IF NOT EXISTS idx_properties_property_type  ON properties (property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city           ON properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_status         ON properties (status);
CREATE INDEX IF NOT EXISTS idx_properties_published_at   ON properties (published_at DESC);

-- Auto-update `updated_at`.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_set_updated_at ON properties;
CREATE TRIGGER properties_set_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row-Level Security — scope reads by site_slug for public anon,
-- full access for service role.
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY properties_public_active ON properties
  FOR SELECT
  TO anon
  USING (status = 'active');

CREATE POLICY properties_service_all ON properties
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

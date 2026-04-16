-- =============================================================================
-- Paragu-AI Builder - Initial Database Schema
-- =============================================================================
-- Tables for managing businesses, generated sites, and generation tracking.
-- Pattern: RLS on all tables, business_id isolation (from Vete).
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- BUSINESSES
-- Core table storing business data from leads
-- =============================================================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'peluqueria', 'salon_belleza', 'gimnasio', 'spa', 'unas', 'tatuajes',
    'barberia', 'estetica', 'maquillaje', 'depilacion', 'pestanas'
  )),
  -- Contact
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  -- Location
  address TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL DEFAULT 'Asuncion',
  state TEXT DEFAULT 'Central',
  coordinates JSONB,
  google_maps_url TEXT,
  -- Content
  tagline TEXT,
  owner_name TEXT,
  years_in_operation INTEGER,
  hours JSONB,
  -- Extended data (services, team, gallery, testimonials)
  data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Metadata
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_businesses_type ON businesses(type);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_status ON businesses(status);

-- RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Service role has full access (admin operations)
CREATE POLICY "Service role full access" ON businesses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated users can read all businesses
CREATE POLICY "Authenticated read" ON businesses
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- GENERATED SITES
-- Tracks each generation attempt and its output
-- =============================================================================
CREATE TABLE generated_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'generating', 'generated', 'deployed', 'error'
  )),
  palette TEXT,
  deployed_url TEXT,
  error_message TEXT,
  -- Build metadata
  build_duration_ms INTEGER,
  page_count INTEGER,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,

  UNIQUE(business_id, version)
);

CREATE INDEX idx_generated_sites_business ON generated_sites(business_id);
CREATE INDEX idx_generated_sites_status ON generated_sites(status);

ALTER TABLE generated_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON generated_sites
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON generated_sites
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- SITE PAGES
-- Individual pages within a generated site
-- =============================================================================
CREATE TABLE site_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES generated_sites(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  -- Composed page data
  sections_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(site_id, slug)
);

CREATE INDEX idx_site_pages_site ON site_pages(site_id);
CREATE INDEX idx_site_pages_business ON site_pages(business_id);

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON site_pages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON site_pages
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- SITE ASSETS
-- Images, logos, and other media for generated sites
-- =============================================================================
CREATE TABLE site_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  site_id UUID REFERENCES generated_sites(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('logo', 'hero', 'gallery', 'team', 'service', 'other')),
  url TEXT NOT NULL,
  alt_text TEXT,
  storage_path TEXT,
  file_size_bytes INTEGER,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_assets_business ON site_assets(business_id);
CREATE INDEX idx_site_assets_type ON site_assets(type);

ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON site_assets
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON site_assets
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- GENERATION LOGS
-- Step-by-step tracking of generation pipeline
-- =============================================================================
CREATE TABLE generation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES generated_sites(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  duration_ms INTEGER,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_generation_logs_site ON generation_logs(site_id);
CREATE INDEX idx_generation_logs_business ON generation_logs(business_id);

ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON generation_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON generation_logs
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- Automatically update updated_at on row changes
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

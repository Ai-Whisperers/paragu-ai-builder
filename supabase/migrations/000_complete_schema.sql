-- =============================================================================
-- Paragu-AI Builder - Complete Database Schema
-- =============================================================================
-- Phase 0-4 tables: leads, outreach, onboarding, payments, subscriptions
-- Run this in Supabase SQL Editor to set up production database
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- LEADS (from paragu-ai-leads repo)
-- Priority A leads imported from Google Maps research
-- =============================================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Business identity
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  business_type TEXT NOT NULL,
  
  -- Contact info (from Google Maps)
  phone TEXT,
  phone_status TEXT CHECK (phone_status IN ('valid', 'invalid', 'landline', 'mobile', 'unknown')),
  email TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook_url TEXT,
  social_followers_estimate INTEGER,
  
  -- Location
  address TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL DEFAULT 'Asuncion',
  state TEXT DEFAULT 'Central',
  coordinates JSONB,
  google_maps_url TEXT,
  google_maps_place_id TEXT UNIQUE,
  
  -- Business details
  hours JSONB,
  years_in_operation INTEGER,
  rating DECIMAL(2,1),
  review_count INTEGER,
  
  -- Lead scoring
  priority_score INTEGER CHECK (priority_score >= 0 AND priority_score <= 100),
  priority_tier TEXT CHECK (priority_tier IN ('A', 'B', 'C', 'D')),
  has_website BOOLEAN DEFAULT false,
  has_phone BOOLEAN DEFAULT false,
  has_reviews BOOLEAN DEFAULT false,
  
  -- Funnel status
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'enriched', 'demo_ready', 'contacted', 'responded', 
    'meeting_scheduled', 'onboarding', 'paying', 'churned', 'disqualified'
  )),
  
  -- Metadata
  source TEXT NOT NULL DEFAULT 'google_maps',
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_enriched_at TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for filtering
CREATE INDEX idx_leads_type ON leads(business_type);
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority_tier, priority_score DESC);
CREATE INDEX idx_leads_has_website ON leads(has_website) WHERE has_website = false;
CREATE INDEX idx_leads_score ON leads(priority_score DESC) WHERE priority_score >= 70;

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON leads
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- BUSINESSES
-- Active businesses that have been onboarded
-- Linked to leads via lead_id for funnel tracking
-- =============================================================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'peluqueria', 'salon_belleza', 'gimnasio', 'spa', 'unas', 'tatuajes',
    'barberia', 'estetica', 'maquillaje', 'depilacion', 'pestanas', 'diseno_grafico',
    'relocation', 'inmobiliaria', 'legal', 'consultoria', 'educacion', 'salud', 
    'inversiones', 'meal_prep'
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
  
  -- Extended data
  data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_type ON businesses(type);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_lead ON businesses(lead_id) WHERE lead_id IS NOT NULL;

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON businesses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON businesses
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- GENERATED SITES
-- Tracks each generation attempt and its output
-- =============================================================================
CREATE TABLE generated_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'generating', 'generated', 'deployed', 'error'
  )),
  
  -- Configuration
  palette TEXT,
  locale TEXT DEFAULT 'es',
  
  -- URLs
  deployed_url TEXT,
  preview_url TEXT,
  
  -- Build metadata
  error_message TEXT,
  build_duration_ms INTEGER,
  page_count INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,
  
  UNIQUE(business_id, version)
);

CREATE INDEX idx_generated_sites_business ON generated_sites(business_id);
CREATE INDEX idx_generated_sites_status ON generated_sites(status);
CREATE INDEX idx_generated_sites_lead ON generated_sites(lead_id) WHERE lead_id IS NOT NULL;

ALTER TABLE generated_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON generated_sites
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON generated_sites
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- OUTREACH EVENTS
-- CRM-lite tracking: WhatsApp sends, email opens, demo views
-- =============================================================================
CREATE TABLE outreach_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'whatsapp_sent', 'email_sent', 'demo_viewed', 'demo_shared', 
    'onboarding_started', 'onboarding_completed', 'payment_initiated',
    'meeting_scheduled', 'meeting_completed', 'follow_up_sent'
  )),
  
  -- Event details
  channel TEXT CHECK (channel IN ('whatsapp', 'email', 'sms', 'call', 'demo_url')),
  message_template TEXT,
  message_content TEXT,
  
  -- UTM tracking for demo links
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Result
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outreach_lead ON outreach_events(lead_id);
CREATE INDEX idx_outreach_type ON outreach_events(event_type);
CREATE INDEX idx_outreach_created ON outreach_events(created_at DESC);
CREATE INDEX idx_outreach_utm ON outreach_events(utm_source, utm_medium) WHERE utm_source IS NOT NULL;

ALTER TABLE outreach_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON outreach_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON outreach_events
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- ONBOARDING TOKENS
-- Secure tokens for customer onboarding forms
-- =============================================================================
CREATE TABLE onboarding_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  
  -- Status
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  
  -- Data collected
  collected_data JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_onboarding_token ON onboarding_tokens(token);
CREATE INDEX idx_onboarding_lead ON onboarding_tokens(lead_id);

ALTER TABLE onboarding_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON onboarding_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- SUBSCRIPTIONS & PAYMENTS
-- MercadoPago integration tracking
-- =============================================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  
  -- Plan details
  plan_tier TEXT NOT NULL CHECK (plan_tier IN ('free', 'starter', 'professional', 'enterprise')),
  plan_name TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN (
    'trialing', 'active', 'past_due', 'canceled', 'paused'
  )),
  
  -- Dates
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  canceled_at TIMESTAMPTZ,
  
  -- Payment provider
  mercadopago_subscription_id TEXT,
  mercadopago_payer_id TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_business ON subscriptions(business_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_lead ON subscriptions(lead_id) WHERE lead_id IS NOT NULL;

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON subscriptions
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- PAYMENTS
-- Individual payment records
-- =============================================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PYG',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- MercadoPago
  mercadopago_payment_id TEXT,
  mercadopago_order_id TEXT,
  
  -- Metadata
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  failure_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_business ON payments(business_id);
CREATE INDEX idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON payments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON payments
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
-- VIEWS FOR DASHBOARDS
-- =============================================================================

-- Lead funnel view
CREATE VIEW lead_funnel_summary AS
SELECT 
  status,
  COUNT(*) as count,
  AVG(priority_score) as avg_score
FROM leads
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'new' THEN 1
    WHEN 'enriched' THEN 2
    WHEN 'demo_ready' THEN 3
    WHEN 'contacted' THEN 4
    WHEN 'responded' THEN 5
    WHEN 'meeting_scheduled' THEN 6
    WHEN 'onboarding' THEN 7
    WHEN 'paying' THEN 8
    WHEN 'churned' THEN 9
    WHEN 'disqualified' THEN 10
  END;

-- Conversion metrics view
CREATE VIEW conversion_metrics AS
SELECT 
  l.id as lead_id,
  l.business_name,
  l.status,
  l.priority_score,
  COUNT(DISTINCT oe.id) as total_touchpoints,
  COUNT(DISTINCT CASE WHEN oe.event_type = 'demo_viewed' THEN oe.id END) as demo_views,
  COUNT(DISTINCT CASE WHEN oe.event_type = 'whatsapp_sent' THEN oe.id END) as whatsapp_sends,
  MAX(CASE WHEN oe.event_type = 'demo_viewed' THEN oe.created_at END) as last_demo_view,
  s.id as subscription_id,
  s.status as subscription_status,
  s.plan_tier
FROM leads l
LEFT JOIN outreach_events oe ON oe.lead_id = l.id
LEFT JOIN subscriptions s ON s.lead_id = l.id
GROUP BY l.id, l.business_name, l.status, l.priority_score, s.id, s.status, s.plan_tier;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update lead status on outreach events
CREATE OR REPLACE FUNCTION update_lead_status_on_event()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leads
  SET 
    status = CASE NEW.event_type
      WHEN 'whatsapp_sent' THEN 'contacted'
      WHEN 'email_sent' THEN 'contacted'
      WHEN 'demo_viewed' THEN 'responded'
      WHEN 'onboarding_completed' THEN 'onboarding'
      WHEN 'payment_initiated' THEN 'paying'
      ELSE status
    END,
    last_contacted_at = CASE 
      WHEN NEW.event_type IN ('whatsapp_sent', 'email_sent') THEN NEW.created_at
      ELSE last_contacted_at
    END,
    updated_at = NOW()
  WHERE id = NEW.lead_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER outreach_event_status_update
  AFTER INSERT ON outreach_events
  FOR EACH ROW EXECUTE FUNCTION update_lead_status_on_event();

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert demo businesses (the existing demo data)
INSERT INTO businesses (slug, name, type, city, tagline, status, data_json) VALUES
('salon-maria', 'Salon Maria', 'peluqueria', 'Asuncion', 'Tu belleza, nuestra pasion', 'active', '{}'),
('gymfit-py', 'GymFit Paraguay', 'gimnasio', 'Asuncion', 'Transforma tu cuerpo, transforma tu vida', 'active', '{}'),
('spa-serenidad', 'Spa Serenidad', 'spa', 'Asuncion', 'Relax y bienestar natural', 'active', '{}'),
('unias-arte', 'Unias Arte', 'unas', 'Asuncion', 'Arte en tus manos', 'active', '{}'),
('barberia-clasica', 'Barberia Clasica', 'barberia', 'Asuncion', 'Estilo tradicional para hombres modernos', 'active', '{}');

-- Create indexes for full-text search (optional enhancement)
CREATE INDEX idx_leads_search ON leads 
  USING gin(to_tsvector('spanish', business_name || ' ' || COALESCE(address, '') || ' ' || COALESCE(neighborhood, '')));

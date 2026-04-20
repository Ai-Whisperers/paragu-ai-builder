-- =============================================================================
-- PERFORMANCE OPTIMIZATION MIGRATION
-- Adds indexes to improve query performance
-- 
-- This migration should be run during low-traffic period
-- Use CONCURRENTLY to avoid locking tables
-- =============================================================================

-- Start transaction
BEGIN;

-- =============================================================================
-- LEADS TABLE INDEXES
-- =============================================================================

-- Index for status filtering (most common query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_status 
  ON leads(status);

-- Index for city filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_city 
  ON leads(city);

-- Index for business type filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_business_type 
  ON leads(business_type);

-- Composite index for common filter combinations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_status_city 
  ON leads(status, city);

-- Index for sorting by import date
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_imported_at 
  ON leads(imported_at DESC);

-- Index for priority score sorting/filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_priority_score 
  ON leads(priority_score DESC);

-- Partial index for high-priority leads (frequently queried)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_high_priority 
  ON leads(id, business_name) 
  WHERE priority_tier = 'A';

-- Partial index for leads without websites (target for outreach)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_no_website 
  ON leads(id, business_name, phone) 
  WHERE has_website = false;

-- Index for slug lookups (unique constraint should already exist, but verify)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_slug_unique 
  ON leads(slug);

-- Index for Google Maps Place ID lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_google_maps_place_id 
  ON leads(google_maps_place_id) 
  WHERE google_maps_place_id IS NOT NULL;

-- =============================================================================
-- BUSINESSES TABLE INDEXES
-- =============================================================================

-- Index for lead_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_lead_id 
  ON businesses(lead_id);

-- Index for business type filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_type 
  ON businesses(type);

-- Index for slug lookups
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_slug_unique 
  ON businesses(slug);

-- Composite index for user-business lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_user_id 
  ON businesses(user_id) 
  WHERE user_id IS NOT NULL;

-- =============================================================================
-- GENERATED_SITES TABLE INDEXES
-- =============================================================================

-- Index for business_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_sites_business_id 
  ON generated_sites(business_id);

-- Index for slug lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_sites_slug 
  ON generated_sites(slug);

-- =============================================================================
-- SITE_PAGES TABLE INDEXES
-- =============================================================================

-- Index for site_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_site_pages_site_id 
  ON site_pages(site_id);

-- Composite index for site + page type lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_site_pages_site_type 
  ON site_pages(site_id, page_type);

-- =============================================================================
-- SITE_ASSETS TABLE INDEXES
-- =============================================================================

-- Index for site_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_site_assets_site_id 
  ON site_assets(site_id);

-- Index for asset type filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_site_assets_type 
  ON site_assets(asset_type);

-- =============================================================================
-- OUTREACH_EVENTS TABLE INDEXES
-- =============================================================================

-- Index for lead_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_outreach_events_lead_id 
  ON outreach_events(lead_id);

-- Index for event type filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_outreach_events_type 
  ON outreach_events(event_type);

-- Index for created_at sorting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_outreach_events_created_at 
  ON outreach_events(created_at DESC);

-- Composite index for lead event timeline
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_outreach_events_lead_timeline 
  ON outreach_events(lead_id, created_at DESC);

-- =============================================================================
-- SUBSCRIPTIONS TABLE INDEXES
-- =============================================================================

-- Index for business_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_business_id 
  ON subscriptions(business_id);

-- Index for status filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_status 
  ON subscriptions(status);

-- Index for end date (for renewal queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_current_period_end 
  ON subscriptions(current_period_end);

-- =============================================================================
-- GENERATION_LOGS TABLE INDEXES
-- =============================================================================

-- Index for business_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generation_logs_business_id 
  ON generation_logs(business_id);

-- Index for created_at sorting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generation_logs_created_at 
  ON generation_logs(created_at DESC);

-- =============================================================================
-- NOTES TABLE INDEXES
-- =============================================================================

-- Index for lead_id foreign key
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_lead_id 
  ON notes(lead_id);

-- Index for created_at sorting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_created_at 
  ON notes(created_at DESC);

-- =============================================================================
-- AUDIT_LOGS TABLE INDEXES (if it exists)
-- =============================================================================

-- Index for user_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_id 
  ON audit_logs(user_id);

-- Index for created_at sorting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_created_at 
  ON audit_logs(created_at DESC);

-- Index for request_id lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_request_id 
  ON audit_logs(request_id);

-- =============================================================================
-- FULL-TEXT SEARCH INDEXES (optional, for advanced search)
-- =============================================================================

-- Add trigram extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN index for business name search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_business_name_trgm 
  ON leads USING gin (business_name gin_trgm_ops);

-- GIN index for address search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_address_trgm 
  ON leads USING gin (address gin_trgm_ops);

-- =============================================================================
-- JSONB INDEXES (if using JSONB queries)
-- =============================================================================

-- GIN index for leads.data_json
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_data_json 
  ON leads USING gin (data_json);

-- GIN index for businesses.data_json
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_data_json 
  ON businesses USING gin (data_json);

-- =============================================================================
-- VERIFY INDEXES CREATED
-- =============================================================================

-- Output summary
DO $$
DECLARE
  idx_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes 
  WHERE schemaname = 'public' 
    AND indexdef LIKE '%CREATE%INDEX%'
    AND tablename IN (
      'leads', 'businesses', 'generated_sites', 'site_pages', 
      'site_assets', 'outreach_events', 'subscriptions', 
      'generation_logs', 'notes', 'audit_logs'
    );
  
  RAISE NOTICE 'Total indexes on application tables: %', idx_count;
END $$;

-- Commit transaction
COMMIT;

-- =============================================================================
-- ANALYZE TABLES TO UPDATE STATISTICS
-- =============================================================================

ANALYZE leads;
ANALYZE businesses;
ANALYZE generated_sites;
ANALYZE site_pages;
ANALYZE site_assets;
ANALYZE outreach_events;
ANALYZE subscriptions;
ANALYZE generation_logs;
ANALYZE notes;
ANALYZE audit_logs;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Run this to verify indexes:
-- SELECT tablename, indexname, indexdef 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, indexname;

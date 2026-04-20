-- Win 67: Lead Scoring View
-- SQL view for priority analysis

-- Drop existing view if it exists
DROP VIEW IF EXISTS lead_scoring_analysis;

-- Create comprehensive lead scoring view
CREATE VIEW lead_scoring_analysis AS
WITH scored_leads AS (
  SELECT
    id,
    business_name,
    business_type,
    city,
    neighborhood,
    phone,
    email,
    whatsapp,
    instagram,
    facebook_url,
    rating,
    review_count,
    years_in_operation,
    has_website,
    has_phone,
    has_reviews,
    priority_score,
    priority_tier,
    status,
    source,
    imported_at,
    created_at,
    updated_at,
    
    -- Calculate engagement score (0-40 points)
    (
      CASE WHEN has_phone THEN 10 ELSE 0 END +
      CASE WHEN has_reviews THEN 10 ELSE 0 END +
      CASE WHEN rating >= 4.0 THEN 10 ELSE 0 END +
      CASE WHEN (instagram IS NOT NULL OR facebook_url IS NOT NULL) THEN 10 ELSE 0 END
    ) AS engagement_score,
    
    -- Calculate digital presence score (0-30 points)
    (
      CASE WHEN has_website THEN 0 ELSE 30 END +  -- No website = high potential
      CASE WHEN instagram IS NOT NULL THEN 5 ELSE 0 END +
      CASE WHEN facebook_url IS NOT NULL THEN 5 ELSE 0 END
    ) AS digital_presence_score,
    
    -- Calculate reputation score (0-20 points)
    (
      CASE 
        WHEN review_count >= 50 THEN 20
        WHEN review_count >= 20 THEN 15
        WHEN review_count >= 10 THEN 10
        WHEN review_count >= 5 THEN 5
        ELSE 0
      END +
      CASE 
        WHEN rating >= 4.5 THEN 10
        WHEN rating >= 4.0 THEN 5
        ELSE 0
      END
    ) AS reputation_score,
    
    -- Calculate business maturity score (0-10 points)
    (
      CASE 
        WHEN years_in_operation >= 10 THEN 10
        WHEN years_in_operation >= 5 THEN 7
        WHEN years_in_operation >= 2 THEN 5
        WHEN years_in_operation >= 1 THEN 3
        ELSE 0
      END
    ) AS maturity_score
    
  FROM leads
  WHERE deleted_at IS NULL
)
SELECT
  *,
  -- Calculate total score (0-100)
  (engagement_score + digital_presence_score + reputation_score + maturity_score) AS calculated_score,
  
  -- Assign priority based on score
  CASE
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 80 THEN 'A+ (Hot)'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 60 THEN 'A (High)'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 40 THEN 'B (Medium)'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 20 THEN 'C (Low)'
    ELSE 'D (Cold)'
  END AS calculated_priority,
  
  -- Conversion probability estimate
  CASE
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 70 THEN 'High (15-25%)'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 50 THEN 'Medium (8-15%)'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 30 THEN 'Low (3-8%)'
    ELSE 'Very Low (<3%)'
  END AS conversion_probability,
  
  -- Recommended action
  CASE
    WHEN status = 'converted' THEN 'Nurture'
    WHEN status = 'lost' THEN 'Reactivate in 6 months'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 80 THEN 'Immediate outreach'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 60 THEN 'High priority outreach'
    WHEN (engagement_score + digital_presence_score + reputation_score + maturity_score) >= 40 THEN 'Standard outreach'
    ELSE 'Low priority / Batch outreach'
  END AS recommended_action,
  
  -- Days since import
  EXTRACT(DAY FROM (CURRENT_TIMESTAMP - imported_at::timestamp)) AS days_since_import,
  
  -- Is new (imported in last 7 days)
  CASE WHEN imported_at >= CURRENT_TIMESTAMP - INTERVAL '7 days' THEN true ELSE false END AS is_new

FROM scored_leads;

-- Create indexes for better view performance
CREATE INDEX IF NOT EXISTS idx_leads_scoring_business_type ON leads(business_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_scoring_city ON leads(city) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_scoring_priority ON leads(priority_score DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_scoring_status ON leads(status) WHERE deleted_at IS NULL;

-- Add comment
COMMENT ON VIEW lead_scoring_analysis IS 'Comprehensive lead scoring view with engagement, digital presence, reputation, and maturity scores. Updated in real-time.';

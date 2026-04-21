-- Create staff_members table for individual staff profiles
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Basic info
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  
  -- Professional details
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  
  -- Social & contact
  instagram TEXT,
  email TEXT,
  phone TEXT,
  
  -- Ratings
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  
  -- Availability (JSON for flexibility)
  availability JSONB DEFAULT '[]',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(business_id, slug)
);

-- Create index for business lookups
CREATE INDEX idx_staff_members_business ON staff_members(business_id);
CREATE INDEX idx_staff_members_slug ON staff_members(slug);
CREATE INDEX idx_staff_members_active ON staff_members(business_id, is_active);

-- Enable RLS
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Staff members are viewable by everyone" 
  ON staff_members FOR SELECT 
  USING (true);

CREATE POLICY "Staff members are editable by business owners" 
  ON staff_members FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = staff_members.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- Create staff_services junction table
CREATE TABLE IF NOT EXISTS staff_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_member_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  custom_duration INTEGER, -- override default duration
  custom_price INTEGER,    -- override default price
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(staff_member_id, service_id)
);

-- Create index
CREATE INDEX idx_staff_services_staff ON staff_services(staff_member_id);
CREATE INDEX idx_staff_services_service ON staff_services(service_id);

-- Enable RLS
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Staff services are viewable by everyone" 
  ON staff_services FOR SELECT 
  USING (true);

CREATE POLICY "Staff services are editable by business owners" 
  ON staff_services FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM staff_members 
      JOIN businesses ON businesses.id = staff_members.business_id
      WHERE staff_members.id = staff_services.staff_member_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_staff_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := regexp_replace(base_slug, '^-|-$', '', 'g');
  final_slug := base_slug;
  
  -- Check if slug exists and append number if needed
  WHILE EXISTS (SELECT 1 FROM staff_members WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_staff_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_staff_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_staff_slug
  BEFORE INSERT ON staff_members
  FOR EACH ROW
  EXECUTE FUNCTION set_staff_slug();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_staff_members_updated_at
  BEFORE UPDATE ON staff_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

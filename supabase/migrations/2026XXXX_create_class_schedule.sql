-- Create classes table for gym schedule
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES staff_members(id),
  
  -- Class details
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_capacity INTEGER NOT NULL DEFAULT 20,
  intensity_level TEXT CHECK (intensity_level IN ('low', 'medium', 'high')),
  
  -- Schedule
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_business ON classes(business_id);
CREATE INDEX idx_classes_active ON classes(business_id, is_active, day_of_week);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Classes are viewable by everyone" 
  ON classes FOR SELECT 
  USING (true);

CREATE POLICY "Classes are editable by business owners" 
  ON classes FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = classes.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- Create class_bookings table
CREATE TABLE IF NOT EXISTS class_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Booking date (for recurring classes)
  booking_date DATE NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
  
  -- Check-in
  checked_in_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(class_id, booking_date, customer_phone)
);

CREATE INDEX idx_class_bookings_class ON class_bookings(class_id, booking_date);
CREATE INDEX idx_class_bookings_customer ON class_bookings(customer_phone);

-- Enable RLS
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Class bookings are viewable by business owners" 
  ON class_bookings FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM classes 
      JOIN businesses ON businesses.id = classes.business_id
      WHERE classes.id = class_bookings.class_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- Function to get class schedule for a week
CREATE OR REPLACE FUNCTION get_weekly_schedule(
  p_business_id UUID,
  p_start_date DATE
)
RETURNS TABLE (
  class_id UUID,
  class_name TEXT,
  class_description TEXT,
  instructor_name TEXT,
  day_of_week INTEGER,
  start_time TIME,
  duration_minutes INTEGER,
  intensity_level TEXT,
  max_capacity INTEGER,
  current_bookings BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as class_id,
    c.name as class_name,
    c.description as class_description,
    sm.name as instructor_name,
    c.day_of_week,
    c.start_time,
    c.duration_minutes,
    c.intensity_level,
    c.max_capacity,
    COUNT(cb.id) as current_bookings
  FROM classes c
  LEFT JOIN staff_members sm ON sm.id = c.instructor_id
  LEFT JOIN class_bookings cb ON cb.class_id = c.id 
    AND cb.booking_date BETWEEN p_start_date AND p_start_date + INTERVAL '6 days'
    AND cb.status = 'confirmed'
  WHERE c.business_id = p_business_id
    AND c.is_active = true
  GROUP BY c.id, sm.name
  ORDER BY c.day_of_week, c.start_time;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

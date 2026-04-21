-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price INTEGER NOT NULL, -- in cents/smallest currency unit
  
  category TEXT,
  image_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(business_id, slug)
);

CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_services_active ON services(business_id, is_active);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone" 
  ON services FOR SELECT 
  USING (true);

CREATE POLICY "Services are editable by business owners" 
  ON services FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = services.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  
  -- Booking details
  service_id UUID REFERENCES services(id),
  staff_member_id UUID REFERENCES staff_members(id),
  
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  
  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,
  
  -- Metadata
  source TEXT DEFAULT 'website', -- website, whatsapp, phone, walk_in
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- Unique constraint to prevent double bookings
  UNIQUE(business_id, staff_member_id, booking_date, booking_time)
);

CREATE INDEX idx_bookings_business ON bookings(business_id);
CREATE INDEX idx_bookings_date ON bookings(business_id, booking_date);
CREATE INDEX idx_bookings_staff ON bookings(staff_member_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_phone);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings are viewable by business owners" 
  ON bookings FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = bookings.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Bookings are editable by business owners" 
  ON bookings FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = bookings.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- Create availability slots table (for blocking time)
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  staff_member_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
  
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  is_available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_availability_business ON availability_slots(business_id);
CREATE INDEX idx_availability_staff ON availability_slots(staff_member_id);

-- Enable RLS
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability is viewable by everyone" 
  ON availability_slots FOR SELECT 
  USING (true);

CREATE POLICY "Availability is editable by business owners" 
  ON availability_slots FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = availability_slots.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- Create blocked dates table (for holidays, vacations, etc)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  staff_member_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
  
  blocked_date DATE NOT NULL,
  reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blocked_dates ON blocked_dates(business_id, blocked_date);

-- Enable RLS
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blocked dates are viewable by everyone" 
  ON blocked_dates FOR SELECT 
  USING (true);

-- Function to generate available time slots
CREATE OR REPLACE FUNCTION get_available_slots(
  p_business_id UUID,
  p_staff_member_id UUID,
  p_date DATE,
  p_duration_minutes INTEGER
)
RETURNS TABLE (
  slot_time TIME,
  is_available BOOLEAN
) AS $$
DECLARE
  v_day_of_week INTEGER;
  v_start_time TIME;
  v_end_time TIME;
BEGIN
  v_day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Get staff availability for this day
  SELECT start_time, end_time 
  INTO v_start_time, v_end_time
  FROM availability_slots
  WHERE staff_member_id = p_staff_member_id
    AND day_of_week = v_day_of_week
    AND is_available = true;
  
  -- If no availability, return empty
  IF v_start_time IS NULL THEN
    RETURN;
  END IF;
  
  -- Generate time slots every 30 minutes
  RETURN QUERY
  WITH time_slots AS (
    SELECT generate_series(
      v_start_time::timestamp,
      v_end_time::timestamp - (p_duration_minutes || ' minutes')::interval,
      '30 minutes'::interval
    )::time AS slot_time
  )
  SELECT 
    ts.slot_time,
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.staff_member_id = p_staff_member_id
        AND b.booking_date = p_date
        AND b.status IN ('pending', 'confirmed')
        AND (
          -- Check for overlapping bookings
          (b.booking_time <= ts.slot_time AND b.booking_time + (b.duration_minutes || ' minutes')::interval > ts.slot_time)
          OR
          (b.booking_time >= ts.slot_time AND b.booking_time < ts.slot_time + (p_duration_minutes || ' minutes')::interval)
        )
    ) AS is_available
  FROM time_slots ts
  ORDER BY ts.slot_time;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_availability_updated_at
  BEFORE UPDATE ON availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

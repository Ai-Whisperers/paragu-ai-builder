-- =============================================================================
-- Add meal_prep and diseno_grafico business types
-- =============================================================================
-- Widens the businesses.type CHECK constraint to cover two types that were
-- missing from the initial schema:
--   - diseno_grafico (Dayah LitWorks was seeded but not in the constraint)
--   - meal_prep      (new type: premium personal shopping + meal prep)
--
-- Safe to re-run: drops and recreates the constraint.
-- =============================================================================

ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_type_check;

ALTER TABLE businesses ADD CONSTRAINT businesses_type_check CHECK (type IN (
  'peluqueria',
  'salon_belleza',
  'gimnasio',
  'spa',
  'unas',
  'tatuajes',
  'barberia',
  'estetica',
  'maquillaje',
  'depilacion',
  'pestanas',
  'diseno_grafico',
  'meal_prep'
));

-- Storage bucket for commerce product images.
-- Public read (CDN-served to shoppers) + service-role write (admin API only).
-- Objects live under {business_id}/{product_id}/{uuid}.ext so cross-business
-- access is structurally impossible from client-side.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'commerce-products',
  'commerce-products',
  true,
  5242880, -- 5 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS: anyone can read; only service_role can write/update/delete.
-- The admin API (which runs as service_role via admin client) performs writes.
-- Anon/authenticated clients never upload directly.

DROP POLICY IF EXISTS "commerce_products_public_read" ON storage.objects;
DROP POLICY IF EXISTS "commerce_products_service_role_write" ON storage.objects;

CREATE POLICY "commerce_products_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'commerce-products');

CREATE POLICY "commerce_products_service_role_write"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'commerce-products')
  WITH CHECK (bucket_id = 'commerce-products');

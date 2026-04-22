-- Comprobante image upload (Batch D). Adds two columns on orders for
-- the Supabase-storage-backed file the customer optionally uploads
-- on /checkout/transfer/[id]. Path shape: <business_id>/<order_id>/<ts>.<ext>.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS comprobante_image_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS comprobante_uploaded_at TIMESTAMPTZ NULL;

-- Storage bucket `comprobantes` is created via Supabase admin with:
--   id='comprobantes', public=false, file_size_limit=5MB,
--   allowed_mime_types=[image/jpeg, image/png, image/webp, application/pdf]
--
-- Our upload API uses the service-role client and writes directly to
-- the bucket; the image_url we persist is a signed URL valid for the
-- bucket's default TTL. Admin UI generates fresh signed URLs on demand
-- so we don't have to worry about expiry on stored column values.

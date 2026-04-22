-- Invoice data model on orders. All nullable — tenants without SET
-- certification just leave them empty. Once Batch L (SET e-invoice
-- integration) ships, these fields get populated automatically by the
-- Facture / Arandú webhook when the order hits `paid`. Until then, an
-- admin can manually fill them by uploading a provisional PDF.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS invoice_number TEXT NULL,
  ADD COLUMN IF NOT EXISTS invoice_issued_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS invoice_pdf_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS invoice_legal_name TEXT NULL,
  ADD COLUMN IF NOT EXISTS invoice_ruc TEXT NULL,
  ADD COLUMN IF NOT EXISTS invoice_concept TEXT NULL;

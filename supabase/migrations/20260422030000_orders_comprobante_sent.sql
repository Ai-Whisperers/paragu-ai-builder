-- Add comprobante-sent timestamp + optional note to orders. Set by the
-- customer via a new POST endpoint on the transfer-instructions page
-- after they send the transfer proof via WhatsApp. The admin sees a
-- badge on the order-detail page so both sides know the current state
-- without pinging each other on WhatsApp.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS comprobante_sent_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS comprobante_note TEXT NULL;

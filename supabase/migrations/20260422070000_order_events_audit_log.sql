-- Order activity log (Batch G1). Append-only audit trail; one row per
-- state transition or notable admin action. Admin order detail renders
-- a timeline from this table.

CREATE TABLE IF NOT EXISTS order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  actor_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_label TEXT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'status_changed',
    'comprobante_received',
    'comprobante_uploaded',
    'invoice_issued',
    'refund_issued',
    'note_added'
  )),
  from_status TEXT NULL,
  to_status TEXT NULL,
  note TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_events_order_idx
  ON order_events (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS order_events_business_idx
  ON order_events (business_id, created_at DESC);

ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON order_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

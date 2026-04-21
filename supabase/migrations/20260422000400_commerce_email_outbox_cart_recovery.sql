-- Allow the abandoned-cart cron to enqueue recovery emails into the outbox.
-- Each of the 3 touch steps (24h / 72h / 7d) gets its own template id so
-- downstream analytics + unsubscribe logic can distinguish them.

ALTER TABLE commerce_email_outbox
  DROP CONSTRAINT IF EXISTS commerce_email_outbox_template_check;

ALTER TABLE commerce_email_outbox
  ADD CONSTRAINT commerce_email_outbox_template_check
    CHECK (template IN (
      'order_confirmation',
      'order_paid',
      'order_shipped',
      'order_refunded',
      'low_stock_digest',
      'cart_recovery_24h',
      'cart_recovery_72h',
      'cart_recovery_7d'
    ));

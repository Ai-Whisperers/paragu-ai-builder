-- Extend commerce_email_outbox.template CHECK constraint to include the
-- new admin-notification templates. Without this, any attempt to insert
-- an admin notification into the outbox fails with a 23514 CHECK violation
-- and the merchant never learns about new orders.

ALTER TABLE commerce_email_outbox DROP CONSTRAINT commerce_email_outbox_template_check;

ALTER TABLE commerce_email_outbox ADD CONSTRAINT commerce_email_outbox_template_check
  CHECK (template = ANY (ARRAY[
    'order_confirmation',
    'order_paid',
    'order_shipped',
    'order_refunded',
    'low_stock_digest',
    'cart_recovery_24h',
    'cart_recovery_72h',
    'cart_recovery_7d',
    'back_in_stock',
    'review_request',
    'admin_new_order',
    'admin_daily_digest'
  ]));

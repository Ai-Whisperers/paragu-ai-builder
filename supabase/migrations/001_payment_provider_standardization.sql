ALTER TABLE subscriptions RENAME COLUMN mercadopago_subscription_id TO payment_subscription_id;
ALTER TABLE subscriptions RENAME COLUMN mercadopago_payer_id TO payment_payer_id;
ALTER TABLE payments RENAME COLUMN mercadopago_payment_id TO payment_payment_id;
ALTER TABLE payments RENAME COLUMN mercadopago_order_id TO payment_order_id;

COMMENT ON COLUMN subscriptions.payment_subscription_id IS 'Payment provider subscription ID (renamed from mercadopago_subscription_id)';
COMMENT ON COLUMN subscriptions.payment_payer_id IS 'Payment provider payer ID (renamed from mercadopago_payer_id)';
COMMENT ON COLUMN payments.payment_payment_id IS 'Payment provider payment ID (renamed from mercadopago_payment_id)';
COMMENT ON COLUMN payments.payment_order_id IS 'Payment provider order ID (renamed from mercadopago_order_id)';

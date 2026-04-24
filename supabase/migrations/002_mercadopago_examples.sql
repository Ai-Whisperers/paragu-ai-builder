INSERT INTO payments (
  id,
  subscription_id,
  business_id,
  amount,
  currency,
  status,
  payment_subscription_id,
  payment_payer_id,
  payment_payment_id,
  payment_order_id,
  paid_at,
  created_at
)
VALUES
  (uuid_generate_v4(), uuid_generate_v4(), (SELECT id FROM businesses LIMIT 1), 150000.00, 'PYG', 'completed', 'sub_123456789', 'payer_987654321', 'pay_987654321', 'ord_123456789', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '2 hours'),
  (uuid_generate_v4(), uuid_generate_v4(), (SELECT id FROM businesses LIMIT 1), 250000.00, 'PYG', 'completed', 'sub_987654321', 'payer_987654321', 'pay_987654321', 'ord_987654321', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '4 hours'),
  (uuid_generate_v4(), uuid_generate_v4(), (SELECT id FROM businesses LIMIT 1), 100000.00, 'PYG', 'pending', 'sub_11122233344', NULL, NULL, NULL, NOW() - INTERVAL '5 minutes', NOW());

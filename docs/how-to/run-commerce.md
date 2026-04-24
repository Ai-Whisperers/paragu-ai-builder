# Run Commerce Walkthrough

> End-to-end commerce operations: from product setup to order fulfillment.

## 1. Enable Commerce for a Tenant

In tenant `site.json`, set commerce features:
```json
{
  "features": {
    "commerce": { "enabled": true },
    "onlineOrdering": { "enabled": true }
  }
}
```

## 2. Add Products

Create products in Supabase `products` table:
```sql
INSERT INTO products (business_id, name, price_cents, currency, category, status)
VALUES ('<business-id>', 'Product Name', 50000, 'PYG', 'category', 'active');
```

Or use the admin panel at `/admin/commerce/products`.

## 3. Test Checkout

1. Open the tenant's storefront page
2. Add items to cart
3. Proceed to checkout
4. Complete via manual payment (transfer + WhatsApp)
5. Verify order created in `orders` table

## 4. Manage Orders

- **View**: `/admin/commerce/orders`
- **Update status**: Via admin panel or direct SQL:
  ```sql
  UPDATE orders SET status = 'confirmed' WHERE id = '<order-id>';
  ```
- **Add comprobante**: Upload PDF via admin → comprobante field
- **Refund**: Via admin → refund UI or SQL

## 5. Verify Delivery

Confirm shipment in admin panel → status updates:
- `preparing` → `shipped` → `delivered`
- Or mark as `canceled` if order cannot be fulfilled

## Commission Tracking

Business commission is set in `businesses` table:
- `commission_percent` - Percentage taken per sale
- `commission_flat_cents` - Flat fee per sale
- `commission_exempt_until` - Promotional exemption period

Commissions calculated at order completion via `business-commission.ts`.

## Cart Recovery Emails

Sent automatically via the `commerce_email_outbox` system when:
- Cart aged >1 hour without checkout (recovery template)
- Item back in stock (back-in-stock template)
- Post-purchase review request (review template)

---

_Last updated: April 24, 2026_

# Commerce Reference

> Core commerce system: shopping cart, checkout, orders, products, inventory, shipping, discounts.

## Architecture

```
Cart → Checkout → Payment → Order → Fulfillment
  │                    │          │
  ▼                    ▼          ▼
state-machine    payment-router  order-events
```

## Tables

- `products` - Tenant product catalog (JSON for static, DB-backed for commerce-enabled)
- `orders` - Customer orders with status, amount, items, comprobante
- `order_events` - Audit log of order state transitions
- `wishlist` / `wishlist_items` - Customer wishlists
- `reviews` - Product reviews
- `referrals` - Referral tracking

## Key Modules

| File | Purpose |
|------|---------|
| `web/lib/commerce/cart.ts` | Cart session management |
| `web/lib/commerce/orders.ts` | Order CRUD + status transitions |
| `web/lib/commerce/products.ts` | Product CRUD |
| `web/lib/commerce/state-machine.ts` | Order state machine |
| `web/lib/commerce/discounts.ts` | Discount/promo code logic |
| `web/lib/commerce/shipping-threshold.ts` | Free shipping threshold calc |
| `web/lib/commerce/shipping-zones.ts` | Zone-based shipping |
| `web/lib/commerce/notifications.ts` | Order notifications |
| `web/lib/commerce/reviews.ts` | Review moderation |
| `web/lib/commerce/email-templates.ts` | Email templates (order confirmation, recovery, etc.) |

## Order States

```
cart → pending → confirmed → preparing → shipped → delivered
                      ↓
                  canceled / refunded
```

State transitions are logged to `order_events` table. See [state-machine.ts](../../web/lib/commerce/state-machine.ts).

## Checkout Flow

1. Add items to cart (session-based)
2. Review cart → apply discount → calculate shipping
3. Select payment method (manual, MercadoPago)
4. Submit order → `orders` table with status `pending`
5. Payment handled by `payment-router`
6. On payment confirmation → order transitions to `confirmed`

## Comprobante (Invoice) System

Orders can have comprobante PDFs uploaded via `orders_comprobante_upload` migration.
Fields: `comprobante_url`, `comprobante_sent_at`, `comprobante_type`.
Used by Paraguayan businesses for tax/legal compliance.

## Cart Recovery

Email templates for abandoned cart recovery stored in `commerce_email_outbox` table.
Templates: recovery, back-in-stock, review-request, new-order-notification (admin).

## Related

- [SAAS_BILLING.md](./SAAS_BILLING.md) - Subscription billing for SaaS model
- [PAYMENT_ROUTER.md](./PAYMENT_ROUTER.md) - Payment provider routing
- [DEAD_CODE_AUDIT.md](./DEAD_CODE_AUDIT.md) - inventory.ts, wishlist-store.ts pre-built

---

_Last updated: April 24, 2026_

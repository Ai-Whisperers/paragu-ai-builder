# SaaS Billing Reference

> Platform subscription billing: plan tiers, payment tracking, manual crediting.

## Architecture

```
Business → Subscription → Payments (one-time or recurring)
                │
          Payment credentials (provider config)
```

## Tables

### `subscriptions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | PK |
| `business_id` | UUID | FK → businesses |
| `plan_tier` | TEXT | free/starter/professional/enterprise |
| `plan_name` | TEXT | Human-readable plan name |
| `price_monthly` | DECIMAL | Monthly price in PYG |
| `status` | TEXT | trialing/active/past_due/canceled/paused |
| `trial_ends_at` | TIMESTAMPTZ | End of trial period |
| `current_period_start/end` | TIMESTAMPTZ | Billing period |
| `payment_subscription_id` | TEXT | Provider subscription ref |
| `payment_payer_id` | TEXT | Provider payer ref |

### `payments`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | PK |
| `subscription_id` | UUID | FK → subscriptions |
| `business_id` | UUID | FK → businesses |
| `amount` | DECIMAL | Payment amount |
| `currency` | TEXT | PYG |
| `status` | TEXT | pending/completed/failed/refunded |
| `payment_payment_id` | TEXT | Provider payment ref |
| `payment_order_id` | TEXT | Provider order ref |

### `business_payment_credentials`
Per-provider config: `provider`, `encrypted_secrets` (jsonb), `public_config` (jsonb), `status`.

## Payment Flows

### Manual Payment (Active)
1. Admin creates subscription for business
2. Business pays via bank transfer
3. Admin marks payment as completed in admin panel
4. Subscription status updated to `active`

### Online Payment (Future: MercadoPago)
1. Business/customer initiates via checkout
2. Payment intent sent to provider
3. Webhook callback updates payment status
4. Subscription auto-renewed

## Key Files

- `web/lib/billing/paragu-ai-saas.ts` - Subscription management
- `web/lib/commerce/payment-credentials.ts` - Credential storage
- `web/app/admin/billing/[businessId]/subscription/page.tsx` - Admin UI

## Commission System

Business commission is stored in `businesses` table:
- `commission_percent` - Percentage
- `commission_flat_cents` - Flat fee
- `commission_exempt_until` - Exemption date

Calculated via `web/lib/commerce/business-commission.ts`.

---

_Last updated: April 24, 2026_

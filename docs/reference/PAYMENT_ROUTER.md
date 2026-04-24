# Payment Router Reference

> Routes payment requests to the appropriate payment provider adapter.

## Architecture

```
Payment Request → Router → Provider Adapter → Provider API
                                │
                    ┌─────────────┬──────────────┐
                    ▼             ▼              ▼
               Manual        MercadoPago     Future (Pagopar)
```

## Provider Adapters

### Manual (Active)
- Bank transfer + WhatsApp comprobante flow
- Provider: `manual`
- Config: `business_payment_credentials` with `instructions` and `whatsappNumber`

### MercadoPago (Planned)
- Online card payments (credit, debit)
- Webhook callback for status updates
- Provider: `mercadopago`

### Pagopar (Future)
- Paraguayan payment gateway
- Provider: `pagopar`

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/commerce/payment-credentials.ts` | Credential management |
| `docs/runbooks/MERCADOPAGO_INTEGRATION.md` | Integration specification |

## Column Mapping

After standardization migration:
- `payment_subscription_id` - Provider subscription ID
- `payment_payer_id` - Provider payer/customer ID
- `payment_payment_id` - Provider payment ID
- `payment_order_id` - Provider order ID

## Adding a New Provider

1. Add provider to `business_payment_credentials` table
2. Create adapter in `web/lib/commerce/adapters/`
3. Register in the router
4. Add provider enum to UI selectors
5. Define RLS policies

---

_Last updated: April 24, 2026_

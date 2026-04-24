# Security Reference

> Security patterns, rate limiting, input sanitization, and RLS policies.

## Architecture

```
Request → Rate limit → Auth → RLS → Service
```

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/security/rate-limit.ts` | Rate limiting (IP-based, user-based) |
| `web/lib/security/sanitize.ts` | Input sanitization utilities |
| `supabase/migrations/000_complete_schema.sql` | RLS policies on all tables |

## RLS Policies

Every table has at minimum:
```sql
CREATE POLICY "Service role full access" ON [table]
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON [table]
  FOR SELECT TO authenticated USING (true);
```

Key policies:
- `leads` - Authenticated users can insert; service_role full access
- `payments` - Service role full access; authenticated read
- `businesses` - Authenticated can read own; ervice role full access
- `subscriptions` - Service role full access; authenticated read
- `business_payment_credentials` - Service role full access
- `merchant_order_notifications` - Service role full access

## Rate Limiting

Implemented in `rate-limit.ts`:
- **IP-based**: 100 requests/minute per IP
- **User-based**: 1000 requests/minute per authenticated user
- **Endpoint-specific**: Stricter limits for auth endpoints (10/min)
- Standard for: webhooks, cron jobs, admin routes

## Input Sanitization

`sanitize.ts` provides:
- HTML tag stripping
- SQL injection prevention (via parameterized queries)
- URL validation
- Email format validation
- Phone number normalization

## Webhook Security

Currently manual adapter pattern (no live payment webhook yet).
When implemented:
- Signature verification via `x-mercadopago-signature` header
- IP whitelist for provider callbacks
- Idempotency keys to prevent duplicate processing

## API Key Management

- Supabase anon key for client-side (public)
- Service role key for server-side (private)
- Payment credentials stored encrypted in `business_payment_credentials`
- Never logged in application logs or error messages

---

_Last updated: April 24, 2026_

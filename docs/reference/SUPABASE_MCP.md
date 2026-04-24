# Supabase MCP - Agent Integration Reference

> How to use Supabase MCP tools. Read this first before making database changes.

## Connection

- **Project**: Paragu-AI Builder (Supabase)
- **Project Ref**: `qyvokpribmbrosafntqa`
- **URL**: https://qyvokpribmbrosafntqa.supabase.co
- **MCP Server**: `http://https://mcp.supabase.com/mcp?project_ref=qyvokpribmbrosafntqa`

## Available MCP Tools

The Supabase MCP provides these tools (no client library needed):

| Tool | Purpose | Example |
|------|---------|---------|
| `supabase_list_tables` | List all tables with columns | Check schema structure |
| `supabase_execute_sql` | Run SELECT queries (read-only data) | Query payment records |
| `supabase_apply_migration` | Apply DDL changes safely | Rename columns, add tables |
| `supabase_get_logs` | View service logs | Debug edge functions |
| `supabase_list_migrations` | Check applied migrations | See what's deployed |
| `supabase_get_project_url` | Get project URL | Find API endpoint |
| `supabase_get_publishable_keys` | Get anon/publishable keys | For client-side config |

## Quick Reference - Common Tasks

### Inspect Schema
```
supabase_execute_sql("SELECT column_name FROM information_schema.columns WHERE table_name = 'payments'")
```

### Check Migration Status
```
supabase_list_migrations()
```

### Apply Migration
```
supabase_apply_migration(name="descriptive_name", query="ALTER TABLE...")
```

### Get Logs (last 24h)
```
supabase_get_logs(service="api")  # or "postgres", "auth", "storage"
```

## Migration Convention

Migrations are tracked by Supabase automatically. When applying:

1. **Use descriptive names** (e.g., `standardize_payment_provider_columns`)
2. **Keep SQL idempotent** where possible (use `IF NOT EXISTS` / `RENAME IF EXISTS`)
3. **Comment on changed columns** so the schema is self-documenting
4. **Test with `supabase_execute_sql`** before applying

Current migration count: 29 applied (including payment provider standardization)

## Payment Tables

After standardization migration (BATCH 4.30 applied 2026-04-24):

**payments** table columns:
- `id` (uuid, PK)
- `subscription_id` (uuid, FK → subscriptions)
- `business_id` (uuid, FK → businesses)
- `amount` (decimal)
- `currency` (text, e.g. PYG)
- `status` (text: pending/completed/failed/refunded)
- `payment_payment_id` (text, was `mercadopago_payment_id`)
- `payment_order_id` (text, was `mercadopago_order_id`)
- `paid_at`, `refunded_at`, `failure_reason`, `created_at`

**subscriptions** table columns:
- `payment_subscription_id` (text, was `mercadopago_subscription_id`)
- `payment_payer_id` (text, was `mercadopago_payer_id`)

**business_payment_credentials** table:
- `business_id`, `provider`, `encrypted_secrets` (jsonb), `public_config` (jsonb), `status`

Current provider: `manual` (transfer + WhatsApp)

## Code References

Update `mercadopago_*` → `payment_*` in these files when touching payment code:
- `web/lib/billing/paragu-ai-saas.ts` (payment tracking in subscription update)
- `web/app/admin/billing/[businessId]/subscription/page.tsx` (Subscription type)

## RLS Policies

Payment tables have standard service_role + authenticated policies. Check before adding new policies:
```
supabase_execute_sql("SELECT tablename, policyname, permissive FROM pg_policies WHERE tablename IN ('payments', 'subscriptions', 'business_payment_credentials')")
```

## Generated Types

Regenerate after schema changes:
```
supabase_generate_typescript_types()
```

---

_Last updated: April 24, 2026_

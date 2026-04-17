# Tenants

> **Tenant = one row in `businesses`.** There is no fixed list of tenants; each business is provisioned on demand from leads.

This repo is multi-tenant. Every generated site, page, asset, and log is owned by exactly one business and is isolated from all others. This doc explains the model, where it lives in code, and the one rule you must follow when writing queries.

---

## Tenant root

The tenant is the `businesses` row. Routing is slug-based: `/[business]/*`.

- **Table**: `businesses` — `web/db/migrations/001_initial_schema.sql`
- **Primary key**: `id` (UUID)
- **Routing key**: `slug` (unique)

### Business types

The DB `type` column (`businesses.type` CHECK constraint) accepts **11 values**:

| Type | Spanish | Known leads* |
|------|---------|--------------|
| peluqueria | Peluquería | 2,393 |
| salon_belleza | Salón de belleza | — |
| gimnasio | Gimnasio | 1,009 |
| spa | Spa | 638 |
| unas | Uñas | 578 |
| tatuajes | Tatuajes | 312 |
| barberia | Barbería | 262 |
| estetica | Estética | 219 |
| maquillaje | Maquillaje | 43 |
| depilacion | Depilación | 9 |
| pestanas | Pestañas | — |

\* Volumes come from the `paragu-ai-leads` market analysis. `salon_belleza` and `pestanas` are valid enum values but are not yet broken out in the lead dataset.

---

## Tenant-scoped tables

Every tenant-scoped table carries a `business_id` FK to `businesses.id`:

- `generated_sites`
- `site_pages`
- `site_assets`
- `generation_logs`

The authoritative list is `BUSINESS_SCOPED_TABLES` in `web/lib/supabase/scoped.ts`.

---

## Isolation model

Two layers, but the **application layer is the one that actually isolates tenants**. Read both.

### 1. Application layer — `scopedQueries()` (the real isolation)

`web/lib/supabase/scoped.ts` exports `scopedQueries(supabase, businessId)`, which returns query helpers that force `business_id = :businessId` onto every operation:

- `select` — adds `.eq('business_id', businessId)` before running
- `insert` — injects `business_id` into every record (ignoring any value the caller passed)
- `update` — filters by `business_id` **and** strips `business_id` out of the update payload so a row cannot be moved across tenants
- `delete`, `count`, `exists`, `verify` — all filter by `business_id`

Passing an empty `businessId` throws immediately (`[ScopedQueries] business_id is required for scoped queries`).

### 2. Postgres RLS — an auth gate, not a tenant filter

RLS is enabled on every tenant-scoped table, but the current policies are:

- `service_role` → full access (used by the admin client)
- `authenticated` → `SELECT` on **all** rows (not filtered by business)

That means RLS today prevents anonymous reads and anonymous writes, but it does **not** scope by tenant on its own. If you bypass `scopedQueries` on an authenticated client, you will read across tenants. Don't.

---

## The one rule

> Every read or write against a tenant-scoped table must go through `scopedQueries(supabase, businessId)`.

This is also stated in `CLAUDE.md` under *Quick Rules* ("All queries MUST filter by `business_id`") and *Critical Warnings* ("DO NOT skip business_id in queries").

### Pattern

```typescript
import { scopedQueries } from '@/lib/supabase/scoped'

const { select, insert } = scopedQueries(supabase, businessId)

const { data, error } = await select('site_pages', '*')
await insert('generation_logs', { step: 'render', status: 'started' })
```

### Anti-patterns

```typescript
// Raw query — reads across tenants on an authenticated client
await supabase.from('site_pages').select('*')

// Manually adding business_id — easy to forget, easy to get wrong
await supabase.from('site_pages').select('*').eq('business_id', businessId)
```

---

## Origin

The pattern is ported from the Vete project (`vete/web/lib/supabase/scoped.ts`), where it was written as `tenant_id`. In this repo the column is `business_id` but the discipline is identical. See `docs/VETE_PATTERNS_ANALYSIS.md` for the broader porting notes.

---

## Related files

| Purpose | Path |
|---------|------|
| Scoped query builder | `web/lib/supabase/scoped.ts` |
| Schema + RLS policies | `web/db/migrations/001_initial_schema.sql` |
| Supabase clients (server/browser/admin) | `web/lib/supabase/` |
| Multi-tenant routing | `web/app/[business]/` |
| Quick-reference rules | `CLAUDE.md` |

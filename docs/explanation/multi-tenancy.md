# Multi-tenancy

## The problem

One Next.js app serves many tenants. Every database query must be scoped to exactly one tenant, and any query that forgets — even once — becomes a cross-tenant data leak.

Defence-in-depth needs more than one line of defence. Row-level security (RLS) on the database is one; a mandatory scoping helper on the application is a second; a CI-enforced audit test is a third.

## The three-layer defence

### Layer 1 — application-level scoping (`scopedQueries`)

Every tenant-table query is routed through [`web/lib/supabase/scoped.ts`](../../web/lib/supabase/scoped.ts). The helper returns a builder that automatically chains `.eq('business_id', <id>)` before any `.select()` / `.update()` / `.delete()`.

Direct use of `supabase.from('<tenant_table>')` is forbidden outside `scoped.ts` (and the one allowlisted diagnostics route).

### Layer 2 — the audit test

[`web/tests/unit/scoped-query-audit.test.ts`](../../web/tests/unit/scoped-query-audit.test.ts) greps the codebase for raw `.from('<tenant_table>')` calls. CI fails the build if a bypass slips in. This is the enforcement mechanism that lets Layer 1 be a real invariant rather than a convention.

### Layer 3 — Supabase RLS policies

Each tenant-scoped table has a `business_id` column and an RLS policy restricting rows by that column. Even if both application layers fail, a service-role key leak or a missed `.eq()` would still be blocked at the database.

## Why all three?

| Threat | Caught by |
|---|---|
| A developer writes `supabase.from('leads').select()` without `.eq('business_id', ...)` | Layer 2 (audit test fails CI) |
| A developer uses `scopedQueries` but forgets to pass the tenant ID | Layer 1 (helper requires it at the type level) |
| A service-role key leaks via a misconfigured admin route | Layer 3 (RLS still enforces) |
| A malicious tenant in a shared environment tries to read another tenant's rows | Layer 3 (RLS blocks) |

## Where to look

- Invariant list: [`/ARCHITECTURE.md` § architectural invariants](../../ARCHITECTURE.md#5-architectural-invariants)
- Reference catalog of tenant data model: [reference/TENANTS.md](../reference/TENANTS.md)
- Adding a new tenant: follow [tutorials/first-tenant-site.md](../tutorials/first-tenant-site.md)
- The scoped helper: [`web/lib/supabase/scoped.ts`](../../web/lib/supabase/scoped.ts)
- The audit test: [`web/tests/unit/scoped-query-audit.test.ts`](../../web/tests/unit/scoped-query-audit.test.ts)

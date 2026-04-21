# 0003 · Env-allowlist for admin auth (vs `profiles.role` table)

**Status:** Accepted · 2026-04-21
**Deciders:** Ivan

## Context

Admin pages were originally gated on `profiles.role = 'admin'`, but the
`profiles` table doesn't exist in this Supabase project (verified against
project `qyvokpribmbrosafntqa` on 2026-04-21). The check was silently failing
and every authenticated user was being redirected to `/unauthorized`.

## Options considered

- **Create the `profiles` table + role column** — proper RBAC, supports many
  admins. Requires a migration, RLS policies, an admin-management UI for
  inviting users, and a backfill for the one existing admin email.
- **Env-allowlist (`ADMIN_EMAILS=a@x.com,b@y.com`)** — Just compare
  `user.email` against a comma-separated env var. Zero database round-trips,
  no schema, version-controlled per environment.
- **Supabase JWT custom claims** — set `app_metadata.role` server-side, check
  the claim. Requires a webhook or edge function to set the claim on signup.

## Decision

Env-allowlist (`ADMIN_EMAILS`). Implemented in `web/lib/auth/admin.ts` with
two helpers: `requireAdmin()` (Server Component, redirects) and `checkAdmin()`
(route handler, returns discriminated result).

## Consequences

- Adding/removing an admin = setting an env var on the VPS + redeploying.
  Reasonable for a 1-2 person team; would be friction past ~5 admins.
- No database round-trip per admin request — measurably faster than the
  prior failing check.
- Removes a class of "table missing" / "RLS policy wrong" failure modes.
- Call sites unchanged when we eventually move to RBAC: `requireAdmin()` keeps
  the same signature.

## Revisit if

- Team grows past ~5 admins (env list becomes unwieldy).
- We need per-tenant admin scopes (env can't express scoping).
- Audit requirements demand per-action attribution (env says "Ivan can do
  things"; RBAC tables say "Ivan did X at T").

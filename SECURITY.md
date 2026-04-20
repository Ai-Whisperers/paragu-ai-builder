# Security Policy

## Reporting a vulnerability

If you discover a security issue in this repo, **please do not open a public issue**. Instead:

1. Email **weissvanderpol.ivan@gmail.com** with subject `[SECURITY] paragu-ai-builder: <short summary>`.
2. Include reproduction steps, affected versions/commits, and the impact you've assessed.
3. Allow up to **5 business days** for acknowledgment and up to **30 days** for a fix before public disclosure.

For general bugs (not security-sensitive), use the public [GitHub Issues](https://github.com/Ai-Whisperers/paragu-ai-builder/issues) tracker.

---

## Scope

### In scope

- The application code under `web/` (Next.js app, API routes, middleware, admin dashboard)
- Tenant configuration under `sites/` (schema validation, injection vectors)
- The composition engine and section rendering
- Integration adapters (`web/lib/integrations/*`) — CRM, booking, email, analytics
- Supabase schema + RLS policies (`web/db/migrations/*`)
- Observability pipeline (log redaction effectiveness)
- Compliance templates (`src/compliance/*`)

### Out of scope

- Third-party services the app integrates with (Supabase, Cloudflare, Sentry, Axiom, HubSpot, Calendly, Mailchimp, GA4). Report those to their respective security teams.
- Self-hosted instances / forks run outside our deployment.
- Known accepted risks documented here (see [Known risks](#known-risks) below).
- Security issues in archived content (`docs/archive/*`) that don't reflect current deployments.

---

## Supported versions

The project is pre-1.0 and ships from `Main`. Only the current `Main` is security-supported. Old commits on merged feature branches are not patched.

---

## Architectural invariants (security-relevant)

Enforced by tests and lint rules — see [`ARCHITECTURE.md § architectural invariants`](./ARCHITECTURE.md#5-architectural-invariants):

1. **Every Supabase query filters by `business_id`.** Multi-tenant isolation is non-negotiable. Enforced by `web/tests/unit/scoped-query-audit.test.ts`. If you find a query that bypasses `scopedQueries()`, treat as security issue.
2. **Service-role key never ships to the browser.** `SUPABASE_SERVICE_ROLE_KEY` is server-only. Anon/publishable keys are RLS-gated.
3. **PII redaction on every log line.** `web/lib/obs/redact.ts` sanitises emails, JWTs, bearer tokens, card numbers. If you find unredacted PII in logs, that's a fix.
4. **All API routes wrap through `withRequestLog`** — provides structured logging + ALS context. Bypassing it means no audit trail.
5. **CSP is canonical in `next.config.mjs`** — the middleware removed its duplicate (PR #32). Do not re-add a stricter CSP in middleware without coordinating with tenant font/image CSP requirements.

---

## Known risks

Tracked here for transparency. None are exploitable as shipped; all are documented tradeoffs or work-in-progress.

### Publishable Supabase keys in archived docs

Two Supabase publishable (anon) keys appear in `docs/archive/2026-04/QUICK_DEPLOY.md` and `docs/archive/2026-04/HOSTINGER_CLOUDFLARE_SETUP.md`:
- `okddppczckbjdotrxiev.supabase.co` + `sb_publishable_OUyNICSV7NILUISky8xVBA_zckVFHmP`
- `qyvokpribmbrosafntqa.supabase.co` + `sb_publishable_KQ-sFNr7r6AauoG0B4nyTg_vuPHmeCm`

These keys are **publishable (client-safe)** by Supabase design — RLS enforces at the DB layer. Risk: low. Action: verify which (if either) project is live and rotate the publishable key as a hygiene measure. See [`docs/archive/2026-04/README.md`](./docs/archive/2026-04/README.md).

### Admin dashboard auth

Admin routes (`/admin/*`) are gated by Supabase Auth in `web/middleware.ts`. When `NEXT_PUBLIC_SUPABASE_URL` is a placeholder (local dev), the auth check is bypassed. **Make sure production deployments have the real Supabase URL set** — a placeholder leaves `/admin` open.

### No rate limiting by default

`middleware.ts` applies rate-limiting via Upstash only when `UPSTASH_REDIS_REST_URL` is set. Absent that, `/api/*` routes accept unbounded requests. Enable in production for any tenant exposing forms or integrations.

### Assets bundled with Worker

Tenant images live in `sites/<slug>/assets/` and ship with the Worker bundle. Risk: a malicious image file can't execute, but a large bundle raises cold-start time. Planned mitigation: move to R2 or Cloudinary per [`docs/reference/ENV_VARS.md`](./docs/reference/ENV_VARS.md).

---

## Secure development practices

Contributors are expected to follow the practices in [`CONTRIBUTING.md`](./CONTRIBUTING.md). Security-specific reminders:

- **Never commit `.env*`, keys, tokens, or credentials.** Pre-commit hooks catch common patterns; do not bypass.
- **Use `scopedQueries()` for every tenant-table access.** The audit test will fail otherwise.
- **Validate all API input with Zod.** Boundary validation is the only place untrusted input enters trusted code.
- **Sanitize HTML** via `web/lib/security/sanitize.ts` before rendering any user-provided content.
- **Redact before logging** any user-provided field.
- **Run `npm audit` on dependency changes.** Fix high/critical severities before merging.

---

## Response process

Upon receiving a vulnerability report:

1. Acknowledge within 5 business days.
2. Assess severity (CVSS 3.1).
3. For critical/high: patch + deploy within 14 days; coordinate disclosure with reporter.
4. For medium/low: patch in the next regular release cycle.
5. Credit the reporter publicly (in `CHANGELOG.md` under Security) unless anonymity is requested.

---

_Last reviewed: April 2026._

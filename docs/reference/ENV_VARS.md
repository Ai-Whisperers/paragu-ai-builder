# Environment Variables

All env vars are read through the validated accessor at [`web/lib/env.ts`](../../web/lib/env.ts) — reading `process.env.FOO` directly in application code is an anti-pattern. The accessor:

- Fails fast server-side if a required var is missing
- Degrades gracefully client-side (logs error, returns empty string) for `NEXT_PUBLIC_*` vars
- Provides type-safe, assertion-free access (no `!` needed)
- Evaluates lazily (some vars only resolve when first read)

```ts
import { env } from '@/lib/env'
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
```

Related:
- [`/docs/how-to/deploy.md`](../how-to/deploy.md) — how to set these in production (Wrangler secrets, Cloudflare vars)
- [`/docs/observability/README.md`](../observability/README.md) — observability-specific env
- [`/CONTRIBUTING.md#setup`](../../CONTRIBUTING.md#setup) — local dev setup

---

## Required

| Var | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | build + runtime | Supabase project URL. Public (visible to browser). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` _or_ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | build + runtime | Supabase anon/publishable key. Public; RLS-protected. Accessor accepts either name. |
| `SUPABASE_SERVICE_ROLE_KEY` | runtime (server only) | Supabase service-role key. **Secret.** Bypasses RLS. Never expose to browser. |

Missing any of these in production → app boots but returns 500s on first DB access.

## Application

| Var | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` _or_ `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Canonical URL of the builder app root. Used in sitemap, OG tags, Sentry release identifiers. |
| `NODE_ENV` | `development` | Next.js sets this automatically in builds. |

## Monitoring (optional)

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Enables Sentry. Absent → silent no-op. |
| `SENTRY_TRACES_SAMPLE_RATE` | Server-side perf trace sample rate (default 0.1). |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Browser-side perf trace sample rate (default 0.1). |
| `NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_RATE` | Browser session-replay sample rate (default 0.1). |

See [`/docs/observability/tracing.md`](../observability/tracing.md).

## Logging (optional)

| Var | Default | Purpose |
|---|---|---|
| `LOG_LEVEL` | `info` | `debug` \| `info` \| `warn` \| `error` |
| `LOG_FORMAT` | `json` (prod) / `pretty` (dev) | Output shape |
| `SLOW_REQUEST_THRESHOLD_MS` | `1000` | Emits `Slow request detected` log above this |
| `SLOW_QUERY_THRESHOLD_MS` | `1000` | Emits `Slow query detected` log above this |
| `DEBUG` | `false` | Extra diagnostic logging. `true` \| `1` enables. |

See [`/docs/observability/logging.md`](../observability/logging.md).

## Analytics Engine (optional — only for querying from scripts)

| Var | Purpose |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Required to hit the Analytics Engine SQL API |
| `CLOUDFLARE_API_TOKEN` | Required to hit the Analytics Engine SQL API |

Runtime metric writes use the Workers binding declared in `wrangler.toml` — no env var needed on the app side.

## Rate limiting (optional)

| Var | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL` | When set, `middleware.ts` applies sliding-window rate limits to `/api/*` |
| `UPSTASH_REDIS_REST_TOKEN` | Required when URL is set |

Absent → rate limiter is disabled (fine for dev + low-traffic tenants).

## Image storage (optional)

| Var | Purpose |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | If using Cloudinary for image hosting |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Currently tenant assets are served from `sites/<slug>/assets/` (bundled with the Worker). Cloudinary vars are scaffolded for a future migration.

---

## Setting secrets in production

Runtime secrets → Cloudflare Workers:

```bash
cd web
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put NEXT_PUBLIC_SENTRY_DSN
# ... etc
```

Build-time public vars → `web/.env` (committed safely; values are placeholders) or CI build environment.

Local dev → `web/.env.local` (gitignored).

The deploy guide ([`/docs/how-to/deploy.md`](../how-to/deploy.md)) has the full walkthrough.

---

## Adding a new env var

1. Add it to [`web/lib/env.ts`](../../web/lib/env.ts) using the existing helpers (`requireEnv`, `optionalEnv`, `optionalEnvOrUndefined`, `boolEnv`).
2. Choose the right scope:
   - `NEXT_PUBLIC_*` prefix → browser-visible. Only use for non-secret values.
   - No prefix → server-only. Default for secrets.
3. Add a row to the relevant table above.
4. Add an entry to `web/.env.example` with a placeholder value and a comment.
5. If required in production: update the deploy guide's "Phase 3 — Environment reference" table.

Never read `process.env.FOO` directly — always go through `env.FOO`. This keeps env handling type-safe, testable, and consistently error-reported.

---

_Generated from `web/lib/env.ts` on 2026-04-20. Regenerate when the schema changes._

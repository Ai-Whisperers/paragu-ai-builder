# How to deploy

The canonical deployment target is **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare), with **Supabase** as the database and **Cloudflare DNS** for custom domains. This guide covers a fresh deploy end-to-end.

An alternative **VPS (Docker + Nginx)** path exists — see [§ VPS alternative](#vps-alternative) — used when you need a runtime without Cloudflare Workers' size/CPU limits.

Supersedes: the former root-level `QUICK_DEPLOY.md`, `CLOUDFLARE_DEPLOY.md`, `HOSTINGER_CLOUDFLARE_SETUP.md`, and `docs/DEPLOYMENT.md`. All four are now stubs pointing here.

---

## Prerequisites

- Node 20+
- A GitHub account with access to `Ai-Whisperers/paragu-ai-builder`
- A **Supabase** account (free tier suffices)
- A **Cloudflare** account (free tier suffices)
- Optional: a registered domain pointed at Cloudflare nameservers

---

## Phase 0 — Supabase setup (≈5 min)

### 1. Create the project

1. [https://app.supabase.com](https://app.supabase.com) → **New project**
2. Name: `paragu-ai-builder` (or your own)
3. Region: closest to your users — `South America (São Paulo)` for Paraguay
4. Plan: Free

### 2. Run migrations

The repo ships migrations under `web/db/migrations/`:

```bash
cd web
npx supabase db push
```

Or paste each file manually into **Supabase Dashboard → SQL Editor → New Query** in numeric order (`001_*`, `002_*`, `003_properties_table.sql`, `004_properties_table.sql`, `005_subscriptions_and_data_requests.sql`).

### 3. Collect the keys

**Supabase Dashboard → Project Settings → API**:

| Key | Env var |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon public` / publishable | `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) |
| `service_role` secret | `SUPABASE_SERVICE_ROLE_KEY` — **keep secret** |

Put them in `web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

> **Never commit `.env*`.** The `service_role` key bypasses RLS and must stay server-side.

---

## Phase 1 — Deploy to Cloudflare Workers (≈5 min)

### 1. Install + authenticate Wrangler

```bash
cd web
npm install
npx wrangler login
```

### 2. Set runtime secrets

Build-time public vars live in `web/.env`. **Runtime secrets** go to Cloudflare via `wrangler secret`:

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Paste the service-role value when prompted
```

Public vars visible at runtime live in `wrangler.toml`:

```toml
[vars]
NEXT_PUBLIC_SITE_URL = "https://your-domain.com"
```

Observability secrets (optional but recommended):

```bash
npx wrangler secret put NEXT_PUBLIC_SENTRY_DSN
npx wrangler secret put AXIOM_TOKEN    # if Axiom Logpush is configured
```

### 3. Build + deploy

```bash
# Production
npm run deploy:cloudflare:prod

# Staging
npm run deploy:cloudflare:staging

# Preview locally (uses Wrangler's local runtime)
npm run preview:cloudflare
```

The production deploy publishes to `paragu-ai-builder.<account>.workers.dev` and (once a custom domain is configured in step 4) to your custom domain.

### 4. Custom domain

**Cloudflare Dashboard → Workers & Pages → `paragu-ai-builder` → Custom Domains → Add Custom Domain**

1. Enter your apex domain (e.g. `nexaparaguay.com`) and/or `www` subdomain.
2. Cloudflare automatically provisions SSL and creates the necessary DNS records if the domain is on the same account.
3. For tenant hostnames (one Worker serving many custom domains), add each tenant domain as its own Custom Domain. [`middleware.ts`](../../web/middleware.ts) maps `host` → tenant slug.

If your domain is on another registrar:

| Type | Name | Content | Proxy | TTL |
|---|---|---|---|---|
| CNAME | @ | `paragu-ai-builder.<account>.workers.dev` | Proxied | Auto |
| CNAME | www | `paragu-ai-builder.<account>.workers.dev` | Proxied | Auto |

> Cloudflare will complain about CNAME on the apex — use their CNAME flattening (automatic on their DNS) or switch nameservers to Cloudflare.

### 5. Verify

```bash
# Worker dev URL
curl -s -o /dev/null -w "%{http_code}" https://paragu-ai-builder.<account>.workers.dev

# Custom domain
curl -s -o /dev/null -w "%{http_code}" https://your-domain.com

# Tenant route
curl -s -o /dev/null -w "%{http_code}" https://your-domain.com/s/es/nexa-paraguay

# Health probe (deep check verifies DB reachable)
curl https://your-domain.com/api/health?deep=1

# Tail logs
npx wrangler tail
```

A clean deploy returns `200` on every route above and `{"status":"ok"}` on `/api/health?deep=1`.

---

## Phase 2 — Post-deploy checklist

Before announcing the launch:

- [ ] `/api/health?deep=1` returns `200` with `db: "reachable"`
- [ ] `/admin` redirects unauthenticated users to `/login`
- [ ] At least one tenant renders fonts correctly (CSP is not blocking Google Fonts — see PR #32)
- [ ] `robots.txt` + `sitemap.xml` accessible per tenant (`/s/<locale>/<slug>/robots.txt`)
- [ ] Sentry receives a test event (`curl -X POST /api/diagnostics?sentry=test` if enabled)
- [ ] Integration adapters resolve (HubSpot / Calendly / Mailchimp / GA4) — verify via `/api/diagnostics`
- [ ] Lighthouse CI passes the budget set in `web/lighthouserc.json`

For the pre-deploy developer checklist (tests, typecheck, etc.) see [`web/docs/DEPLOYMENT_CHECKLIST.md`](../../web/docs/DEPLOYMENT_CHECKLIST.md).

---

## Phase 3 — Environment reference

| Var | Scope | Required | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | build + runtime | yes | Browser + server; public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | build + runtime | yes | Public; RLS-protected |
| `SUPABASE_SERVICE_ROLE_KEY` | runtime | yes | Secret; bypasses RLS |
| `NEXT_PUBLIC_SITE_URL` | build + runtime | yes | Canonical URL for the builder root |
| `NEXT_PUBLIC_SENTRY_DSN` | build + runtime | no | Absent ⇒ silent no-op |
| `AXIOM_TOKEN` | runtime | no | Required only if Axiom Logpush is live |
| `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN` | runtime | no | Enables middleware rate-limit |

Full schema: [`web/lib/env.ts`](../../web/lib/env.ts) (Zod-validated at boot).

---

## Troubleshooting

### Deploy fails — `compatibility_date` error

`wrangler.toml` must set `compatibility_date = "2025-04-01"` or later for `process.env` support. Update and redeploy.

### Deploy fails — bundle too large

Cloudflare Workers has a 1 MB (free) / 10 MB (paid) compressed script limit. If bundled, check for:
- Unused server dependencies in `package.json` (run `npx depcheck`)
- Missing `runtime: 'edge'` on dynamic API routes
- Large static JSON imported at module scope

If the worker can't be slimmed, fall back to [§ VPS alternative](#vps-alternative).

### 521 "Web Server is Down" from Cloudflare

The Worker is deployed but a fetch-origin / custom-domain config is pointing at a dead VPS. Remove stale DNS records or re-associate the Worker with the domain.

### Google Fonts blocked / tenants showing fallback fonts

The `middleware.ts` CSP must allow `fonts.googleapis.com` + `fonts.gstatic.com`. The canonical CSP is in `next.config.mjs → headers()`. If you see CSP violations in DevTools, check no code path overrides it. (This was PR #32's fix.)

### Supabase `Connection refused` from Worker

Verify `NEXT_PUBLIC_SUPABASE_URL` matches the project URL exactly (no trailing slash). Check Supabase → Project Settings → API for the current URL. Workers have egress allowed by default; no firewall config needed.

### Migration order drift

If `npx supabase db push` errors on a later migration, the DB state is out of sync. Either:
- `npx supabase db reset` on a staging project + re-run
- Manually apply the missing migration via SQL Editor

---

## VPS alternative

For deployments that can't fit Cloudflare Workers' limits (heavy ML workloads, custom native deps, image processing), the repo supports a Docker + Nginx deploy on any Linux VPS. This was the original stack; Cloudflare is now canonical.

**High-level steps:**

1. Provision a VPS (Hostinger KVM 2 at ~$7/mo works; any Ubuntu 22.04 box with 2 vCPU + 8 GB RAM suffices).
2. Install Docker.
3. Build the production image:
   ```bash
   cd web
   npm run build
   docker build -f Dockerfile.prod -t paragu-ai-builder:latest .
   ```
4. Copy the image + `sites/` + `src/` dirs to the VPS, mount an `.env` file with the same vars as § Phase 3.
5. Run Nginx as a reverse proxy to the container on `:3000`.
6. Point your domain at the VPS IP via Cloudflare DNS (Proxied orange-cloud for CDN + SSL).

A ready-made deploy script is in `scripts/deploy-hostinger.sh.template` _(planned)_. The archived [`HOSTINGER_CLOUDFLARE_SETUP.md`](../archive/2026-04/HOSTINGER_CLOUDFLARE_SETUP.md) has the full historical walkthrough — note it contains stale Supabase project refs that must not be reused.

**When to choose VPS over Workers:** image-heavy pipelines, PDF generation, binary deps. For everything else, Workers is cheaper, faster, and global-edge.

---

## Per-tenant DNS cutover

For a brand-new tenant domain:

1. Verify the tenant has a `sites/<slug>/site.json` with `hostnames: ["example.com"]` deployed.
2. Add `example.com` as a Custom Domain on the Worker (step 4 above).
3. If the previous site lived elsewhere, prepare the cutover:
   - Lower TTL on old DNS to 300s, wait 1×TTL.
   - Flip the `A`/`CNAME` records to Cloudflare.
   - Verify with `dig example.com +short` from multiple locations.
   - Restore TTL to 3600s after 24 h.
4. Test the tenant-scoped health: `curl https://example.com/api/health?deep=1`.

For tenants with staging (e.g. `staging.example.com`), use the staging worker (`npm run deploy:cloudflare:staging`) and map the staging subdomain there.

A per-tenant cutover example lives at [`sites/nexa-paraguay/docs/DNS.md`](../../sites/nexa-paraguay/docs/DNS.md).

---

## Costs (April 2026)

| Service | Tier | Cost | Note |
|---|---|---|---|
| Cloudflare Workers | Free | $0 | 100k requests/day |
| Cloudflare Workers | Paid | $5/mo | 10 M requests, higher CPU budget |
| Supabase | Free | $0 | 500 MB DB, enough for early tenants |
| Supabase | Pro | $25/mo | 8 GB DB, backups, compute |
| Sentry | Free | $0 | 5k events/month |
| Axiom | Free | $0 | Optional structured log sink |
| VPS alternative | KVM 2 | ~$7/mo | Only if Workers won't fit |

Cloudflare's free tier is generous enough for all current tenants combined. Upgrade when request volume or CPU time exceeds limits.

---

## What changed from the old docs

- **Four docs collapsed into one** (`QUICK_DEPLOY.md`, `CLOUDFLARE_DEPLOY.md`, `HOSTINGER_CLOUDFLARE_SETUP.md`, `docs/DEPLOYMENT.md`). The originals are in [`docs/archive/2026-04/`](../archive/2026-04/).
- **All Supabase credentials replaced with placeholders.** The old docs contained two different project URLs + publishable keys hard-coded. Those references stay in the archive for historical context but are stale and should not be reused.
- **Cloudflare Pages → Workers.** The repo now deploys to Workers via OpenNext, not Pages. Older docs that say "Cloudflare Pages" are outdated.

---

_Last reviewed: April 2026._

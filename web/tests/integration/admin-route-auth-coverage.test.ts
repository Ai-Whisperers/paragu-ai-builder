/**
 * Static-analysis test: every admin/internal API route must import an
 * auth helper. Catches the bug class we found 5 instances of during the
 * #392 audit (routes shipped without checkAdmin/requireAdmin).
 *
 * Closes BUG_HUNT_500 part of #460 — a regression test that would have
 * flagged each of those bugs at PR time.
 *
 * Strategy: scan the file source for an import of checkAdmin /
 * requireAdmin / isAdminEmail, OR an inline `auth.getUser()` flow. If
 * neither is present, fail with a descriptive message naming the route.
 *
 * Public routes that intentionally have no auth are listed in
 * `PUBLIC_ROUTE_ALLOWLIST` below. Add to that list (with a brief reason)
 * when you intentionally ship a public surface.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, join } from 'path'

// __dirname → web/tests/integration; one level up → web/tests; two → web/
const WEB_ROOT = resolve(__dirname, '../..')

function findRouteFiles(dir: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry)
    if (statSync(abs).isDirectory()) {
      findRouteFiles(abs, results)
    } else if (entry === 'route.ts') {
      results.push(abs)
    }
  }
  return results
}

/**
 * Routes that are public on purpose. Add new entries with a reason.
 *
 * Convention: prefer to ship admin routes; only allowlist when the
 * route is genuinely customer-facing or platform-wide infra.
 */
const PUBLIC_ROUTE_ALLOWLIST: Array<{ path: string; reason: string }> = [
  { path: 'app/api/leads/route.ts', reason: 'Public lead-submission endpoint — fired by marketing forms.' },
  { path: 'app/api/analytics/track/route.ts', reason: 'POST is public (browser ingest); GET is admin-gated inside the file.' },
  { path: 'app/api/health/route.ts', reason: 'Liveness probe — must be reachable without auth.' },
  { path: 'app/api/diagnostics/route.ts', reason: 'Self-test endpoint; no sensitive data exposed.' },
  { path: 'app/api/activity/route.ts', reason: 'Public homepage activity ticker — only returns curated REAL_CLIENTS.' },
  { path: 'app/api/newsletter/route.ts', reason: 'Public newsletter signup.' },
  { path: 'app/api/data-request/route.ts', reason: 'Public GDPR/data-request submission.' },
  { path: 'app/api/calendly-webhook/route.ts', reason: 'Webhook authenticated by Calendly signature, not session.' },
  { path: 'app/api/whatsapp-webhook/route.ts', reason: 'Webhook authenticated by Meta signature, not session.' },
  { path: 'app/api/webhooks/pagopar/route.ts', reason: 'Webhook authenticated by Pagopar SHA-1 token.' },
  { path: 'app/api/webhooks/resend/route.ts', reason: 'Webhook authenticated by Svix HMAC signature.' },
  { path: 'app/api/hubspot-cron-sync/route.ts', reason: 'Cron-triggered, gated by CRON_SECRET header.' },
  { path: 'app/api/mailchimp-journey-import/route.ts', reason: 'Cron-triggered, gated by CRON_SECRET header.' },
  // Cron routes — gated by CRON_SECRET, not by user session.
  { path: 'app/api/cron/leads-digest/route.ts', reason: 'Cron route gated by CRON_SECRET header.' },
  { path: 'app/api/cron/sitemap-ping/route.ts', reason: 'Cron route gated by CRON_SECRET header.' },
  { path: 'app/api/cron/commerce-email-flush/route.ts', reason: 'Cron route gated by CRON_SECRET header.' },
  { path: 'app/api/cron/commerce-abandoned-cart/route.ts', reason: 'Cron route gated by CRON_SECRET header.' },
  { path: 'app/api/cron/commerce-reconcile-pending/route.ts', reason: 'Cron route gated by CRON_SECRET header.' },
  // Storefront routes — public per-tenant by design (cart, checkout, etc.).
  // Authentication, when needed, happens at the order/payment level.
  ...[
    'app/api/storefront/[site]/cart/route.ts',
    'app/api/storefront/[site]/cart/items/route.ts',
    'app/api/storefront/[site]/cart/items/[itemId]/route.ts',
    'app/api/storefront/[site]/products/route.ts',
    'app/api/storefront/[site]/products/[slug]/route.ts',
    'app/api/storefront/[site]/checkout/route.ts',
    'app/api/storefront/[site]/orders/[id]/route.ts',
    'app/api/storefront/[site]/discount/route.ts',
  ].map((path) => ({ path, reason: 'Public storefront — per-tenant customer-facing.' })),
  // Properties routes — public listings page consumes these.
  { path: 'app/api/properties/route.ts', reason: 'Public listings consumed by tenant pages.' },
  { path: 'app/api/properties/[id]/route.ts', reason: 'Public listings consumed by tenant pages.' },
  // Subscriptions self-service — gated by per-customer subscription token, not admin.
  { path: 'app/api/subscriptions/pause/route.ts', reason: 'Self-service via per-customer token in payload.' },
  { path: 'app/api/subscriptions/skip/route.ts', reason: 'Self-service via per-customer token in payload.' },
  { path: 'app/api/subscriptions/preferences/route.ts', reason: 'Self-service via per-customer token in payload.' },
  // Generate route — API client (build pipeline), gated by API key in env, not session.
  { path: 'app/api/generate/route.ts', reason: 'Build-pipeline endpoint gated by GENERATE_API_KEY.' },
]

const ALLOWED = new Set(PUBLIC_ROUTE_ALLOWLIST.map((e) => e.path.replace(/\\/g, '/')))

const AUTH_PATTERNS = [
  /\bcheckAdmin\b/,
  /\brequireAdmin\b/,
  /\bisAdminEmail\b/,
  /\brequireAdminUser\b/,  // commerce admin-auth helper (gated on isAdminEmail too as of this PR)
]

describe('admin route auth coverage', () => {
  it('every API route either imports an auth helper or is in the public allowlist', async () => {
    const routeFiles = findRouteFiles(join(WEB_ROOT, 'app/api'))

    const violations: Array<{ path: string }> = []

    for (const abs of routeFiles) {
      const rel = abs.slice(WEB_ROOT.length + 1)
      if (ALLOWED.has(rel)) continue

      const src = readFileSync(abs, 'utf-8')
      const hasAuthHelper = AUTH_PATTERNS.some((re) => re.test(src))
      if (!hasAuthHelper) {
        violations.push({ path: rel })
      }
    }

    if (violations.length > 0) {
      const list = violations
        .map((v) => `  - ${v.path}`)
        .join('\n')
      throw new Error(
        `These API routes have no auth check and are not in the public allowlist:\n${list}\n\n` +
          `Either:\n` +
          `  (a) wire checkAdmin()/requireAdmin() into the route, OR\n` +
          `  (b) add the route to PUBLIC_ROUTE_ALLOWLIST in this test with a reason for why it's public.\n\n` +
          `This test exists because we found 6 broken-auth bugs during the #392 audit.`,
      )
    }

    expect(violations).toHaveLength(0)
  })
})

/**
 * Companion test to the auth coverage above. Locks in #392 (every API
 * route wrapped in withRequestLog) so it can't regress when someone adds
 * a new route. No allowlist — every route should be wrapped, period.
 *
 * Recognized as wrapped if the source mentions `withRequestLog`. Both
 * the import and the call site use the same identifier, so this catches
 * either form (`export const POST = withRequestLog(...)` or
 * `withRequestLog<{ id: string }>(async (...) => {...})`).
 */
describe('request-log middleware coverage', () => {
  it('every API route is wrapped in withRequestLog', () => {
    const routeFiles = findRouteFiles(join(WEB_ROOT, 'app/api'))
    const violations: string[] = []

    for (const abs of routeFiles) {
      const rel = abs.slice(WEB_ROOT.length + 1)
      const src = readFileSync(abs, 'utf-8')
      if (!/\bwithRequestLog\b/.test(src)) {
        violations.push(rel)
      }
    }

    if (violations.length > 0) {
      const list = violations.map((v) => `  - ${v}`).join('\n')
      throw new Error(
        `These API routes are NOT wrapped in withRequestLog:\n${list}\n\n` +
          `Wrap each with the pattern from docs/REQUEST_LOG_AUDIT.md:\n\n` +
          `  export const POST = withRequestLog(async (req, { log }) => { ... })\n\n` +
          `withRequestLog gives every request a request-id, trace context,\n` +
          `perf tracker, and a structured 500 fallback. See #392 audit.`,
      )
    }

    expect(violations).toHaveLength(0)
  })
})

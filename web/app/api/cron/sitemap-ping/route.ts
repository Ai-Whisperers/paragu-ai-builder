import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

/**
 * Pings search engines to re-fetch our sitemap. Useful after bulk content
 * changes (new blog posts, new city/vertical landings, new case studies).
 *
 * Why a cron and not a deploy hook: pinging on every push spams the
 * search engines (and they ignore us). Once-a-week or on-demand is the
 * sweet spot per Google's webmaster guidelines.
 *
 * Bing/Yandex still accept ping URLs. Google deprecated the ping endpoint
 * in 2023 (returns 200 but no longer triggers crawl) — the canonical way
 * is to register the sitemap in Search Console once and let them re-crawl
 * on their schedule. We keep the Google ping for completeness; it's a
 * no-op but doesn't hurt.
 *

 * Schedule (UTC — see docs/runbooks/CRON_STRATEGY.md for the canonical table):
 *   POST https://paragu-ai.com/api/cron/sitemap-ping
 *   x-cron-secret: <CRON_SECRET>
 *   Crontab: 0 11 * * 1   (Mondays 11:00 UTC = 8:00 Asunción standard time)
 */

const SITEMAP_URL = 'https://paragu-ai.com/sitemap.xml'

const PING_TARGETS = [
  // Bing still respects this endpoint as of writing.
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  // Google's endpoint is deprecated but harmless. Real Google indexing is
  // configured manually via Search Console — this is opportunistic.
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
]

export const POST = withRequestLog(async (request, { log }) => {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const results = await Promise.all(
    PING_TARGETS.map(async (url) => {
      try {
        const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5_000) })
        return { url, status: res.status, ok: res.ok }
      } catch (err) {
        return {
          url,
          status: 0,
          ok: false,
          error: err instanceof Error ? err.message : 'unknown',
        }
      }
    }),
  )

  log.info('cron.sitemap_ping.done', { results })
  return NextResponse.json({ ok: true, sitemap: SITEMAP_URL, results })
})

// GET also supported for manual one-off pinging from a browser by an admin.
export const GET = POST

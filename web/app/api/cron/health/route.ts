/**
 * Cron health endpoint. Returns a snapshot of:
 *   - which env vars each cron route depends on are configured
 *   - the current server time (so an external monitor can correlate
 *     this against expected schedules in CRON_STRATEGY.md)
 *   - the route-list (so a human can eyeball that all 5 + this one exist)
 *
 * Schedule (UTC): hourly via the same crontab that runs the others. See
 * docs/runbooks/CRON_STRATEGY.md. Protected by CRON_SECRET header.
 *
 * Closes BUG_HUNT_500 #436.
 *
 * Why this design (vs writing heartbeats to a `cron_runs` table):
 * heartbeats need a schema migration + every cron updated to write one.
 * This route is the simpler version: it tells you "what would prevent
 * each cron from working" without any DB writes. If a cron silently
 * fails, this endpoint tells you the probable reason (missing env).
 */
import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

interface CronCheck {
  path: string
  schedule: string
  requiredEnv: string[]
  status: 'ok' | 'missing_env'
  missing: string[]
}

const CRONS: Array<Omit<CronCheck, 'status' | 'missing'>> = [
  {
    path: '/api/cron/leads-digest',
    schedule: '0 12 * * * (UTC, daily 9am Asunción)',
    requiredEnv: ['CRON_SECRET', 'RESEND_API_KEY', 'LEADS_DIGEST_FROM', 'LEADS_DIGEST_TO'],
  },
  {
    path: '/api/cron/sitemap-ping',
    schedule: '0 11 * * 1 (UTC, Mon 8am Asunción)',
    requiredEnv: ['CRON_SECRET'],
  },
  {
    path: '/api/cron/commerce-email-flush',
    schedule: '*/5 * * * * (UTC, every 5 min)',
    requiredEnv: ['CRON_SECRET', 'RESEND_API_KEY', 'COMMERCE_EMAIL_FROM'],
  },
  {
    path: '/api/cron/commerce-abandoned-cart',
    schedule: '0 */4 * * * (UTC, every 4 h)',
    requiredEnv: ['CRON_SECRET'],
  },
  {
    path: '/api/cron/commerce-reconcile-pending',
    schedule: '0 * * * * (UTC, hourly)',
    requiredEnv: ['CRON_SECRET'],
  },
  {
    path: '/api/cron/commerce-merchant-digest',
    schedule: '0 11 * * * (UTC, daily 08:00 Asunción)',
    requiredEnv: ['CRON_SECRET', 'RESEND_API_KEY', 'COMMERCE_EMAIL_FROM'],
  },
  {
    path: '/api/cron/commerce-prune-search-events',
    schedule: '17 3 * * * (UTC, daily 03:17)',
    requiredEnv: ['CRON_SECRET'],
  },
]

function envCheck(required: string[]): { status: 'ok' | 'missing_env'; missing: string[] } {
  const missing = required.filter((k) => !process.env[k])
  return { status: missing.length === 0 ? 'ok' : 'missing_env', missing }
}

export const POST = withRequestLog(async (request, { log }) => {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const checks: CronCheck[] = CRONS.map((c) => ({ ...c, ...envCheck(c.requiredEnv) }))
  const anyMissing = checks.some((c) => c.status !== 'ok')

  log.info('cron.health.report', {
    healthy: checks.filter((c) => c.status === 'ok').length,
    degraded: checks.filter((c) => c.status === 'missing_env').length,
  })

  return NextResponse.json(
    {
      ok: !anyMissing,
      now: new Date().toISOString(),
      crons: checks,
    },
    { status: anyMissing ? 503 : 200 },
  )
})

// Allow GET for one-off browser checks by an admin (CRON_SECRET still required).
export const GET = POST

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

/**
 * Prune old rows from `search_events` so the table doesn't grow unbounded.
 * The analytics consumer (`listTopSearches`) only looks at the last 30 days
 * and is capped at 5k rows anyway, so anything beyond the retention
 * window is dead weight. Keeping 90 days gives us a comfortable buffer
 * for any future longer-window query while still bounding storage.
 *
 * Schedule (UTC): daily at 03:17 — off the other cron peaks so it never
 * fights for the DB. See docs/runbooks/CRON_STRATEGY.md for the canonical
 * schedule table. Protected by CRON_SECRET header.
 */

const RETENTION_DAYS = 90

export const POST = withRequestLog(async (request, { log }) => {
  if (process.env.CRON_SECRET && request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let supabase
try { supabase = await createAdminClient() } catch {
  return NextResponse.json({ ok: false, reason: 'env_not_configured' }, { status: 200 })
}
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString()

  // Supabase delete() returns a count only when we set { count: 'exact' }.
  // The head option skips fetching the rows themselves.
  const { count, error } = await supabase
    .from('search_events')
    .delete({ count: 'exact' })
    .lt('created_at', cutoff)

  if (error) {
    log.error('cron.commerce_prune_search_events.failed', {
      error: error.message,
      cutoff,
    })
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  log.info('cron.commerce_prune_search_events.done', {
    deleted: count ?? 0,
    cutoff,
  })
  return NextResponse.json({ ok: true, deleted: count ?? 0, cutoff })
})

export const GET = POST

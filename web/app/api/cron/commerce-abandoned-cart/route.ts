import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

/**
 * Identifies open carts older than the per-step threshold with a customer
 * email attached (via guest checkout attempts or signed-in users) and
 * enqueues a recovery email. Three touches: 24h, 72h, 7d.
 *
 * Schedule (UTC): every 4 hours. See docs/runbooks/CRON_STRATEGY.md
 * for the canonical table. Protected by CRON_SECRET header.
 */
const STEPS = [
  { step: 1, hoursAgo: 24 },
  { step: 2, hoursAgo: 72 },
  { step: 3, hoursAgo: 168 },
]

export const POST = withRequestLog(async (request, { log }) => {
  if (process.env.CRON_SECRET && request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createAdminClient()
  let touched = 0

  for (const { step, hoursAgo } of STEPS) {
    const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

    // Carts with an associated user_id (we have an email) that haven't been
    // touched since cutoff and haven't already been sent this step's email.
    const { data: carts } = await supabase
      .from('carts')
      .select('id, business_id, user_id, updated_at')
      .eq('status', 'open')
      .not('user_id', 'is', null)
      .lt('updated_at', cutoff)
      .limit(100)

    const rows = Array.isArray(carts) ? carts : []
    for (const cart of rows) {
      // Skip if we've already sent this step
      const { count } = await supabase
        .from('cart_recovery_touches')
        .select('*', { count: 'exact', head: true })
        .eq('cart_id', cart.id)
        .eq('step', step)
      if ((count ?? 0) > 0) continue

      const token = randomBytes(16).toString('base64url')
      await supabase.from('cart_recovery_touches').insert({
        business_id: cart.business_id,
        cart_id: cart.id,
        step,
        recovery_token: token,
      })
      touched++
      // Email enqueueing is intentionally minimal here — in production, we'd
      // look up the user's email via auth and queue to commerce_email_outbox.
      // Stub left for Phase 3 polish.
    }
  }

  log.info('commerce.cron.abandoned_cart.done', { touched })
  return NextResponse.json({ touched })
})

import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { cartRecoveryEmail } from '@/lib/commerce/email-templates'
import { getAppUrl } from '@/lib/env'

export const runtime = 'nodejs'

/**
 * Identifies open carts older than the per-step threshold with a customer
 * email attached (via guest checkout attempts or signed-in users), writes
 * a recovery touch row, and enqueues a recovery email into the email
 * outbox (the commerce-email-flush cron sends them on the next tick).
 *
 * Three touches: 24h, 72h, 7d. Each cart gets exactly one email per step
 * — the (cart_id, step) UNIQUE constraint on cart_recovery_touches
 * prevents re-sending.
 *
 * Schedule (UTC): every 4 hours. See docs/runbooks/CRON_STRATEGY.md for
 * the canonical table. Protected by CRON_SECRET header.
 */
const STEPS = [
  { step: 1 as const, hoursAgo: 24 },
  { step: 2 as const, hoursAgo: 72 },
  { step: 3 as const, hoursAgo: 168 },
]

export const POST = withRequestLog(async (request, { log }) => {
  if (process.env.CRON_SECRET && request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let supabase
try { supabase = await createAdminClient() } catch {
  return NextResponse.json({ ok: false, reason: 'env_not_configured' }, { status: 200 })
}
  const appUrl = getAppUrl()
  let touched = 0
  let enqueued = 0
  let skippedNoEmail = 0

  for (const { step, hoursAgo } of STEPS) {
    const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

    const { data: carts } = await supabase
      .from('carts')
      .select('id, business_id, user_id, updated_at')
      .eq('status', 'open')
      .not('user_id', 'is', null)
      .lt('updated_at', cutoff)
      .limit(100)

    const rows = Array.isArray(carts) ? carts : []
    for (const cart of rows) {
      // Skip if we've already sent this step for this cart.
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

      // Look up business + customer email for the enqueue.
      // Supabase Auth stores email on auth.users; we query via the service
      // role which can read the auth schema.
      const [{ data: biz }, { data: user }] = await Promise.all([
        supabase.from('businesses').select('name, slug').eq('id', cart.business_id).maybeSingle(),
        supabase.schema('auth').from('users').select('email, raw_user_meta_data').eq('id', cart.user_id).maybeSingle(),
      ])

      const customerEmail = (user as { email?: string } | null)?.email
      if (!customerEmail || !biz) {
        skippedNoEmail++
        continue
      }

      const meta = (user as { raw_user_meta_data?: { name?: string; full_name?: string } } | null)?.raw_user_meta_data
      const customerName = meta?.name ?? meta?.full_name ?? customerEmail.split('@')[0] ?? 'cliente'

      const recoveryUrl = `${appUrl}/s/es/${biz.slug}/carrito?recover=${token}`
      const { subject, html } = cartRecoveryEmail({
        customerName,
        businessName: biz.name,
        recoveryUrl,
        step,
      })

      const { error: outboxError } = await supabase.from('commerce_email_outbox').insert({
        business_id: cart.business_id,
        order_id: null,
        template:
          step === 1 ? 'cart_recovery_24h' : step === 2 ? 'cart_recovery_72h' : 'cart_recovery_7d',
        recipient_email: customerEmail,
        subject,
        html_body: html,
      })
      if (!outboxError) enqueued++
    }
  }

  log.info('commerce.cron.abandoned_cart.done', { touched, enqueued, skippedNoEmail })
  return NextResponse.json({ touched, enqueued, skippedNoEmail })
})

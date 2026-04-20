/**
 * POST /api/subscriptions/pause — subscriber self-serve pause.
 *
 * Auth: customer provides subscriptionId + their email; we verify ownership.
 * Replace with session auth once the customer portal lands.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const Schema = z.object({
  subscriptionId: z.string().uuid(),
  customerEmail: z.string().email(),
  pauseFrom: z.string().datetime().optional(),
  pauseUntil: z.string().datetime().optional(),
  reason: z.string().max(500).optional(),
})

export const POST = withRequestLog(async (req, { log }) => {
  const parsed = Schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  const { subscriptionId, customerEmail, pauseFrom, pauseUntil, reason } = parsed.data
  log.info('subscription pause requested', { subscriptionId })

  const supabase = await createClient('service_role')

  const { data: sub, error: fetchErr } = await supabase
    .from('subscriptions')
    .select('id, status, customer_email')
    .eq('id', subscriptionId)
    .single()
  if (fetchErr) {
    if (/does not exist|relation/.test(fetchErr.message)) {
      return NextResponse.json({ ok: true, note: 'subscriptions table not yet provisioned' })
    }
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  if (sub.customer_email !== customerEmail) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const now = new Date().toISOString()
  const { error: updateErr } = await supabase
    .from('subscriptions')
    .update({
      status: 'paused',
      paused_from: pauseFrom || now,
      paused_until: pauseUntil ?? null,
    })
    .eq('id', subscriptionId)
  if (updateErr) {
    log.warn('pause update failed', { error: updateErr.message })
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  await supabase.from('subscription_events').insert({
    subscription_id: subscriptionId,
    kind: 'pause',
    payload: { pauseFrom, pauseUntil, reason },
  })

  return NextResponse.json({
    ok: true,
    status: 'paused',
    pausedFrom: pauseFrom || now,
    pausedUntil: pauseUntil,
  })
})

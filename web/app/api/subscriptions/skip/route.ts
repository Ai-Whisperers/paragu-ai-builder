/** POST /api/subscriptions/skip — skip a single week. */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const Schema = z.object({
  subscriptionId: z.string().uuid(),
  customerEmail: z.string().email(),
  weekStart: z.string().datetime(),
  reason: z.string().max(500).optional(),
})

export const POST = withRequestLog(async (req, { log }) => {
  const parsed = Schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  const { subscriptionId, customerEmail, weekStart, reason } = parsed.data
  log.info('subscription skip requested', { subscriptionId, weekStart })

  const supabase = await createClient('service_role')
  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('id, customer_email')
    .eq('id', subscriptionId)
    .single()
  if (error) {
    if (/does not exist|relation/.test(error.message)) {
      return NextResponse.json({ ok: true, note: 'subscriptions table not yet provisioned' })
    }
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  if (sub.customer_email !== customerEmail) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  await supabase.from('subscription_events').insert({
    subscription_id: subscriptionId,
    kind: 'skip_week',
    payload: { weekStart, reason },
  })

  return NextResponse.json({ ok: true, skipped: weekStart })
})

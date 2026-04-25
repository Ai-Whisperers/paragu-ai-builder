/** PATCH /api/subscriptions/preferences — update dietary/household/schedule. */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const Schema = z.object({
  subscriptionId: z.string().uuid(),
  customerEmail: z.string().email(),
  householdSize: z.number().int().positive().optional(),
  dietaryConstraints: z.array(z.string()).optional(),
  dislikes: z.array(z.string()).optional(),
  deliveryWindow: z.string().optional(),
})

export const PATCH = withRequestLog(async (req, { log }) => {
  const parsed = Schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  const { subscriptionId, customerEmail, ...prefs } = parsed.data
  log.info('subscription preferences updated', { subscriptionId })

  const supabase = await createClient('service_role')
  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('id, preferences, customer_email')
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

  const merged = { ...(sub.preferences || {}), ...prefs }
  const { error: updErr } = await supabase
    .from('subscriptions')
    .update({ preferences: merged })
    .eq('id', subscriptionId)
  if (updErr) {
    log.warn('preferences update failed', { error: updErr.message })
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  await supabase.from('subscription_events').insert({
    subscription_id: subscriptionId,
    kind: 'preferences_updated',
    payload: prefs,
  })

  return NextResponse.json({ ok: true, preferences: merged })
})

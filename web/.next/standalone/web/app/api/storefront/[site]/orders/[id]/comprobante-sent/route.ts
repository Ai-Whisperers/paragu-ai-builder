import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { createAdminClient } from '@/lib/supabase/admin'
import { recordOrderEvent } from '@/lib/commerce/order-events'

export const runtime = 'nodejs'

// Customer-facing — no auth. An abuser could only mark their own
// orders as "comprobante sent"; the admin still has to verify and
// hit "Confirmar pago recibido" manually. This endpoint is a UX
// signal, not a money-moving action.
const BodySchema = z.object({
  note: z.string().trim().max(500).optional(),
})

export const POST = withRequestLog<{ site: string; id: string }>(
  async (req, { log }, { site, id }) => {
    const business = await resolveBusinessBySlug(site)
    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    let json: unknown = {}
    try {
      json = await req.json()
    } catch {
      // Body is optional — empty body is the expected flow for the
      // "Ya envié el comprobante" button.
    }
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = await createAdminClient()
    // Stamp only if not already set — treat re-submissions as idempotent.
    const { data: updated, error } = await supabase
      .from('orders')
      .update({
        comprobante_sent_at: new Date().toISOString(),
        comprobante_note: parsed.data.note ?? null,
      })
      .eq('id', id)
      .eq('business_id', business.id)
      .is('comprobante_sent_at', null)
      .select('id, order_number')
      .maybeSingle()

    if (error) {
      log.error('commerce.comprobante_sent.update_failed', { orderId: id, error: error.message })
      return NextResponse.json({ error: 'update_failed' }, { status: 500 })
    }

    // If no row was updated, either the order doesn't exist or the
    // comprobante was already stamped. Both map to a 200 OK — the
    // customer clicked the button, their intent is recorded either
    // way, no reason to surface "already did that" as an error.
    if (updated) {
      await recordOrderEvent({
        businessId: business.id,
        orderId: id,
        eventType: 'comprobante_received',
        actorLabel: 'Cliente',
        note: parsed.data.note ?? null,
      })
    }
    log.info('commerce.comprobante_sent.recorded', {
      orderId: id,
      orderNumber: updated?.order_number,
      alreadyStamped: !updated,
    })

    return NextResponse.json({ ok: true })
  },
)

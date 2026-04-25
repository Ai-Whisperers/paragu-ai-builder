import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSaasPaymentLink, buildWhatsAppShareUrl } from '@/lib/billing/paragu-ai-saas'
import { getAppUrl } from '@/lib/env'

export const runtime = 'nodejs'

const BodySchema = z.object({
  subscriptionId: z.string().uuid(),
  planLabel: z.string().min(1).max(80),
  amountCents: z.number().int().positive().max(100_000_000),
  payerEmail: z.string().email(),
  payerName: z.string().min(1).max(200),
  payerPhone: z.string().min(6).max(30).optional(),
})

export const POST = withRequestLog<{ businessId: string }>(async (req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, business_id')
    .eq('id', parsed.data.subscriptionId)
    .eq('business_id', businessId)
    .maybeSingle()
  if (!sub) return NextResponse.json({ error: 'subscription_not_found' }, { status: 404 })

  const appUrl = getAppUrl()

  try {
    const link = await generateSaasPaymentLink({
      businessId,
      subscriptionId: parsed.data.subscriptionId,
      planLabel: parsed.data.planLabel,
      amountCents: parsed.data.amountCents,
      payerEmail: parsed.data.payerEmail,
      payerName: parsed.data.payerName,
      payerPhone: parsed.data.payerPhone,
      webhookUrl: `${appUrl}/api/webhooks/pagopar`,
      returnUrl: `${appUrl}/admin/billing/${businessId}/subscription`,
    })

    const whatsAppUrl = parsed.data.payerPhone
      ? buildWhatsAppShareUrl(parsed.data.payerPhone, link.url, parsed.data.planLabel)
      : null

    log.info('admin.saas.link_generated', {
      businessId,
      subscriptionId: parsed.data.subscriptionId,
      amountCents: parsed.data.amountCents,
    })

    return NextResponse.json({
      paymentUrl: link.url,
      hashPedido: link.hashPedido,
      orderNumber: link.orderNumber,
      whatsAppUrl,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'link_failed'
    if (message === 'paragu_ai_pagopar_not_configured') {
      return NextResponse.json({ error: 'paragu_ai_pagopar_not_configured' }, { status: 503 })
    }
    log.error('admin.saas.link_failed', err instanceof Error ? err : new Error(message))
    return NextResponse.json({ error: message }, { status: 500 })
  }
})

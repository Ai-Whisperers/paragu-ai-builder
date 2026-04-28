import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { generateSaasPaymentLink } from '@/lib/billing/paragu-ai-saas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: business } = await supabase
      .from('businesses')
      .select('name, email, phone')
      .eq('id', session.businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'business_not_found' }, { status: 404 })

    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id, plan_tier, plan_name, price_monthly')
      .eq('business_id', session.businessId)
      .eq('status', 'trialing')
      .order('created_at', { ascending: false })
      .limit(1)

    const sub = (subscriptions ?? [])[0]
    if (!sub) return NextResponse.json({ error: 'no_active_subscription' }, { status: 400 })

    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://paragu-ai.com'}/api/webhooks/pagopar`
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://paragu-ai.com'}/dashboard/${session.businessId}/billing`

    const link = await generateSaasPaymentLink({
      businessId: session.businessId,
      subscriptionId: sub.id,
      planLabel: sub.plan_name || `${sub.plan_tier} mensual`,
      amountCents: Math.round(sub.price_monthly * (sub.plan_tier === 'enterprise' ? 1 : 1)),
      payerEmail: session.email,
      payerName: session.name,
      payerPhone: business.phone || undefined,
      webhookUrl,
      returnUrl,
    })

    return NextResponse.json({ url: link.url, hash: link.hashPedido })
  } catch (err) {
    if (err instanceof Response) throw err
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('not_configured')) {
      return NextResponse.json({ error: 'payment_not_configured' }, { status: 503 })
    }
    return NextResponse.json({ error: 'internal', detail: message }, { status: 500 })
  }
}

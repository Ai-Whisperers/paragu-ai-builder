import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { getPlanPrice, listUpgradeOptions, listDowngradeOptions, calculateUpgradePrice } from '@/lib/portal/rates'
import { getFeatures } from '@/lib/portal/features'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id, plan_tier, status')
      .eq('business_id', session.businessId)
      .order('created_at', { ascending: false })
      .limit(1)

    const current = (subscriptions ?? [])[0]
    const currentTier = (current?.plan_tier as 'free' | 'starter' | 'professional' | 'enterprise') ?? 'free'

    return NextResponse.json({
      currentTier,
      currentFeatures: getFeatures(currentTier),
      upgradeOptions: listUpgradeOptions(currentTier).map((tier) => ({
        tier,
        price: getPlanPrice(tier),
        upgradePriceCents: calculateUpgradePrice(currentTier, tier),
        features: getFeatures(tier),
      })),
      downgradeOptions: listDowngradeOptions(currentTier).map((tier) => ({
        tier,
        price: getPlanPrice(tier),
        features: getFeatures(tier),
      })),
    })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireTenant()
    const body = await request.json()
    const { targetTier } = body as { targetTier: string }

    const validTiers = ['free', 'starter', 'professional', 'enterprise']
    if (!validTiers.includes(targetTier)) {
      return NextResponse.json({ error: 'invalid_tier' }, { status: 400 })
    }

    const supabase = await createClient('service_role')

    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id, plan_tier')
      .eq('business_id', session.businessId)
      .order('created_at', { ascending: false })
      .limit(1)

    const current = (subscriptions ?? [])[0]
    if (!current) {
      return NextResponse.json({ error: 'no_subscription' }, { status: 400 })
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({
        plan_tier: targetTier,
        plan_name: targetTier.charAt(0).toUpperCase() + targetTier.slice(1),
        price_monthly: getPlanPrice(targetTier as never).monthlyCents,
      })
      .eq('id', current.id)

    if (error) {
      return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 })
    }

    await supabase.from('portal_notifications').insert({
      business_id: session.businessId,
      type: 'billing',
      title: 'Plan actualizado',
      body: `Tu plan cambió a ${targetTier}. Ya podés usar las nuevas funciones.`,
    })

    return NextResponse.json({ ok: true, newTier: targetTier })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

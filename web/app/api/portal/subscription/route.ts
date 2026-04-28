import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id, plan_tier, plan_name, price_monthly, status, trial_ends_at, current_period_end, canceled_at, created_at')
      .eq('business_id', session.businessId)
      .order('created_at', { ascending: false })
      .limit(1)

    const subscription = (subscriptions ?? [])[0] ?? null
    let payments: unknown[] = []

    if (subscription) {
      const { data: paymentData } = await supabase
        .from('payments')
        .select('id, amount, currency, status, paid_at, created_at')
        .eq('subscription_id', subscription.id)
        .order('created_at', { ascending: false })
        .limit(20)

      payments = paymentData ?? []
    }

    return NextResponse.json({ subscription, payments })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

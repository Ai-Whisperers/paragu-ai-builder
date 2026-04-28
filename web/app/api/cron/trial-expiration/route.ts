import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFeatures } from '@/lib/portal/features'
import { sendWhatsApp } from '@/lib/portal/whatsapp-notify'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: Request) {
  if (CRON_SECRET && request.headers.get('x-cron-secret') !== CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createClient('service_role')
  const now = new Date().toISOString()

  const { data: expiredTrials } = await supabase
    .from('subscriptions')
    .select('id, business_id, plan_tier, plan_name')
    .eq('status', 'trialing')
    .lte('trial_ends_at', now)

  let downgraded = 0
  let notified = 0

  for (const sub of expiredTrials ?? []) {
    const targetTier = sub.plan_tier === 'professional' || sub.plan_tier === 'enterprise' ? 'starter' : 'free'

    const { error: updateErr } = await supabase
      .from('subscriptions')
      .update({ status: 'active', plan_tier: targetTier, plan_name: targetTier === 'free' ? 'Gratuito' : 'Starter', price_monthly: targetTier === 'free' ? 0 : 150000 })
      .eq('id', sub.id)

    if (updateErr) {
      logger.error('[trial-expiration] downgrade failed', { subscriptionId: sub.id, error: updateErr.message })
      continue
    }

    downgraded++

    const { data: biz } = await supabase.from('businesses').select('name, whatsapp_instance, whatsapp').eq('id', sub.business_id).single()
    if (biz?.whatsapp_instance && biz?.whatsapp) {
      const tierLabel = targetTier === 'free' ? 'Gratuito' : 'Starter'
      const message = `Hola! 👋 El período de prueba de tu plan ${sub.plan_name} en ParaguAI finalizó.\n\nTu sitio sigue online con el plan ${tierLabel}. Para acceder a todas las funciones, podés actualizar tu plan desde el panel de control.\n\nhttps://paragu-ai.com/dashboard`
      try {
        await sendWhatsApp(biz.whatsapp_instance, biz.whatsapp, message)
        notified++
      } catch (err) {
        logger.warn('[trial-expiration] notify failed', { businessId: sub.business_id, error: String(err) })
      }
    }

    await supabase.from('portal_notifications').insert({
      business_id: sub.business_id,
      type: 'billing',
      title: 'Período de prueba finalizado',
      body: `Tu plan ${sub.plan_name} de prueba terminó. Tu sitio sigue activo con el plan ${targetTier === 'free' ? 'Gratuito' : 'Starter'}.`,
      action_url: '/billing',
    })
  }

  logger.info('[cron:trial-expiration] completed', { expired: (expiredTrials ?? []).length, downgraded, notified })
  return NextResponse.json({ ok: true, expiredCount: (expiredTrials ?? []).length, downgraded, notified })
}

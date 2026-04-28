import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWhatsApp } from '@/lib/portal/whatsapp-notify'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: Request) {
  if (CRON_SECRET && request.headers.get('x-cron-secret') !== CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createClient('service_role')
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()

  const { data: pendingReferrals } = await supabase
    .from('referral_codes')
    .select('id, code, referrer_business_id, referred_email, referred_name')
    .eq('status', 'pending')

  let rewarded = 0

  for (const ref of pendingReferrals ?? []) {
    const { data: referredBiz } = await supabase
      .from('businesses')
      .select('id, created_at')
      .eq('email', ref.referred_email)
      .gte('created_at', thirtyDaysAgo)
      .maybeSingle()

    if (!referredBiz) continue

    const { data: referrer } = await supabase
      .from('businesses')
      .select('id, name, whatsapp, whatsapp_instance')
      .eq('id', ref.referrer_business_id)
      .single()

    if (referrer?.whatsapp_instance && referrer?.whatsapp) {
      const creditMessage = `🎉 ¡Gracias por referir a ${ref.referred_name || 'un amigo'} a ParaguAI!

Como recompensa, te acreditamos 1 mes gratis en tu próxima factura. Seguí invitando y acumulando beneficios. 🙌

Compartí tu link de referido:
https://paragu-ai.com?ref=${ref.code}`

      try {
        await sendWhatsApp(referrer.whatsapp_instance, referrer.whatsapp, creditMessage)
      } catch (err) {
        logger.warn('[referral-rewards] notify failed', { referrerId: referrer.id, error: String(err) })
      }
    }

    await supabase.from('referral_codes').update({ status: 'redeemed', redeemed_at: new Date().toISOString() }).eq('id', ref.id)

    await supabase.from('portal_notifications').insert({
      business_id: ref.referrer_business_id,
      type: 'system',
      title: '¡Referido completado!',
      body: `${ref.referred_name} se unió a ParaguAI gracias a vos. Recibiste 1 mes gratis.`,
    })

    rewarded++
  }

  logger.info('[cron:referral-rewards] completed', { checked: (pendingReferrals ?? []).length, rewarded })
  return NextResponse.json({ ok: true, checked: (pendingReferrals ?? []).length, rewarded })
}

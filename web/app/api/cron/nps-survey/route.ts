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

  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, whatsapp_instance, whatsapp, slug')
    .eq('status', 'active')

  let sent = 0
  const dayOfMonth = new Date().getDate()

  for (const biz of businesses ?? []) {
    if (!biz.whatsapp_instance || !biz.whatsapp) continue

    const { data: existing } = await supabase
      .from('portal_notifications')
      .select('id')
      .eq('business_id', biz.id)
      .eq('type', 'system')
      .gte('created_at', new Date(Date.now() - 35 * 86_400_000).toISOString())

    const npsUrl = `https://paragu-ai.com/dashboard/${biz.slug}/nps`

    const message = `Hola! 👋 ${biz.name}, queremos saber cómo te va con ParaguAI.

Del 1 al 10, ¿qué tan probable es que nos recomiendes a otro negocio?

Decinos acá (solo 1 clic):
${npsUrl}

Tu opinión nos ayuda a mejorar. 🙌`

    try {
      await sendWhatsApp(biz.whatsapp_instance, biz.whatsapp, message)
      sent++
    } catch (err) {
      logger.warn('[cron:nps-survey] send failed', { businessId: biz.id, error: String(err) })
    }
  }

  logger.info('[cron:nps-survey] completed', { sent })
  return NextResponse.json({ ok: true, sent })
}

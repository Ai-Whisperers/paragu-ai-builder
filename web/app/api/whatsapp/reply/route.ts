import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAutoReply } from '@/lib/whatsapp/auto-reply'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { instance, from, message } = body

    if (!instance || !from || !message) {
      return NextResponse.json({ error: 'instance_from_message_required' }, { status: 400 })
    }

    const supabase = await createClient('service_role')

    const { data: businesses } = await supabase
      .from('businesses')
      .select('id, slug, name, phone, whatsapp, address, hours, location')
      .eq('whatsapp_instance', instance)
      .limit(1)

    const business = (businesses ?? [])[0]
    if (!business) {
      logger.warn('[whatsapp:reply] no business found for instance', { instance })
      return NextResponse.json({ ok: true, reply: null })
    }

    const cleanMessage = message.replace(/[^\w\sáéíóúñü.,!?¿¡@#]/gi, '').trim()
    const reply = getAutoReply(cleanMessage, business as unknown as Record<string, unknown>)

    if (reply) {
      logger.info('[whatsapp:reply] auto-reply sent', { businessId: business.id, instance, length: reply.length })
    }

    return NextResponse.json({ ok: true, reply })
  } catch (err) {
    logger.error('[whatsapp:reply] error', { error: String(err) })
    return NextResponse.json({ ok: true, reply: null })
  }
}

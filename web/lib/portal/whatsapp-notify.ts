import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

const EVOLUTION_API_BASE = process.env.EVOLUTION_API_BASE || 'https://whatsapp.agentzero.ai'

export async function sendWhatsApp(instanceName: string, to: string, message: string): Promise<void> {
  const apiKey = process.env.EVOLUTION_API_KEY
  if (!apiKey) {
    logger.warn('[whatsapp-notify] EVOLUTION_API_KEY not configured')
    return
  }
  const cleanNumber = to.replace(/[^0-9]/g, '')
  if (cleanNumber.length < 10) {
    logger.warn('[whatsapp-notify] Invalid phone number', { to })
    return
  }
  try {
    const res = await fetch(`${EVOLUTION_API_BASE}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: message,
        delay: 1200,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      logger.error('[whatsapp-notify] send failed', { status: res.status, body, instanceName, to: cleanNumber })
    }
  } catch (err) {
    logger.error('[whatsapp-notify] send error', { error: String(err) })
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PY', { weekday: 'long', day: '2-digit', month: 'long' })
}

export async function sendBookingConfirmation(businessId: string, booking: Record<string, unknown>): Promise<void> {
  const supabase = await createClient('service_role')
  const { data: biz } = await supabase.from('businesses').select('name, whatsapp_instance').eq('id', businessId).single()
  if (!biz?.whatsapp_instance) return

  const name = booking.customer_name as string
  const phone = booking.customer_phone as string
  const date = formatDate(booking.booking_date as string)
  const time = (booking.booking_time as string)?.slice(0, 5)

  if (!phone) return

  const message = `Hola ${name}! ✅ Tu reserva en ${biz.name} fue confirmada para el ${date} a las ${time}. Te esperamos!`

  await sendWhatsApp(biz.whatsapp_instance, phone, message)
}

export async function sendOrderStatusUpdate(businessId: string, order: Record<string, unknown>, newStatus: string): Promise<void> {
  const supabase = await createClient('service_role')
  const { data: biz } = await supabase.from('businesses').select('name, whatsapp_instance').eq('id', businessId).single()
  if (!biz?.whatsapp_instance) return

  const name = order.customer_name as string
  const phone = order.customer_phone as string
  const orderNumber = order.order_number as string
  if (!phone) return

  let message = ''
  if (newStatus === 'shipped') {
    const tracking = (order.tracking_number as string) || ''
    message = `Hola ${name}! 📦 Tu pedido ${orderNumber} fue enviado.${tracking ? ` N° de seguimiento: ${tracking}` : ''}`
  } else if (newStatus === 'delivered') {
    message = `Hola ${name}! ✅ Tu pedido ${orderNumber} fue entregado. Gracias por tu compra!`
  } else if (newStatus === 'cancelled') {
    message = `Hola ${name}! Tu pedido ${orderNumber} fue cancelado. Contactanos si necesitas ayuda.`
  } else {
    message = `Hola ${name}! Tu pedido ${orderNumber} actualizó su estado a: ${newStatus}`
  }

  await sendWhatsApp(biz.whatsapp_instance, phone, message)
}

export async function sendBookingReminder(businessId: string, booking: Record<string, unknown>): Promise<void> {
  const supabase = await createClient('service_role')
  const { data: biz } = await supabase.from('businesses').select('name, whatsapp_instance').eq('id', businessId).single()
  if (!biz?.whatsapp_instance) return

  const name = booking.customer_name as string
  const phone = booking.customer_phone as string
  const date = formatDate(booking.booking_date as string)
  const time = (booking.booking_time as string)?.slice(0, 5)
  if (!phone) return

  const message = `Recordatorio ⏰ Hola ${name}! Tenés una cita mañana ${date} a las ${time} en ${biz.name}. Te esperamos!`
  await sendWhatsApp(biz.whatsapp_instance, phone, message)
}

export async function sendOnboardingWelcome(businessId: string, ownerPhone: string, ownerName: string): Promise<void> {
  const supabase = await createClient('service_role')
  const { data: biz } = await supabase.from('businesses').select('name, whatsapp_instance, slug').eq('id', businessId).single()
  if (!biz?.whatsapp_instance) return

  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.com'}/dashboard/${biz.slug}`
  const message = `Hola ${ownerName}! 🎉 Bienvenido a Paragu-AI. Tu sitio web ${biz.name} ya está activo.\n\nPodés gestionar tu contenido, reservas y pedidos desde tu panel de control:\n${dashboardUrl}\n\nCualquier duda, respondé a este mensaje.`

  await sendWhatsApp(biz.whatsapp_instance, ownerPhone, message)
}

import { createClient } from '@/lib/supabase/server'
import { sendWhatsApp } from './whatsapp-notify'
import { logger } from '@/lib/logger'

const DAYS: Array<{ delayDays: number; subject: string; body: (name: string, slug: string) => string }> = [
  {
    delayDays: 0,
    subject: 'Bienvenido',
    body: (name, slug) => `🎉 *¡Bienvenido a ParaguAI, ${name}!*

Tu sitio web ya está online. Gestioná tu contenido, reservas y pedidos desde tu panel de control:
https://paragu-ai.com/dashboard/${slug}

Cualquier duda, respondé a este mensaje.`,
  },
  {
    delayDays: 2,
    subject: 'Personalizá tu sitio',
    body: (name, slug) => `Hola ${name} 👋

¿Sabías que podés editar el contenido de tu sitio directamente desde tu panel?

📝 Cambiá textos, horarios y precios en "Contenido"
🖼️ Actualizá tus datos de contacto en "Configuración"
📱 Revisá las visitas en "Analíticas"

Todo sin escribir código.
https://paragu-ai.com/dashboard/${slug}/content`,
  },
  {
    delayDays: 5,
    subject: 'Recibí reservas online',
    body: (name, slug) => `Hola ${name} 👋

Tus clientes pueden reservar turnos directamente desde tu sitio web.

📅 Las reservas aparecen en tu panel en "Reservas"
✅ Podés confirmar o cancelar con un clic
🔔 Te llega notificación de cada reserva nueva

https://paragu-ai.com/dashboard/${slug}/bookings`,
  },
  {
    delayDays: 9,
    subject: 'Casos de éxito',
    body: (name) => `Hola ${name} 👋

Otros negocios como el tuyo ya están usando ParaguAI para crecer:

• Nexa Paraguay — sitio en 4 idiomas para clientes internacionales
• Dayah Litworks — portfolio que le consiguió 3 clientes en el primer mes
• De Abasto a Casa — meal prep con pedidos por WhatsApp, sin perder ventas

Vas por buen camino. Seguí así. 💪`,
  },
  {
    delayDays: 14,
    subject: '¿Listo para el siguiente nivel?',
    body: (name) => `Hola ${name} 👋

Ya llevás 2 semanas con ParaguAI. ¿Qué tal viene todo?

Si querés más funciones, recordá que podés actualizar tu plan desde la sección Facturación:

🚀 Reservas online ilimitadas
🛒 Tienda online con catálogo de productos
📊 Analíticas avanzadas
👥 Invitar a tu equipo

https://paragu-ai.com/dashboard/billing

Seguimos en contacto.`,
  },
]

export async function sendOnboardingDrip(businessId: string, day: number): Promise<boolean> {
  const supabase = await createClient('service_role')

  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name, slug, whatsapp, whatsapp_instance')
    .eq('id', businessId)
    .single()

  if (!biz?.whatsapp_instance || !biz?.whatsapp) return false

  const emailConfig = DAYS[day]
  if (!emailConfig) return false

  try {
    const message = emailConfig.body(biz.name, biz.slug)
    await sendWhatsApp(biz.whatsapp_instance, biz.whatsapp, message)
    logger.info('[onboarding-drip] sent', { businessId, day, subject: emailConfig.subject })
    return true
  } catch (err) {
    logger.warn('[onboarding-drip] failed', { businessId, day, error: String(err) })
    return false
  }
}

export async function triggerOnboardingSequence(businessId: string): Promise<void> {
  logger.info('[onboarding-drip] sequence triggered', { businessId })
  await sendOnboardingDrip(businessId, 0)
}

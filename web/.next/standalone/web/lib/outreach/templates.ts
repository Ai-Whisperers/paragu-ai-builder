/**
 * WhatsApp Outreach Templates
 * 
 * Pre-written message templates for reaching out to leads via WhatsApp.
 * These are used by the admin dashboard to generate wa.me links.
 * 
 * Usage:
 *   import { generateWhatsAppLink, TEMPLATES } from '@/lib/outreach/templates'
 *   const link = generateWhatsAppLink(lead.phone, TEMPLATES.initial Outreach)
 */

export interface TemplateVariables {
  businessName: string
  ownerName?: string
  city: string
  demoUrl?: string
  vertical: string
}

export const TEMPLATES = {
  /**
   * Initial outreach - soft introduction
   */
  initialOutreach: (vars: TemplateVariables): string => {
    return `¡Hola! 👋

Soy de Paragu-AI, una plataforma que ayuda a negocios como ${vars.businessName} a tener presencia online profesional sin complicaciones.

Veo que están en ${vars.city} y me preguntaba: ¿Actualmente tienen página web o solo redes sociales?

Quedamos atentos,
Equipo Paragu-AI`
  },

  /**
   * Demo ready - send after generating preview site
   */
  demoReady: (vars: TemplateVariables): string => {
    const url = vars.demoUrl || 'https://paragu.ai/demo'
    return `¡Hola de nuevo! 👋

Preparamos algo especial para ${vars.businessName}:

🌐 TU SITIO WEB DE DEMO:
${url}

Este es solo un ejemplo de cómo podría verse su sitio. Es responsive (se ve bien en celular), carga rápido y tiene todas las secciones importantes: servicios, galería, contacto, etc.

¿Les gustaría agendar una llamada de 15 minutos para mostrarles cómo personalizarlo con sus fotos y textos reales?

Saludos,
Equipo Paragu-AI`
  },

  /**
   * Follow up - if no response after 3 days
   */
  followUp: (vars: TemplateVariables): string => {
    return `¡Hola! 👋

Hace unos días les compartí el demo de la página web para ${vars.businessName}. 

Entiendo que están ocupados, así que solo quería saber:
- ¿Tuvieron chance de ver el demo?
- ¿Tienen alguna pregunta sobre cómo funciona?

Si prefieren, puedo enviarles un breve video explicativo de 2 minutos.

Un saludo,
Equipo Paragu-AI`
  },

  /**
   * Pricing mention - when they're interested but haven't committed
   */
  pricing: (vars: TemplateVariables): string => {
    return `¡Hola! 👋

Muchas gracias por su interés en Paragu-AI.

Sé que el precio es una consideración importante. Por eso quería compartir nuestras opciones:

🆓 GRATIS: Demo básico (como el que vieron)
💚 BÁSICO: ₲290.000/mes - Sitio completo + hosting
💛 PROFESIONAL: ₲590.000/mes - Todo lo básico + formularios de contacto
❤️ PREMIUM: ₲990.000/mes - Todo + edición ilimitada + soporte prioritario

¿Cuál opción les parece más adecuada para ${vars.businessName}?

Saludos,
Equipo Paragu-AI`
  },

  /**
   * Onboarding - after they decide to move forward
   */
  onboarding: (vars: TemplateVariables): string => {
    return `¡Excelente noticia! 🎉

Nos alegra mucho que ${vars.businessName} quiera unirse a Paragu-AI.

Para personalizar su sitio web, necesitamos:
1️⃣ Logo del negocio (si tienen)
2️⃣ Fotos de su local/trabajos (5-10 fotos)
3️⃣ Lista de servicios con precios
4️⃣ Horarios de atención
5️⃣ Datos de contacto (teléfono, dirección exacta)

Pueden enviarnos todo por aquí o llenar el formulario que les envío por link.

¡Vamos a crear algo increíble juntos!

Equipo Paragu-AI`
  },

  /**
   * Reactivation - for old leads that went cold
   */
  reactivation: (vars: TemplateVariables): string => {
    return `¡Hola! 👋

Hace tiempo conversamos sobre crear una página web para ${vars.businessName}.

Quería avisarles que hemos mejorado mucho nuestra plataforma:
✅ Ahora carga aún más rápido
✅ Mejor posicionamiento en Google
✅ Integración con WhatsApp Business
✅ Nuevos diseños disponibles

¿Les gustaría ver una nueva demo actualizada?

Quedamos atentos,
Equipo Paragu-AI`
  },

  /**
   * Referral request - asking for referrals from happy customers
   */
  referral: (vars: TemplateVariables): string => {
    return `¡Hola! 👋

Esperamos que ${vars.businessName} esté muy contento con su página web. 🌟

Una pregunta: ¿Conocen a otros negocios en ${vars.city} que también necesiten una página web profesional?

Por cada referido que se suscriba, les damos 1 mes gratis de su plan actual.

¡Gracias por confiar en nosotros!

Equipo Paragu-AI`
  },
}

/**
 * Generate a WhatsApp wa.me link with pre-filled message
 */
export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  // Parentheses signal a landline area code like "(021)" — preserve the
  // leading 0. Mobiles "0981…" strip their leading 0 before the +595 prefix.
  const isLandline = /\(/.test(phone)
  const cleanPhone = phone.replace(/[\s\-()+]/g, '')

  let phoneWithCountry: string
  if (cleanPhone.startsWith('595')) {
    phoneWithCountry = cleanPhone
  } else if (isLandline) {
    phoneWithCountry = '595' + cleanPhone
  } else if (cleanPhone.startsWith('0')) {
    phoneWithCountry = '595' + cleanPhone.slice(1)
  } else {
    phoneWithCountry = '595' + cleanPhone
  }

  // encodeURIComponent leaves !'()* alone per RFC 3986; WhatsApp's own links
  // work fine with those, so we follow the default encoding.
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`
}

/**
 * Generate outreach link using a template
 */
export function generateOutreachLink(
  phone: string,
  templateName: keyof typeof TEMPLATES,
  vars: TemplateVariables
): string {
  const template = TEMPLATES[templateName]
  const message = template(vars)
  return generateWhatsAppLink(phone, message)
}

import type { SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

/**
 * Track outreach event in database
 */
export async function logOutreachEvent(
  supabase: SupabaseClient,
  leadId: string,
  eventType: 'whatsapp_sent' | 'demo_viewed' | 'onboarding_started' | 'payment_initiated',
  metadata?: Record<string, unknown>
) {
  const { error } = await supabase
    .from('outreach_events')
    .insert({
      lead_id: leadId,
      event_type: eventType,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    })
  
  if (error) {
    logger.warn('Failed to log outreach event', {
      action: 'outreach.logEvent',
      error: error.message,
    })
  }
}

// Export individual templates for convenience
export const {
  initialOutreach,
  demoReady,
  followUp,
  pricing,
  onboarding,
  reactivation,
  referral,
} = TEMPLATES

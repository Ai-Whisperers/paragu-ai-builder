/**
 * Paragu-AI SaaS billing — manual bank-transfer details.
 *
 * Tenant transfers Gs to the alias below, then sends the comprobante
 * (receipt screenshot) to the WhatsApp number. The admin manually marks
 * the subscription as `active` once the comprobante is confirmed.
 *
 * See memory/saas-billing-current.md for the rationale and when to revisit.
 */

export const PARAGU_AI_BANK_ALIAS = 'weissvanderpol.ivan@gmail.com'
export const PARAGU_AI_COMPROBANTE_WHATSAPP = '+595981324569'

export interface BillingOutreachContext {
  businessName: string
  planLabel: string
  amountCents: number
  pagoparEnabled?: boolean
}

/**
 * Spanish, Paraguay-appropriate WhatsApp message. Opens with the plan
 * + price, then the transfer instructions, then the "open to talk
 * pricing + demo + checkout flexibility" triad.
 */
export function buildSaasOutreachMessage(ctx: BillingOutreachContext): string {
  const priceStr = `Gs ${ctx.amountCents.toLocaleString('es-PY')}`
  const lines = [
    `Hola 👋 Acá el plan para ${ctx.businessName}.`,
    '',
    `*Plan:* ${ctx.planLabel}`,
    `*Importe mensual:* ${priceStr}`,
    '',
    '*Cómo pagar:*',
    `1. Transferí el monto al alias: *${PARAGU_AI_BANK_ALIAS}*`,
    `2. Mandame el comprobante por WhatsApp al *${PARAGU_AI_COMPROBANTE_WHATSAPP}*`,
    '3. Confirmo la activación del mismo día',
    '',
    '*También podemos:*',
    '• Conversar sobre el precio o ajustarlo a lo que realmente necesitás',
    '• Armarte un demo del sitio con imágenes y textos ya actualizados (gratis, sin compromiso)',
    '• Usar checkout por WhatsApp para tu tienda (default)',
    ctx.pagoparEnabled
      ? '• O activar Pagopar para cobros con tarjeta — si ya tenés cuenta podés pasarme las credenciales y lo configuramos'
      : '• O activar Pagopar para cobros con tarjeta — si querés te ayudo con el alta',
    '',
    'Cualquier duda me escribís por acá. 🙌',
  ]
  return lines.join('\n')
}

export function buildSaasOutreachWhatsAppUrl(phone: string, ctx: BillingOutreachContext): string {
  const body = encodeURIComponent(buildSaasOutreachMessage(ctx))
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanPhone}?text=${body}`
}

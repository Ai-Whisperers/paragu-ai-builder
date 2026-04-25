import { pagoparFetch, signPagopar } from '@/lib/payments/pagopar/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

/**
 * Paragu-AI SaaS billing via Pagopar "Link de pago".
 *
 * Flow: admin clicks "Generar link de pago" → we call Pagopar's
 * iniciar-transaccion using Paragu-AI's OWN Pagopar tokens (distinct from
 * the tenant's storefront tokens) with the tenant's plan amount → Pagopar
 * returns hash_pedido → we build the URL https://www.pagopar.com/pagos/{hash}
 * → admin sends it to the tenant via WhatsApp / email.
 *
 * When the tenant pays, Pagopar's webhook to /api/webhooks/pagopar fires
 * with the hash_pedido. We differentiate SaaS-billing orders from
 * storefront orders by prefix on id_pedido_comercio: "SAAS-<subscriptionId>"
 * vs "PRG-YYYY-NNNNNN". The webhook handler picks up the prefix and
 * routes to the subscriptions state machine instead of orders.
 */

export interface PaymentLink {
  url: string
  hashPedido: string
  orderNumber: string
  amountCents: number
}

export async function generateSaasPaymentLink(opts: {
  businessId: string
  subscriptionId: string
  planLabel: string              // "Starter mensual", "Professional mensual"
  amountCents: number            // whole PYG (e.g. 150000 = Gs 150.000)
  payerEmail: string
  payerName: string
  payerPhone?: string
  webhookUrl: string
  returnUrl: string
}): Promise<PaymentLink> {
  const publicToken = process.env.PARAGU_AI_PAGOPAR_PUBLIC_TOKEN
  const privateToken = process.env.PARAGU_AI_PAGOPAR_PRIVATE_TOKEN
  if (!publicToken || !privateToken) {
    throw new Error('paragu_ai_pagopar_not_configured')
  }

  const orderNumber = `SAAS-${opts.subscriptionId.slice(0, 8)}-${Date.now()}`
  const token = signPagopar(privateToken, `${orderNumber}${opts.amountCents}`)

  const body = {
    token,
    public_key: publicToken,
    tipo_pedido: 'VENTA-COMERCIO',
    id_pedido_comercio: orderNumber,
    monto_total: opts.amountCents,
    descripcion_resumen: `Paragu-AI — ${opts.planLabel}`,
    url_retorno_exitoso: `${opts.returnUrl}?status=success`,
    url_retorno_cancelado: `${opts.returnUrl}?status=failure`,
    url_post_confirmacion: opts.webhookUrl,
    comprador: {
      email: opts.payerEmail,
      nombre: opts.payerName,
      telefono: opts.payerPhone ?? '',
      documento: '0',
      tipo_documento: 'CI',
      ruc: '',
      ciudad: 1,
      direccion: '',
      coordenadas: '',
      razon_social: '',
      direccion_referencia: '',
    },
    compras_items: [
      {
        nombre: `Paragu-AI · ${opts.planLabel}`,
        id_producto: 1,
        precio_total: opts.amountCents,
        cantidad: 1,
        descripcion: `Suscripción mensual al plan ${opts.planLabel}`,
        url_imagen: '',
        categoria: 909,
        ciudad: 1,
        public_key: publicToken,
        vendedor_telefono: '',
        vendedor_direccion: '',
        vendedor_direccion_referencia: '',
        vendedor_direccion_coordenadas: '',
      },
    ],
  }

  const response = await pagoparFetch<{
    resultado: Array<{ hash_pedido?: string; hash?: string }>
    respuesta: boolean
    mensajes?: Array<{ mensaje?: string }>
  }>('/api/comercios/2.0/iniciar-transaccion', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!response.respuesta) {
    const message = response.mensajes?.[0]?.mensaje ?? 'unknown_pagopar_error'
    throw new Error(`pagopar_saas_init_failed:${message}`)
  }

  const hashPedido = response.resultado?.[0]?.hash_pedido ?? response.resultado?.[0]?.hash
  if (!hashPedido) throw new Error('pagopar_saas_init_no_hash')

  logger.info('[saas] payment link generated', {
    action: 'saas.billing.link_generated',
    businessId: opts.businessId,
    subscriptionId: opts.subscriptionId,
    amountCents: opts.amountCents,
    orderNumber,
  })

  // Track the link in the existing subscription columns as generic
  // "provider payment ref" columns.
  try {
    const supabase = await createAdminClient()
    await supabase
      .from('subscriptions')
      .update({
        payment_payment_id: hashPedido,
        payment_payer_id: orderNumber,
      })
      .eq('id', opts.subscriptionId)
  } catch (err) {
    // Non-blocking: the link still works; we just lose the backlink.
    logger.warn('[saas] link persistence failed (non-blocking)', {
      subscriptionId: opts.subscriptionId,
      error: err instanceof Error ? err.message : String(err),
    })
  }

  return {
    url: `https://www.pagopar.com/pagos/${hashPedido}`,
    hashPedido,
    orderNumber,
    amountCents: opts.amountCents,
  }
}

export function buildWhatsAppShareUrl(phone: string, paymentUrl: string, planLabel: string): string {
  const body = encodeURIComponent(
    `Hola 👋 Te paso el link de pago de tu suscripción ${planLabel} en Paragu-AI: ${paymentUrl}\n\n` +
      `Es un link único, seguro y podés pagar con tarjeta, Tigo Money, Personal o en efectivo en Aquí Pago/Pago Express.`,
  )
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanPhone}?text=${body}`
}

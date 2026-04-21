import { pagoparFetch, signPagopar } from './client'
import { buildCommissionItem, computeCommission, getPlatformPagoparTokens } from './commission'
import type { CommissionConfig } from './commission'
import type { Order } from '@/lib/schemas/commerce/order'

export interface InitTransactionResponse {
  resultado: Array<{ hash_pedido?: string; hash?: string; token?: string }>
  respuesta: boolean
  mensajes?: Array<{ mensaje?: string; codigo?: string }>
}

export async function initTransaction(
  order: Order,
  opts: {
    publicToken: string
    privateToken: string
    returnUrl: string
    cancelUrl: string
    webhookUrl: string
    /** Per-tenant commission config. Omit to skip commission entirely. */
    commission?: CommissionConfig
  },
): Promise<{ hashPedido: string; checkoutUrl: string; commissionCents: number }> {
  if (!order.items || order.items.length === 0) {
    throw new Error('order_has_no_items')
  }
  if (order.currency !== 'PYG') {
    throw new Error(`pagopar_only_supports_pyg:${order.currency}`)
  }

  // Compute commission (0 if exempt or no config provided). Commission is
  // a split-billing line item routed to Paragu-AI's own Pagopar account;
  // the tenant's items still route to their public_key unchanged.
  const commissionCents = opts.commission
    ? computeCommission(order.subtotalCents, opts.commission)
    : 0
  const platformTokens = commissionCents > 0 ? getPlatformPagoparTokens() : null
  const useSplitBilling = commissionCents > 0 && platformTokens !== null

  const tenantItems = (order.items ?? []).map((it, idx) => ({
    nombre: it.productSnapshot.name,
    id_producto: idx + 1,
    precio_total: it.lineTotalCents,
    cantidad: it.quantity,
    descripcion: it.productSnapshot.name,
    url_imagen: it.productSnapshot.image_url ?? '',
    categoria: 909,
    ciudad: 1,
    public_key: opts.publicToken,
    vendedor_telefono: '',
    vendedor_direccion: '',
    vendedor_direccion_referencia: '',
    vendedor_direccion_coordenadas: '',
  }))

  const commissionItem = useSplitBilling
    ? buildCommissionItem({
        commissionCents,
        platformPublicKey: platformTokens!.publicToken,
        paddedProductId: 900000 + tenantItems.length,
      })
    : null

  const comprasItems = commissionItem ? [...tenantItems, commissionItem] : tenantItems
  const montoTotal = comprasItems.reduce((sum, it) => sum + it.precio_total, 0)

  const token = signPagopar(
    opts.privateToken,
    `${order.orderNumber}${montoTotal}`,
  )

  const body = {
    token,
    public_key: opts.publicToken,
    tipo_pedido: useSplitBilling ? 'COMERCIO-HEREDADO' : 'VENTA-COMERCIO',
    id_pedido_comercio: order.orderNumber,
    monto_total: montoTotal,
    descripcion_resumen: `Orden ${order.orderNumber}`,
    url_retorno_exitoso: opts.returnUrl,
    url_retorno_cancelado: opts.cancelUrl,
    url_post_confirmacion: opts.webhookUrl,
    comprador: {
      email: order.customerEmail,
      nombre: order.customerName,
      telefono: order.customerPhone ?? '',
      documento: String((order.metadata as { documento?: string } | undefined)?.documento ?? '0'),
      tipo_documento: 'CI',
      ruc: '',
      ciudad: 1,
      direccion: order.shippingAddress?.line1 ?? '',
      coordenadas: '',
      razon_social: '',
      direccion_referencia: order.shippingAddress?.references ?? '',
    },
    compras_items: comprasItems,
  }

  const response = await pagoparFetch<InitTransactionResponse>(
    '/api/comercios/2.0/iniciar-transaccion',
    { method: 'POST', body: JSON.stringify(body) },
  )

  if (!response.respuesta) {
    const message = response.mensajes?.[0]?.mensaje ?? 'unknown_pagopar_error'
    throw new Error(`pagopar_init_failed:${message}`)
  }

  const hashPedido = response.resultado?.[0]?.hash_pedido ?? response.resultado?.[0]?.hash
  if (!hashPedido) {
    throw new Error('pagopar_init_no_hash')
  }

  return {
    hashPedido,
    checkoutUrl: `https://www.pagopar.com/pagos/${hashPedido}`,
    commissionCents,
  }
}

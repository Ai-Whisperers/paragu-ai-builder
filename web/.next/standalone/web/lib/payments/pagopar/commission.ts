/**
 * Commission math + Pagopar split-billing payload helpers.
 *
 * Architecture: per-order commission = percent * subtotal + flat_cents.
 * Subtotal-only (not shipping/tax/discount) by locked decision (see memory
 * payments-architecture.md). During the 3-month free-premium window
 * (commission_exempt_until > now) the commission is zero and no split
 * item is injected — order stays tipo_pedido "VENTA-COMERCIO".
 */

export interface CommissionConfig {
  percent: number            // 0–100 (e.g. 5 = 5%)
  flatCents: number          // PYG whole guaraníes
  exemptUntil: Date | null
}

export function computeCommission(
  subtotalCents: number,
  config: CommissionConfig,
  now: Date = new Date(),
): number {
  if (config.exemptUntil && config.exemptUntil > now) return 0
  if (subtotalCents <= 0) return 0
  const percentPart = Math.round((subtotalCents * config.percent) / 100)
  return percentPart + config.flatCents
}

/**
 * Returns the compras_items entry Pagopar needs to split the commission to
 * Paragu-AI's own account. Returns null when commission is zero — in that
 * case callers should use tipo_pedido "VENTA-COMERCIO" instead of
 * "COMERCIO-HEREDADO".
 */
export function buildCommissionItem(opts: {
  commissionCents: number
  platformPublicKey: string
  paddedProductId: number // must not collide with real item ids
}): CommissionLineItem | null {
  if (opts.commissionCents <= 0) return null
  return {
    nombre: 'Plataforma · servicio digital',
    id_producto: opts.paddedProductId,
    precio_total: opts.commissionCents,
    cantidad: 1,
    descripcion: 'Servicio de plataforma digital — comisión Paragu-AI',
    url_imagen: '',
    categoria: 909,
    ciudad: 1,
    public_key: opts.platformPublicKey,
    vendedor_telefono: '',
    vendedor_direccion: '',
    vendedor_direccion_referencia: '',
    vendedor_direccion_coordenadas: '',
  }
}

// Shape exported for transactions.ts — matches the compras_items entries
// already produced there, so the commission item slots in identically.
export interface CommissionLineItem {
  nombre: string
  id_producto: number
  precio_total: number
  cantidad: number
  descripcion: string
  url_imagen: string
  categoria: number
  ciudad: number
  public_key: string
  vendedor_telefono: string
  vendedor_direccion: string
  vendedor_direccion_referencia: string
  vendedor_direccion_coordenadas: string
}

export function getPlatformPagoparTokens(): { publicToken: string; privateToken: string } | null {
  const publicToken = process.env.PARAGU_AI_PAGOPAR_PUBLIC_TOKEN
  const privateToken = process.env.PARAGU_AI_PAGOPAR_PRIVATE_TOKEN
  if (!publicToken || !privateToken) return null
  return { publicToken, privateToken }
}

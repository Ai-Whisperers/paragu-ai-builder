import { formatCents } from './compute-totals'

interface CartItemLite {
  productName: string | null | undefined
  quantity: number
  unitPriceCents: number
}

interface Options {
  /** E.164-ish phone; digits only after normalization. */
  whatsappNumber: string
  /** Store name to open the message with. */
  businessName: string
  /** Cart currency, for display in line items. */
  currency: string
  /** Line items in the cart. */
  items: CartItemLite[]
  /** Subtotal cents for the whole cart. */
  subtotalCents: number
  /** PDP URL back to the shop (useful for support). Optional. */
  shopUrl?: string
}

/**
 * Builds a `https://wa.me/<digits>?text=<pre-filled>` URL that drops the
 * shopper into a WhatsApp chat with the store, preloaded with the cart
 * contents, subtotal, and a polite request to confirm availability and
 * payment method.
 *
 * This is the LATAM checkout's escape hatch: not every shopper trusts
 * card-not-present on a new store, and the conversion rate on
 * "Terminar por WhatsApp" is consistently higher than forcing them
 * through a Pagopar tokenization flow. The cart state is in the URL
 * only — no PII persisted anywhere.
 */
export function buildWhatsAppCartUrl(opts: Options): string {
  const phone = opts.whatsappNumber.replace(/\D/g, '')
  if (!phone) return ''

  const lines: string[] = []
  lines.push(`Hola ${opts.businessName}, quiero confirmar este pedido:`)
  lines.push('')
  for (const it of opts.items) {
    const name = it.productName ?? 'Producto'
    const lineTotal = formatCents(it.unitPriceCents * it.quantity, opts.currency)
    lines.push(`• ${it.quantity}× ${name} — ${lineTotal}`)
  }
  lines.push('')
  lines.push(`Subtotal: ${formatCents(opts.subtotalCents, opts.currency)}`)
  lines.push('')
  lines.push('¿Me confirmás disponibilidad y forma de pago? Gracias.')
  if (opts.shopUrl) {
    lines.push('')
    lines.push(opts.shopUrl)
  }

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${phone}?text=${text}`
}

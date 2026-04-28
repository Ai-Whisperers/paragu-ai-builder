import { storefrontRoute } from './storefront-router'
import { ensureSessionToken } from '@/lib/commerce/session'
import { getOrCreateCart } from '@/lib/commerce/cart'

type CartHandler = (
  request: Request,
  ctx: {
    business: { id: string; name: string; currency: string }
    cart: { id: string; items: unknown[] }
    log: { info: (msg: string, data?: Record<string, unknown>) => void }
  },
) => Promise<Response>

export function cartRoute(handler: CartHandler) {
  return storefrontRoute(async (req, { business, log }) => {
    const sessionToken = await ensureSessionToken()
    const cart = await getOrCreateCart(business.id, { sessionToken, currency: business.currency || 'PYG' })
    return handler(req, { business, cart, log })
  })
}

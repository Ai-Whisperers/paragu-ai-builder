import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getSessionToken } from '@/lib/commerce/session'
import { getOrCreateCart, updateItem, removeItem } from '@/lib/commerce/cart'
import { UpdateCartItemSchema } from '@/lib/schemas/commerce/cart'

export const runtime = 'nodejs'

async function resolveCart(siteSlug: string) {
  const business = await resolveBusinessBySlug(siteSlug)
  if (!business) return { error: 'not_found' as const, status: 404 }
  const sessionToken = await getSessionToken()
  if (!sessionToken) return { error: 'no_session' as const, status: 400 }
  const cart = await getOrCreateCart(business.id, { sessionToken, currency: business.currency })
  return { business, cart }
}

export const PATCH = withRequestLog<{ site: string; itemId: string }>(async (req, _ctx, { site, itemId }) => {
  const resolved = await resolveCart(site)
  if ('error' in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = UpdateCartItemSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await updateItem(resolved.business.id, resolved.cart.id, itemId, parsed.data.quantity)
  return NextResponse.json({ cart: updated })
})

export const DELETE = withRequestLog<{ site: string; itemId: string }>(async (_req, _ctx, { site, itemId }) => {
  const resolved = await resolveCart(site)
  if ('error' in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status })

  const updated = await removeItem(resolved.business.id, resolved.cart.id, itemId)
  return NextResponse.json({ cart: updated })
})

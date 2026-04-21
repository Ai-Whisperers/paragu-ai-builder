import type { Order } from '@/lib/schemas/commerce/order'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'
import type { PaymentCapability } from './types'
import { CAPABILITIES } from './capabilities'

const FEE_TIER_RANK: Record<PaymentCapability['feeTier'], number> = {
  low: 0,
  medium: 1,
  high: 2,
}

export interface RouteContext {
  /** Country shipping to / shopper's billing country. ISO 3166-1 alpha-2. */
  country: string
  /** ISO 4217 currency. */
  currency: string
  /** Optional preferred provider (from business.commerce.provider). */
  preferred?: PaymentProvider
  /** Optional restriction — only consider these providers (merchant has creds). */
  available?: PaymentProvider[]
}

export class NoEligibleProviderError extends Error {
  constructor(public ctx: RouteContext) {
    super(`no_provider_for_${ctx.country}_${ctx.currency}`)
    this.name = 'NoEligibleProviderError'
  }
}

/**
 * Returns providers ranked best-first for the given context.
 * Throws NoEligibleProviderError if none cover both country and currency.
 *
 * Ranking rule:
 *   1. If `preferred` is in the eligible set → put it first.
 *   2. Then sort remaining by (basePriority asc, feeTier asc).
 *   3. Already-tried providers are NOT excluded here — that's failover's job.
 */
export function rankProviders(ctx: RouteContext): PaymentProvider[] {
  const upperCountry = ctx.country.toUpperCase()
  const upperCurrency = ctx.currency.toUpperCase()

  const eligible = CAPABILITIES.filter((cap) => {
    if (ctx.available && !ctx.available.includes(cap.provider)) return false
    const countryOk = cap.countries.length === 0 || cap.countries.includes(upperCountry)
    const currencyOk = cap.currencies.length === 0 || cap.currencies.includes(upperCurrency)
    return countryOk && currencyOk
  })

  if (eligible.length === 0) throw new NoEligibleProviderError(ctx)

  const sorted = [...eligible].sort((a, b) => {
    if (a.basePriority !== b.basePriority) return a.basePriority - b.basePriority
    return FEE_TIER_RANK[a.feeTier] - FEE_TIER_RANK[b.feeTier]
  })

  const ordered = sorted.map((cap) => cap.provider)
  if (ctx.preferred && ordered.includes(ctx.preferred)) {
    return [ctx.preferred, ...ordered.filter((p) => p !== ctx.preferred)]
  }
  return ordered
}

/** Convenience wrapper that derives ctx from an Order + business hint. */
export function rankProvidersForOrder(
  order: Order,
  preferred?: PaymentProvider,
  available?: PaymentProvider[],
): PaymentProvider[] {
  const country =
    order.shippingAddress?.country?.toUpperCase()
    ?? (order.metadata as { country?: string } | undefined)?.country
    ?? 'PY'
  return rankProviders({ country, currency: order.currency, preferred, available })
}

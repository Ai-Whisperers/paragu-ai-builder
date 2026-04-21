import { pagoparAdapter } from './pagopar/adapter'
import type { PaymentProviderAdapter } from './types'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'

const ADAPTERS: Partial<Record<PaymentProvider, PaymentProviderAdapter>> = {
  pagopar: pagoparAdapter,
  // bancard: ship in Phase 3 (direct VPOS 2.0 for high-volume merchants)
  // dlocal: ship in Phase 2 (LATAM multi-country aggregator)
}

export function getAdapter(provider: PaymentProvider): PaymentProviderAdapter {
  const adapter = ADAPTERS[provider]
  if (!adapter) throw new Error(`payment_provider_not_configured: ${provider}`)
  return adapter
}

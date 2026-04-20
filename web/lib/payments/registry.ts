import { mercadoPagoAdapter } from './mercado-pago/adapter'
import type { PaymentProviderAdapter } from './types'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'

const ADAPTERS: Partial<Record<PaymentProvider, PaymentProviderAdapter>> = {
  mercado_pago: mercadoPagoAdapter,
}

export function getAdapter(provider: PaymentProvider): PaymentProviderAdapter {
  const adapter = ADAPTERS[provider]
  if (!adapter) throw new Error(`payment_provider_not_configured: ${provider}`)
  return adapter
}

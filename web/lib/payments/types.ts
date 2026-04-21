import type { Order } from '@/lib/schemas/commerce/order'
import type { TransactionStatus, PaymentProvider } from '@/lib/schemas/commerce/transaction'

export interface CheckoutSession {
  redirectUrl: string
  providerRef: string // hash_pedido for Pagopar, preference_id for others
  sandbox: boolean
}

// Standardized payment-method tags surfaced to shopper UI + analytics.
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'wallet'
  | 'cash_kiosk'
  | 'pix'
  | 'qr'
  | 'crypto'

export interface PaymentCapability {
  provider: PaymentProvider
  countries: string[]    // ISO 3166-1 alpha-2 — empty array means "everywhere"
  currencies: string[]   // ISO 4217 — empty array means "everywhere"
  methods: PaymentMethod[]
  feeTier: 'low' | 'medium' | 'high'
  // Lower = preferred when multiple providers cover the same country.
  // Tie-breaker is feeTier (low → medium → high).
  basePriority: number
}

export interface WebhookVerification {
  valid: boolean
  eventId: string
  resourceId: string
  eventType: string
  reason?: string
}

export interface NormalizedPayment {
  providerPaymentId: string
  status: TransactionStatus
  amountCents: number
  currency: string
  externalReference?: string
  rawPayload: Record<string, unknown>
}

export interface PaymentProviderAdapter {
  name: PaymentProvider
  createCheckoutSession(order: Order, opts: { returnUrl: string; webhookUrl: string }): Promise<CheckoutSession>
  verifyWebhook(req: Request, rawBody: string): Promise<WebhookVerification>
  fetchPayment(providerPaymentId: string): Promise<NormalizedPayment>
}

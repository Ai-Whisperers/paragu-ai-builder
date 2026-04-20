import type { Order } from '@/lib/schemas/commerce/order'
import type { TransactionStatus, PaymentProvider } from '@/lib/schemas/commerce/transaction'

export interface CheckoutSession {
  redirectUrl: string
  providerRef: string // preference_id for MP
  sandbox: boolean
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

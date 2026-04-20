import type { OrderStatus } from '@/lib/schemas/commerce/order'

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['awaiting_payment', 'cancelled'],
  awaiting_payment: ['paid', 'failed', 'cancelled'],
  paid: ['fulfilled', 'refunded', 'cancelled'],
  fulfilled: ['shipped', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  failed: ['awaiting_payment', 'cancelled'],
  cancelled: [],
  refunded: [],
}

export class OrderStateError extends Error {
  constructor(public from: OrderStatus, public to: OrderStatus) {
    super(`Invalid order transition: ${from} → ${to}`)
    this.name = 'OrderStateError'
  }
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false
}

export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new OrderStateError(from, to)
  }
}

// Timestamps stamped on each terminal-ish status.
export function timestampFieldFor(status: OrderStatus): string | null {
  switch (status) {
    case 'paid':
      return 'paid_at'
    case 'shipped':
      return 'shipped_at'
    case 'delivered':
      return 'delivered_at'
    case 'cancelled':
      return 'cancelled_at'
    default:
      return null
  }
}

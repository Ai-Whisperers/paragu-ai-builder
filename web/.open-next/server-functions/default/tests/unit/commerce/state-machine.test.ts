import { describe, it, expect } from 'vitest'
import { canTransition, assertTransition, OrderStateError, timestampFieldFor } from '@/lib/commerce/state-machine'

describe('order state machine', () => {
  it('allows pending → awaiting_payment', () => {
    expect(canTransition('pending', 'awaiting_payment')).toBe(true)
  })

  it('allows awaiting_payment → paid', () => {
    expect(canTransition('awaiting_payment', 'paid')).toBe(true)
  })

  it('forbids paid → pending', () => {
    expect(canTransition('paid', 'pending')).toBe(false)
  })

  it('forbids cancelled → paid', () => {
    expect(canTransition('cancelled', 'paid')).toBe(false)
  })

  it('throws on invalid transition', () => {
    expect(() => assertTransition('refunded', 'paid')).toThrow(OrderStateError)
  })
})

describe('timestampFieldFor', () => {
  it('maps paid → paid_at', () => {
    expect(timestampFieldFor('paid')).toBe('paid_at')
  })

  it('returns null for non-timestamped statuses', () => {
    expect(timestampFieldFor('awaiting_payment')).toBeNull()
  })
})

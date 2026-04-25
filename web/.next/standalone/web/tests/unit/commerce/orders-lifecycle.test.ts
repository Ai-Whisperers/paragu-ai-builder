import { describe, it, expect } from 'vitest'
import { canTransition } from '@/lib/commerce/state-machine'
import { computeCartTotals, computeOrderTotal, formatCents } from '@/lib/commerce/compute-totals'
import { CheckoutInputSchema } from '@/lib/schemas/commerce/order'

// Exercises the public order lifecycle contract end-to-end at the pure-logic
// layer: cart → totals → valid state chain.
describe('order lifecycle — pure logic', () => {
  it('rejects invalid checkout input', () => {
    const result = CheckoutInputSchema.safeParse({
      cartId: 'not-a-uuid',
      customer: { name: '', email: 'bad' },
      shipping: { address: {} },
    })
    expect(result.success).toBe(false)
  })

  it('accepts a valid checkout payload', () => {
    const result = CheckoutInputSchema.safeParse({
      cartId: '550e8400-e29b-41d4-a716-446655440000',
      customer: { name: 'Juan Paraguayo', email: 'juan@example.com', phone: '+595987654321' },
      shipping: {
        address: { line1: 'Av. España 123', city: 'Asunción', country: 'PY' },
      },
    })
    if (!result.success) {
      // Surface the Zod issue path+message to speed up future debugging
      // if this regresses.
      console.error('CheckoutInputSchema rejected:', result.error.flatten())
    }
    expect(result.success).toBe(true)
  })

  it('computes cart → order total with shipping and discount', () => {
    const items = [
      { id: '1', cartId: 'c', productId: 'p1', quantity: 2, unitPriceCents: 100_000, createdAt: '' },
      { id: '2', cartId: 'c', productId: 'p2', quantity: 1, unitPriceCents: 50_000, createdAt: '' },
    ]
    const { subtotalCents } = computeCartTotals(items, 'PYG')
    expect(subtotalCents).toBe(250_000)

    const total = computeOrderTotal({
      subtotalCents,
      shippingCents: 30_000,
      taxCents: 0,
      discountCents: 20_000,
    })
    expect(total).toBe(260_000)
  })

  it('walks the happy-path state chain', () => {
    const chain: Array<[string, string]> = [
      ['pending', 'awaiting_payment'],
      ['awaiting_payment', 'paid'],
      ['paid', 'fulfilled'],
      ['fulfilled', 'shipped'],
      ['shipped', 'delivered'],
    ]
    for (const [from, to] of chain) {
      expect(canTransition(from as never, to as never)).toBe(true)
    }
  })

  it('allows paid → refunded but not delivered → paid', () => {
    expect(canTransition('paid', 'refunded')).toBe(true)
    expect(canTransition('delivered', 'paid')).toBe(false)
  })

  it('formats PYG totals in Paraguayan style', () => {
    expect(formatCents(1_250_000)).toMatch(/Gs\s*1[.,]250[.,]000/)
  })
})

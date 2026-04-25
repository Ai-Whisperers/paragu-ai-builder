import { describe, it, expect } from 'vitest'
import { orderToShopProcessId, mapBancardStatus } from '@/lib/payments/bancard/transactions'

describe('orderToShopProcessId', () => {
  it('produces a 10-digit-or-less integer', () => {
    const id = orderToShopProcessId('a1b2c3d4-5678-9abc-def0-112233445566')
    expect(id).toBeGreaterThanOrEqual(0)
    expect(id).toBeLessThan(10_000_000_000)
    expect(Number.isInteger(id)).toBe(true)
  })

  it('is deterministic (same UUID → same number)', () => {
    const a = orderToShopProcessId('order-abc-123')
    const b = orderToShopProcessId('order-abc-123')
    expect(a).toBe(b)
  })

  it('produces different numbers for different UUIDs', () => {
    const a = orderToShopProcessId('uuid-aaa')
    const b = orderToShopProcessId('uuid-bbb')
    expect(a).not.toBe(b)
  })

  it('stays under the 10-digit cap even for long UUIDs', () => {
    const id = orderToShopProcessId('x'.repeat(128))
    expect(id).toBeLessThan(10_000_000_000)
  })
})

describe('mapBancardStatus', () => {
  it('maps response=S → approved', () => {
    expect(
      mapBancardStatus({
        shop_process_id: 1,
        response: 'S',
      }),
    ).toBe('approved')
  })

  it('maps response=N + response_code → rejected', () => {
    expect(
      mapBancardStatus({
        shop_process_id: 1,
        response: 'N',
        response_code: '05',
      }),
    ).toBe('rejected')
  })

  it('maps missing response → pending', () => {
    expect(
      mapBancardStatus({
        shop_process_id: 1,
      } as unknown as Parameters<typeof mapBancardStatus>[0]),
    ).toBe('pending')
  })
})

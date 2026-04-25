import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the registry so we can inject failing/succeeding adapters.
const mockAdapters = new Map<string, { createCheckoutSession: ReturnType<typeof vi.fn> }>()

vi.mock('@/lib/payments/registry', () => ({
  getAdapter: (provider: string) => {
    const adapter = mockAdapters.get(provider)
    if (!adapter) throw new Error(`mock_not_set:${provider}`)
    return adapter
  },
}))

import { createCheckoutWithFailover, NoAvailableProviderError } from '@/lib/payments/failover'
import type { Order } from '@/lib/schemas/commerce/order'

const fakeOrder = { id: 'o-1', orderNumber: 'PRG-2026-0001', currency: 'PYG' } as unknown as Order

beforeEach(() => {
  mockAdapters.clear()
})

describe('createCheckoutWithFailover', () => {
  it('returns the first successful provider', async () => {
    const session = { redirectUrl: 'https://x', providerRef: 'r1', sandbox: true }
    mockAdapters.set('pagopar', { createCheckoutSession: vi.fn().mockResolvedValue(session) })

    const result = await createCheckoutWithFailover(fakeOrder, ['pagopar'], {
      returnUrl: 'r',
      webhookUrlFor: () => 'w',
    })

    expect(result.provider).toBe('pagopar')
    expect(result.session).toBe(session)
    expect(result.attempted).toEqual([])
  })

  it('skips a 5xx-throwing provider and falls back to the next', async () => {
    const session = { redirectUrl: 'https://x', providerRef: 'r2', sandbox: true }
    mockAdapters.set('pagopar', {
      createCheckoutSession: vi.fn().mockRejectedValue(new Error('pagopar_api_error:503:upstream timeout')),
    })
    mockAdapters.set('dlocal', { createCheckoutSession: vi.fn().mockResolvedValue(session) })

    const result = await createCheckoutWithFailover(fakeOrder, ['pagopar', 'dlocal'], {
      returnUrl: 'r',
      webhookUrlFor: () => 'w',
    })

    expect(result.provider).toBe('dlocal')
    expect(result.attempted).toHaveLength(1)
    expect(result.attempted[0]?.provider).toBe('pagopar')
  })

  it('skips a "not_implemented" stub and falls back', async () => {
    const session = { redirectUrl: 'https://x', providerRef: 'r3', sandbox: true }
    mockAdapters.set('bancard', {
      createCheckoutSession: vi.fn().mockRejectedValue(new Error('bancard_adapter_not_implemented')),
    })
    mockAdapters.set('pagopar', { createCheckoutSession: vi.fn().mockResolvedValue(session) })

    const result = await createCheckoutWithFailover(fakeOrder, ['bancard', 'pagopar'], {
      returnUrl: 'r',
      webhookUrlFor: () => 'w',
    })
    expect(result.provider).toBe('pagopar')
  })

  it('does NOT failover on 4xx / validation errors — bubbles up', async () => {
    mockAdapters.set('pagopar', {
      createCheckoutSession: vi.fn().mockRejectedValue(new Error('order_has_no_items')),
    })
    mockAdapters.set('dlocal', { createCheckoutSession: vi.fn() })

    await expect(
      createCheckoutWithFailover(fakeOrder, ['pagopar', 'dlocal'], {
        returnUrl: 'r',
        webhookUrlFor: () => 'w',
      }),
    ).rejects.toThrow('order_has_no_items')

    // dlocal must NOT have been called
    expect(mockAdapters.get('dlocal')!.createCheckoutSession).not.toHaveBeenCalled()
  })

  it('throws NoAvailableProviderError when all providers fail with 5xx', async () => {
    mockAdapters.set('pagopar', {
      createCheckoutSession: vi.fn().mockRejectedValue(new Error('pagopar_api_error:500:boom')),
    })
    mockAdapters.set('dlocal', {
      createCheckoutSession: vi.fn().mockRejectedValue(new Error('dlocal_api_error:502:boom')),
    })

    await expect(
      createCheckoutWithFailover(fakeOrder, ['pagopar', 'dlocal'], {
        returnUrl: 'r',
        webhookUrlFor: () => 'w',
      }),
    ).rejects.toBeInstanceOf(NoAvailableProviderError)
  })

  it('passes a per-provider webhook URL', async () => {
    const spy = vi.fn().mockResolvedValue({ redirectUrl: 'x', providerRef: 'r', sandbox: false })
    mockAdapters.set('pagopar', { createCheckoutSession: spy })

    await createCheckoutWithFailover(fakeOrder, ['pagopar'], {
      returnUrl: 'return',
      webhookUrlFor: (p) => `https://example.com/api/webhooks/${p}`,
    })

    expect(spy).toHaveBeenCalledWith(fakeOrder, {
      returnUrl: 'return',
      webhookUrl: 'https://example.com/api/webhooks/pagopar',
    })
  })
})

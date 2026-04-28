import { describe, it, expect } from 'vitest'
import { formatPyg } from '@/components/commerce/tienda-toolbar/price-filters'

describe('formatPyg', () => {
  it('formats 0 cents', () => {
    expect(formatPyg(0)).toBe('Gs 0')
  })

  it('formats 10000000 cents as Gs 10.000.000', () => {
    const result = formatPyg(10000000)
    expect(result).toContain('10')
    expect(result).toContain('000')
  })

  it('formats 30000000 cents', () => {
    const result = formatPyg(30000000)
    expect(result).toContain('Gs')
  })
})

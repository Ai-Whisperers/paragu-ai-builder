import { describe, it, expect } from 'vitest'
import { createHash } from 'crypto'
import {
  confirmationToken,
  formatBancardAmount,
  md5Token,
  refundToken,
  rollbackToken,
  singleBuyToken,
} from '@/lib/payments/bancard/client'

const PRIVATE = 'test_private_key_12345'

describe('md5Token', () => {
  it('concatenates parts in order and returns a 32-char hex', () => {
    const token = md5Token([PRIVATE, 42, '100.00', 'PYG'])
    expect(token).toHaveLength(32)
    expect(token).toMatch(/^[a-f0-9]{32}$/)
    // Must match the spec exactly — order matters.
    const expected = createHash('md5').update(`${PRIVATE}42100.00PYG`).digest('hex')
    expect(token).toBe(expected)
  })

  it('distinguishes different input orderings', () => {
    const a = md5Token(['a', 'b', 'c'])
    const b = md5Token(['a', 'c', 'b'])
    expect(a).not.toBe(b)
  })
})

describe('singleBuyToken', () => {
  it('follows the Bancard template: md5(private + shop_process_id + amount + currency)', () => {
    const token = singleBuyToken(PRIVATE, 1234567890, '50000.00', 'PYG')
    const expected = createHash('md5').update(`${PRIVATE}1234567890` + '50000.00' + 'PYG').digest('hex')
    expect(token).toBe(expected)
  })
})

describe('confirmationToken', () => {
  it('uses the "get_confirmation" keyword', () => {
    const token = confirmationToken(PRIVATE, 1234567890)
    const expected = createHash('md5').update(`${PRIVATE}1234567890get_confirmation`).digest('hex')
    expect(token).toBe(expected)
  })
})

describe('rollbackToken', () => {
  it('uses "rollback" + "0.00" amount marker', () => {
    const token = rollbackToken(PRIVATE, 1234567890)
    const expected = createHash('md5').update(`${PRIVATE}1234567890rollback0.00`).digest('hex')
    expect(token).toBe(expected)
  })
})

describe('refundToken', () => {
  it('includes the refund amount in the hash input', () => {
    const token = refundToken(PRIVATE, 1234567890, '50000.00')
    const expected = createHash('md5').update(`${PRIVATE}1234567890refund50000.00`).digest('hex')
    expect(token).toBe(expected)
  })

  it('produces different tokens for different amounts (no partial-amount forgery)', () => {
    const full = refundToken(PRIVATE, 999, '50000.00')
    const partial = refundToken(PRIVATE, 999, '25000.00')
    expect(full).not.toBe(partial)
  })
})

describe('formatBancardAmount', () => {
  it('appends ".00" to PYG integer cents (PYG has no subunit)', () => {
    expect(formatBancardAmount(50000, 'PYG')).toBe('50000.00')
    expect(formatBancardAmount(1, 'PYG')).toBe('1.00')
    expect(formatBancardAmount(0, 'PYG')).toBe('0.00')
  })

  it('scales non-PYG currencies from integer cents to N.DD', () => {
    // USD $10.00 stored as 1000 cents → "10.00"
    expect(formatBancardAmount(1000, 'USD')).toBe('10.00')
    // $10.05 stored as 1005 cents → "10.05"
    expect(formatBancardAmount(1005, 'USD')).toBe('10.05')
    // $10.50 → "10.50"
    expect(formatBancardAmount(1050, 'USD')).toBe('10.50')
  })
})

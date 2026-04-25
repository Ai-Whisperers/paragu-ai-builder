import { describe, it, expect } from 'vitest'
import {
  withLoggerContext,
  getLoggerContext,
  extendLoggerContext,
} from '@/lib/obs/context'

describe('AsyncLocalStorage context', () => {
  it('returns undefined outside a scope', () => {
    expect(getLoggerContext()).toBeUndefined()
  })

  it('exposes the seeded store inside a scope', () => {
    withLoggerContext({ 'trace.id': 'abc-1' }, () => {
      expect(getLoggerContext()).toEqual({ 'trace.id': 'abc-1' })
    })
  })

  it('merges extended fields into the current store', () => {
    withLoggerContext({ 'trace.id': 'abc-2' }, () => {
      extendLoggerContext({ 'user.id': 'user-9' })
      expect(getLoggerContext()).toEqual({
        'trace.id': 'abc-2',
        'user.id': 'user-9',
      })
    })
  })

  it('nested scopes shadow outer values', () => {
    withLoggerContext({ 'trace.id': 'outer' }, () => {
      withLoggerContext({ 'trace.id': 'inner' }, () => {
        expect(getLoggerContext()?.['trace.id']).toBe('inner')
      })
      expect(getLoggerContext()?.['trace.id']).toBe('outer')
    })
  })

  it('extendLoggerContext is a no-op outside a scope', () => {
    // Should not throw
    expect(() => extendLoggerContext({ 'trace.id': 'x' })).not.toThrow()
    expect(getLoggerContext()).toBeUndefined()
  })

  it('propagates across awaited async boundaries', async () => {
    await withLoggerContext({ 'trace.id': 'xyz' }, async () => {
      await new Promise((r) => setTimeout(r, 5))
      expect(getLoggerContext()?.['trace.id']).toBe('xyz')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { fillDeep, resolveRef, mergeOverrides } from '@/lib/engine/resolve-copy'

describe('resolve-copy', () => {
  it('fillDeep replaces placeholders in strings', () => {
    const result = fillDeep(
      { h: 'Hello {{name}}', list: ['{{name}}', { deeper: '{{name}}!' }] },
      { name: 'Ada' },
    )
    expect(result).toEqual({
      h: 'Hello Ada',
      list: ['Ada', { deeper: 'Ada!' }],
    })
  })

  it('resolveRef finds content in site first, then vertical', () => {
    const ctx = {
      siteContent: { hello: 'site-version' },
      verticalCopy: { hello: 'vertical-version', fallback: 'only-vertical' },
      placeholders: {},
    }
    expect(resolveRef('hello', ctx)).toBe('site-version')
    expect(resolveRef('fallback', ctx)).toBe('only-vertical')
    expect(resolveRef('unknown', ctx)).toBeUndefined()
  })

  it('resolveRef follows $ref', () => {
    const ctx = {
      siteContent: {
        home: { cta: { title: 'Primary', button: 'Click' } },
        pageA: { cta: { $ref: 'home.cta' } },
      },
      verticalCopy: {},
      placeholders: {},
    }
    expect(resolveRef('pageA.cta', ctx)).toEqual({ title: 'Primary', button: 'Click' })
  })

  it('mergeOverrides layers overrides on top of base', () => {
    expect(mergeOverrides({ a: 1, b: 2 }, { b: 99, c: 3 })).toEqual({ a: 1, b: 99, c: 3 })
    expect(mergeOverrides(undefined, { a: 1 })).toEqual({ a: 1 })
    expect(mergeOverrides('not-an-object', { a: 1 })).toEqual({ a: 1 })
  })
})

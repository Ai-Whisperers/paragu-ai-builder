import { describe, it, expect, beforeEach } from 'vitest'
import { z } from 'zod'
import { loadContent, __resetContentCache } from '@/lib/content/loader'
import { registryTypeSchema } from '@/lib/content/schemas'

beforeEach(() => {
  __resetContentCache()
})

describe('loadContent', () => {
  it('loads and validates a real registry file', () => {
    const r = loadContent('registry', 'peluqueria.type.json', registryTypeSchema)
    expect(r.id).toBe('peluqueria')
    expect(Array.isArray(r.pages.homepage.sections)).toBe(true)
    expect(r.seo.titleTemplate).toBeTruthy()
  })

  it('throws a descriptive error when the file is missing', () => {
    expect(() =>
      loadContent('registry', 'nope.type.json', registryTypeSchema)
    ).toThrow()
  })

  it('throws a descriptive error when JSON does not match the schema', () => {
    const tight = z.object({ onlyMe: z.string() })
    expect(() =>
      loadContent('registry', 'peluqueria.type.json', tight)
    ).toThrow(/Validation failed for registry\/peluqueria\.type\.json/)
  })
})

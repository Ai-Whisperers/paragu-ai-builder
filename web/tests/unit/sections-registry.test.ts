import { describe, it, expect } from 'vitest'
import {
  SECTION_DEFINITIONS,
  SECTION_KEY_ALIASES,
  resolveSectionKey,
  type SectionType,
} from '@/lib/engine/sections'

describe('section registry', () => {
  it('every declared SectionType has both a component and a builder', () => {
    for (const [key, def] of Object.entries(SECTION_DEFINITIONS)) {
      expect(def.type, `type for ${key}`).toBe(key)
      expect(def.component, `component for ${key}`).toBeTypeOf('function')
      expect(def.build, `build for ${key}`).toBeTypeOf('function')
    }
  })

  it('every alias resolves to a known SectionType', () => {
    const known = new Set<SectionType>(
      Object.keys(SECTION_DEFINITIONS) as SectionType[]
    )
    for (const target of Object.values(SECTION_KEY_ALIASES)) {
      expect(known.has(target)).toBe(true)
    }
  })

  it('resolveSectionKey returns null for unknown keys', () => {
    expect(resolveSectionKey('nope')).toBeNull()
    expect(resolveSectionKey('')).toBeNull()
  })

  it('resolveSectionKey round-trips canonical keys', () => {
    for (const key of Object.keys(SECTION_DEFINITIONS) as SectionType[]) {
      expect(resolveSectionKey(key)).toBe(key)
    }
  })
})

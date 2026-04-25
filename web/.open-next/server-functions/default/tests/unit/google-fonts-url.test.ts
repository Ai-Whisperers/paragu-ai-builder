import { describe, it, expect } from 'vitest'
import { buildGoogleFontsUrl } from '@/lib/tokens/google-fonts-url'

describe('buildGoogleFontsUrl', () => {
  it('defaults to latin subset', () => {
    const u = buildGoogleFontsUrl(['Inter:wght@400;600'], ['es'])
    expect(u).toContain('family=Inter:wght@400;600')
    expect(u).toContain('subset=latin')
    expect(u).not.toContain('latin-ext')
    expect(u).toContain('display=swap')
  })

  it('adds latin-ext when EU locale present', () => {
    const u = buildGoogleFontsUrl(['Inter'], ['nl', 'en'])
    expect(u).toContain('subset=latin,latin-ext')
  })

  it('encodes spaces in family names', () => {
    const u = buildGoogleFontsUrl(['Playfair Display:wght@700'])
    expect(u).toContain('family=Playfair+Display:wght@700')
  })

  it('returns empty string for no families', () => {
    expect(buildGoogleFontsUrl([])).toBe('')
  })
})

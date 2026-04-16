import { describe, it, expect, beforeEach } from 'vitest'
import {
  resolveTokens,
  getAvailablePalettes,
} from '@/lib/tokens/resolver'
import { __resetContentCache } from '@/lib/content/loader'

beforeEach(() => {
  __resetContentCache()
})

describe('resolveTokens', () => {
  it('produces a :root block with required CSS variables', () => {
    const t = resolveTokens('peluqueria')
    expect(t.cssString.startsWith(':root {')).toBe(true)
    expect(t.cssString).toContain('--primary')
    expect(t.cssString).toContain('--background')
    expect(t.cssString).toContain('--font-heading')
  })

  it('declares light or dark theme matching the token file', () => {
    const t = resolveTokens('peluqueria')
    expect(['light', 'dark']).toContain(t.theme)
  })

  it('emits a google fonts URL when fonts are declared', () => {
    const t = resolveTokens('peluqueria')
    if (t.googleFontsUrl) {
      expect(t.googleFontsUrl).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?/)
    }
  })

  it('throws a descriptive error for a missing palette', () => {
    expect(() => resolveTokens('peluqueria', 'definitely-not-a-palette')).toThrow(
      /Palette "definitely-not-a-palette" not found/
    )
  })

  it('exposes all declared palettes via getAvailablePalettes', () => {
    const palettes = getAvailablePalettes('peluqueria')
    expect(palettes.length).toBeGreaterThan(0)
    for (const p of palettes) {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
    }
  })

  it('resolves tokens for every business type', () => {
    const types = [
      'peluqueria',
      'salon_belleza',
      'gimnasio',
      'spa',
      'unas',
      'tatuajes',
      'barberia',
      'estetica',
      'maquillaje',
      'depilacion',
      'pestanas',
      'diseno_grafico',
    ] as const
    for (const t of types) {
      const resolved = resolveTokens(t)
      expect(resolved.cssVariables['--primary']).toBeTruthy()
      expect(resolved.cssVariables['--background']).toBeTruthy()
    }
  })
})

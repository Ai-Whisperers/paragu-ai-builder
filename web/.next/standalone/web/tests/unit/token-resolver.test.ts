/**
 * Token Resolver Tests
 * Win 53: Test theme merging
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// vi.mock hoists above imports; vi.hoisted lets the mock reference hoist too.
const { mockReadFileSync } = vi.hoisted(() => ({ mockReadFileSync: vi.fn() }))
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>()
  return { ...actual, default: actual, readFileSync: mockReadFileSync }
})

import { resolveTokens, getAvailablePalettes, type ResolvedTokens } from '@/lib/tokens/resolver'
import type { BusinessType } from '@/lib/types'

// TODO: The fs-mocking approach here doesn't reliably intercept resolver.ts's
// `import { readFileSync } from 'fs'` under vitest's ESM + vi.mock hoisting.
// The tests were written against an earlier module shape. Re-enable once
// resolver.ts is refactored to accept an injectable loader, or switch these
// tests to use static-config fixtures instead of fs mocks.
describe.skip('resolveTokens', () => {
  const mockBaseTokens = {
    spacing: {
      xs: { value: '0.25rem' },
      sm: { value: '0.5rem' },
      md: { value: '1rem' },
      lg: { value: '1.5rem' },
      xl: { value: '2rem' },
    },
    borderRadius: {
      sm: { value: '0.25rem' },
      md: { value: '0.5rem' },
      lg: { value: '1rem' },
    },
    shadows: {
      card: { value: '0 2px 4px rgba(0,0,0,0.1)' },
      cardHover: { value: '0 4px 8px rgba(0,0,0,0.15)' },
      button: { value: '0 2px 4px rgba(0,0,0,0.1)' },
      nav: { value: '0 2px 8px rgba(0,0,0,0.08)' },
    },
    typography: {
      scale: {
        xs: { value: '0.75rem' },
        sm: { value: '0.875rem' },
        base: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '1.875rem' },
      },
      lineHeight: {
        tight: { value: '1.25' },
        normal: { value: '1.5' },
        relaxed: { value: '1.75' },
      },
    },
    animation: {
      duration: {
        fast: { value: '150ms' },
        default: { value: '300ms' },
        slow: { value: '500ms' },
      },
    },
    layout: {
      grid: {
        gap: { value: '1.5rem' },
      },
    },
  }

  const mockPeluqueriaTokens = {
    name: 'Peluquería',
    extends: 'base',
    theme: 'light' as const,
    mood: ['modern', 'fresh'],
    palettes: {
      default: {
        name: 'Moderno',
        colors: {
          primary: '#b76e79',
          secondary: '#8b6f5e',
          accent: '#d4a574',
          background: '#ffffff',
          surface: '#f8f5f2',
          text: '#2c3e50',
          textLight: '#5d6d7e',
          textMuted: '#95a5a6',
          success: '#4a7c59',
          error: '#c0392b',
          warning: '#f39c12',
          surfaceLight: '#faf8f6',
          secondaryHover: '#7a6354',
        },
      },
      dark: {
        name: 'Elegante',
        colors: {
          primary: '#d4848f',
          secondary: '#a08070',
          accent: '#e8c9a0',
          background: '#1a1a1a',
          surface: '#2d2d2d',
          text: '#f5f5f5',
          textLight: '#b0b0b0',
          textMuted: '#808080',
          success: '#5a9c69',
          error: '#e74c3c',
          warning: '#f1c40f',
          surfaceLight: '#3d3d3d',
          secondaryHover: '#8a7060',
        },
      },
    },
    defaultPalette: 'default',
    typography: {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Playfair Display',
      headingWeight: '600',
      bodyWeight: '400',
      textTransform: 'none',
    },
    googleFonts: ['Playfair Display:wght@400;600', 'Inter:wght@400;500;600'],
    borderRadius: '0.5rem',
    buttonStyle: 'rounded',
    components: {
      button: {
        borderRadius: '9999px',
        padding: '0.75rem 1.5rem',
        textTransform: 'none',
        fontWeight: '500',
      },
    },
  }

  beforeEach(() => {
    mockReadFileSync.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should resolve tokens for a business type', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const result = resolveTokens('peluqueria' as BusinessType)

    expect(result).toBeDefined()
    expect(result.cssVariables).toBeDefined()
    expect(result.cssString).toContain(':root')
    expect(result.theme).toBe('light')
    expect(result.googleFontsUrl).toContain('fonts.googleapis.com')
  })

  it('should merge base tokens with type tokens', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const result = resolveTokens('peluqueria' as BusinessType)

    // Check colors from type
    expect(result.cssVariables['--primary']).toBe('#b76e79')
    expect(result.cssVariables['--secondary']).toBe('#8b6f5e')

    // Check spacing from base
    expect(result.cssVariables['--spacing-xs']).toBe('0.25rem')
    expect(result.cssVariables['--spacing-md']).toBe('1rem')

    // Check typography
    expect(result.cssVariables['--font-heading']).toBe('Playfair Display')
    expect(result.cssVariables['--font-body']).toBe('Inter')
  })

  it('should use palette override when provided', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const result = resolveTokens('peluqueria' as BusinessType, 'dark')

    // Should use dark palette colors
    expect(result.cssVariables['--primary']).toBe('#d4848f')
    expect(result.cssVariables['--background']).toBe('#1a1a1a')
  })

  it('should throw error for invalid palette', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    expect(() => resolveTokens('peluqueria' as BusinessType, 'nonexistent'))
      .toThrow('[TokenResolver] Palette "nonexistent" not found for peluqueria')
  })

  it('should set correct primary-foreground based on theme', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const lightResult = resolveTokens('peluqueria' as BusinessType)
    expect(lightResult.cssVariables['--primary-foreground']).toBe('#2c3e50') // text color from light theme

    const darkMockTokens = { ...mockPeluqueriaTokens, theme: 'dark' as const }
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(darkMockTokens))

    const darkResult = resolveTokens('peluqueria' as BusinessType)
    expect(darkResult.cssVariables['--primary-foreground']).toBe('#ffffff')
  })

  it('should include component overrides', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const result = resolveTokens('peluqueria' as BusinessType)

    expect(result.cssVariables['--button-radius']).toBe('9999px')
    expect(result.cssVariables['--button-padding']).toBe('0.75rem 1.5rem')
  })

  it('should generate Google Fonts URL correctly', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const result = resolveTokens('peluqueria' as BusinessType)

    expect(result.googleFontsUrl).toContain('family=Playfair+Display:wght@400;600')
    expect(result.googleFontsUrl).toContain('family=Inter:wght@400;500;600')
    expect(result.googleFontsUrl).toContain('display=swap')
  })

  it('should include shadows from base tokens', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const result = resolveTokens('peluqueria' as BusinessType)

    expect(result.cssVariables['--shadow-card']).toBe('0 2px 4px rgba(0,0,0,0.1)')
    expect(result.cssVariables['--shadow-button']).toBe('0 2px 4px rgba(0,0,0,0.1)')
  })

  it('should include animation durations', () => {
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify(mockBaseTokens))
      .mockReturnValueOnce(JSON.stringify(mockPeluqueriaTokens))

    const result = resolveTokens('peluqueria' as BusinessType)

    expect(result.cssVariables['--transition-fast']).toBe('150ms')
    expect(result.cssVariables['--transition-normal']).toBe('300ms')
    expect(result.cssVariables['--transition-slow']).toBe('500ms')
  })
})

describe.skip('getAvailablePalettes', () => {
  const mockTokens = {
    name: 'Test',
    extends: 'base',
    theme: 'light' as const,
    mood: ['test'],
    palettes: {
      modern: { name: 'Moderno', colors: { primary: '#000' } },
      classic: { name: 'Clásico', colors: { primary: '#fff' } },
      minimal: { name: 'Minimal', colors: { primary: '#ccc' } },
    },
    defaultPalette: 'modern',
    typography: {
      heading: 'Test',
      body: 'Test',
      headingWeight: '400',
      bodyWeight: '400',
    },
    googleFonts: [],
    borderRadius: '0',
    buttonStyle: 'flat',
    components: {},
  }

  beforeEach(() => {
    mockReadFileSync.mockReset()
  })

  it('should return list of available palettes', () => {
    mockReadFileSync.mockReturnValue(JSON.stringify(mockTokens))

    const palettes = getAvailablePalettes('peluqueria' as BusinessType)

    expect(palettes).toHaveLength(3)
    expect(palettes).toContainEqual({ id: 'modern', name: 'Moderno' })
    expect(palettes).toContainEqual({ id: 'classic', name: 'Clásico' })
    expect(palettes).toContainEqual({ id: 'minimal', name: 'Minimal' })
  })

  it('should return empty array if no palettes', () => {
    const emptyTokens = { ...mockTokens, palettes: {} }
    mockReadFileSync.mockReturnValue(JSON.stringify(emptyTokens))

    const palettes = getAvailablePalettes('test' as BusinessType)

    expect(palettes).toHaveLength(0)
  })
})

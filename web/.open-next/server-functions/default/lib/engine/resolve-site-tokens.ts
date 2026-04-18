/**
 * Resolves design tokens for a tenant site by layering:
 *   base tokens  →  vertical defaults  →  site overrides
 * Produces CSS custom properties for injection.
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { loadSiteTokens, loadVerticalTokens } from './site-loader'

interface PaletteColors {
  primary: string
  secondary: string
  accent?: string
  background: string
  surface: string
  text: string
  textLight?: string
  textMuted?: string
  surfaceLight?: string
  success?: string
  error?: string
  warning?: string
}

interface TokensFile {
  theme?: 'light' | 'dark'
  palettes?: Record<string, { name?: string; colors: PaletteColors }>
  defaultPalette?: string
  typography?: {
    heading?: string
    body?: string
    accent?: string
    headingWeight?: string
    bodyWeight?: string
    textTransform?: string
  }
  googleFonts?: string[]
  components?: Record<string, Record<string, unknown>>
}

interface BaseTokens {
  spacing: Record<string, { value: string }>
  borderRadius: Record<string, { value: string }>
  shadows: Record<string, { value: string }>
  typography: {
    scale: Record<string, { value: string }>
    lineHeight: Record<string, { value: string }>
  }
  animation: { duration: Record<string, { value: string }> }
}

function readJson<T>(relPath: string): T {
  const fullPath = resolve(process.cwd(), '..', relPath)
  return JSON.parse(readFileSync(fullPath, 'utf-8')) as T
}

function mergeTokens(a: TokensFile, b: TokensFile): TokensFile {
  return {
    theme: b.theme ?? a.theme,
    palettes: { ...(a.palettes || {}), ...(b.palettes || {}) },
    defaultPalette: b.defaultPalette ?? a.defaultPalette,
    typography: { ...(a.typography || {}), ...(b.typography || {}) },
    googleFonts: b.googleFonts ?? a.googleFonts,
    components: { ...(a.components || {}), ...(b.components || {}) },
  }
}

export interface SiteResolvedTokens {
  cssString: string
  googleFontsUrl: string
  isDark: boolean
}

export function resolveSiteTokens(
  verticalId: string,
  siteSlug: string,
): SiteResolvedTokens {
  const base = readJson<BaseTokens>('src/tokens/base.tokens.json')
  const vertical = loadVerticalTokens(verticalId) as TokensFile
  const site = loadSiteTokens(siteSlug) as TokensFile

  // Fallback to empty tokens object if files don't exist (Edge runtime or missing files)
  const safeVertical = vertical.palettes ? vertical : ({
    theme: 'light',
    palettes: {
      default: {
        name: 'Default',
        colors: {
          primary: '#1B2A4A',
          secondary: '#C9A96E',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          text: '#1B2A4A',
          textLight: '#4A4A4A',
          textMuted: '#777777',
          surfaceLight: '#F5F3EE',
          success: '#4a7c59',
          error: '#c0392b',
          warning: '#d9a441',
        }
      }
    },
    defaultPalette: 'default',
    typography: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
      headingWeight: '700',
      bodyWeight: '400',
    },
    googleFonts: ['Playfair+Display:wght@500;600;700', 'Inter:wght@400;500;600;700'],
    components: {}
  } as TokensFile)

  const merged = mergeTokens(safeVertical, site)

  const paletteName = merged.defaultPalette || 'default'
  const palette = merged.palettes?.[paletteName]
  if (!palette) {
    throw new Error(
      `[site-tokens] Palette "${paletteName}" missing for ${verticalId}/${siteSlug}`,
    )
  }
  const colors = palette.colors
  const theme = merged.theme || 'light'
  const typo = merged.typography || {}

  const vars: Record<string, string> = {
    '--primary': colors.primary,
    '--primary-foreground': theme === 'dark' ? colors.text : '#ffffff',
    '--secondary': colors.secondary,
    '--secondary-foreground': '#ffffff',
    '--accent': colors.accent || colors.secondary,
    '--accent-foreground': colors.text,
    '--background': colors.background,
    '--surface': colors.surface,
    '--surface-light': colors.surfaceLight || colors.surface,
    '--text': colors.text,
    '--text-light': colors.textLight || colors.textMuted || '#666666',
    '--text-muted': colors.textMuted || colors.textLight || '#888888',
    '--success': colors.success || '#4a7c59',
    '--error': colors.error || '#c0392b',
    '--warning': colors.warning || '#f39c12',
    '--font-heading': typo.heading || "'Playfair Display', serif",
    '--font-body': typo.body || "'Inter', sans-serif",
    '--font-accent': typo.accent || typo.body || "'Inter', sans-serif",
    '--heading-weight': typo.headingWeight || '700',
    '--body-weight': typo.bodyWeight || '400',
    '--heading-transform': typo.textTransform || 'none',
  }
  for (const [k, v] of Object.entries(base.spacing)) vars[`--spacing-${k}`] = v.value
  for (const [k, v] of Object.entries(base.borderRadius)) vars[`--radius-${k}`] = v.value
  vars['--shadow-card'] = base.shadows.card.value
  vars['--shadow-card-hover'] = base.shadows.cardHover.value
  vars['--shadow-button'] = base.shadows.button.value
  vars['--shadow-nav'] = base.shadows.nav.value
  for (const [k, v] of Object.entries(base.typography.scale)) vars[`--text-${k}`] = v.value
  for (const [k, v] of Object.entries(base.typography.lineHeight)) vars[`--leading-${k}`] = v.value
  vars['--transition-fast'] = base.animation.duration.fast.value
  vars['--transition-normal'] = base.animation.duration.default.value
  vars['--transition-slow'] = base.animation.duration.slow.value

  const googleFontsUrl = merged.googleFonts && merged.googleFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${merged.googleFonts.map((f) => `family=${f}`).join('&')}&display=swap`
    : ''
  const cssBody = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')
  return {
    cssString: `:root {\n${cssBody}\n}`,
    googleFontsUrl,
    isDark: theme === 'dark',
  }
}

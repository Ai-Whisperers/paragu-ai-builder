/**
 * Resolves design tokens for a tenant site by layering:
 *   base tokens  →  vertical defaults  →  site overrides
 * Produces CSS custom properties for injection.
 *
 * All three inputs come from the auto-generated tenant-data module
 * (see `scripts/generate-tenant-data.ts`) — no filesystem access at runtime.
 */
import { BASE_TOKENS } from './generated/tenant-data'
import { loadSiteTokens, loadVerticalTokens } from './site-loader'
import { PRELOADED_FONT_FAMILIES } from '@/lib/fonts'

/**
 * Rewrite a typography font-family CSS value so any preloaded font is
 * served via its `next/font/google` CSS variable, with the original
 * Google Fonts name kept as a fallback.
 */
function prependPreloadedVar(value: string | undefined): string | undefined {
  if (!value) return value
  const match = value.match(/^\s*['"]?([^,'"]+)['"]?/)
  const primary = match?.[1]?.trim()
  if (!primary) return value
  const cssVar = PRELOADED_FONT_FAMILIES[primary]
  if (!cssVar) return value
  return `${cssVar}, ${value}`
}

/**
 * Drop preloaded families from the tenant's googleFonts list — they're
 * self-hosted via root-layout next/font declarations, no CDN fetch needed.
 */
function stripPreloadedGoogleFonts(fonts: string[] | undefined): string[] {
  if (!fonts || fonts.length === 0) return []
  const preloaded = new Set(Object.keys(PRELOADED_FONT_FAMILIES))
  return fonts.filter((entry) => {
    const family = entry.split(':')[0].replace(/\+/g, ' ')
    return !preloaded.has(family)
  })
}

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
  semanticColors?: Record<string, { value: string }>
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
  const base = BASE_TOKENS as unknown as BaseTokens
  const vertical = loadVerticalTokens(verticalId) as TokensFile
  const site = loadSiteTokens(siteSlug) as TokensFile

  // Fallback to a sensible default palette if the vertical has no tokens yet.
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

  // Palette may optionally specify explicit foreground colors per role.
  // Without them we fall back to the theme-based default — which for dark
  // themes was `colors.text` (near-white). That's fine when `primary` is a
  // dark color (text pops against dark bg), but breaks when tenants choose
  // a LIGHT primary color for contrast against their dark page bg: the pill
  // then has white-ish text on light-ish bg → invisible.
  const pc = colors as unknown as Record<string, string | undefined>
  const vars: Record<string, string> = {
    '--primary': colors.primary,
    '--primary-foreground': pc.primaryForeground || (theme === 'dark' ? colors.text : '#ffffff'),
    '--secondary': colors.secondary,
    '--secondary-foreground': pc.secondaryForeground || '#ffffff',
    '--accent': colors.accent || colors.secondary,
    '--accent-foreground': pc.accentForeground || colors.text,
    '--background': colors.background,
    '--surface': colors.surface,
    '--surface-light': colors.surfaceLight || colors.surface,
    '--text': colors.text,
    '--text-light': colors.textLight || colors.textMuted || '#666666',
    '--text-muted': colors.textMuted || colors.textLight || '#888888',
    '--success': colors.success || '#4a7c59',
    '--error': colors.error || '#c0392b',
    '--warning': colors.warning || '#f39c12',
    '--font-heading': prependPreloadedVar(typo.heading) || prependPreloadedVar("'Playfair Display', serif")!,
    '--font-body': prependPreloadedVar(typo.body) || prependPreloadedVar("'Inter', sans-serif")!,
    '--font-accent': prependPreloadedVar(typo.accent) || prependPreloadedVar(typo.body) || prependPreloadedVar("'Inter', sans-serif")!,
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

  // Semantic colors — success/error/warning/info + matching surfaces. The
  // palette can already override --success/--error/--warning above; here we
  // also emit --color-* variants so components have one canonical name to
  // reach for (--color-success, --color-error-surface, etc.).
  if (base.semanticColors) {
    for (const [key, token] of Object.entries(base.semanticColors)) {
      const cssKey = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
      vars[`--color-${cssKey}`] = token.value
    }
  }
  // Backwards-compat: map the palette overrides onto the new names too.
  if (colors.success && !vars['--color-success']) vars['--color-success'] = colors.success
  if (colors.error && !vars['--color-error']) vars['--color-error'] = colors.error
  if (colors.warning && !vars['--color-warning']) vars['--color-warning'] = colors.warning

  const remainingFonts = stripPreloadedGoogleFonts(merged.googleFonts)
  const googleFontsUrl = remainingFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${remainingFonts.map((f) => `family=${f}`).join('&')}&display=swap`
    : ''
  // Emit custom component-level CSS variables from site tokens
  // e.g. "components: { portfolio: { gap: '1.5rem' } }" → --portfolio-gap: 1.5rem
  for (const [compKey, compVal] of Object.entries(merged.components || {})) {
    for (const [propKey, propVal] of Object.entries(compVal as Record<string, string>)) {
      vars[`--${compKey}-${propKey.replace(/_/g, '-')}`] = propVal as string
    }
  }

  const cssBody = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')
  return {
    cssString: `:root {\n${cssBody}\n}`,
    googleFontsUrl,
    isDark: theme === 'dark',
  }
}

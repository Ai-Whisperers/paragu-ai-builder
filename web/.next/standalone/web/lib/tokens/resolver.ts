/**
 * Token Resolver - converts JSON design tokens to CSS custom properties.
 *
 * Pipeline: src/tokens/[type].tokens.json → merge with base → CSS variables
 *
 * Each business type has its own token file with palettes, typography, and
 * component overrides. The resolver merges type tokens with base tokens
 * and flattens them into a CSS string for injection into the page.
 */

import type { BusinessType } from '@/lib/types'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

export interface TokenColors {
  primary: string
  secondary: string
  accent?: string
  background: string
  surface: string
  text: string
  textLight?: string
  textMuted?: string
  success?: string
  error?: string
  warning?: string
  surfaceLight?: string
  secondaryHover?: string
}

export interface TokenTypography {
  heading: string
  body: string
  accent?: string
  headingWeight: string
  bodyWeight: string
  textTransform?: string
}

export interface TypeTokens {
  name: string
  extends: string
  theme: 'light' | 'dark'
  mood: string[]
  palettes: Record<string, { name: string; colors: TokenColors }>
  defaultPalette: string
  typography: TokenTypography
  googleFonts: string[]
  borderRadius: string
  buttonStyle: string
  components: Record<string, Record<string, unknown>>
}

export interface BaseTokens {
  spacing: Record<string, { value: string }>
  borderRadius: Record<string, { value: string }>
  shadows: Record<string, { value: string }>
  typography: {
    scale: Record<string, { value: string }>
    lineHeight: Record<string, { value: string }>
  }
  animation: {
    duration: Record<string, { value: string }>
  }
  layout: Record<string, Record<string, { value: string }>>
  semanticColors?: Record<string, { value: string }>
}

export interface ResolvedTokens {
  cssVariables: Record<string, string>
  cssString: string
  googleFontsUrl: string
  theme: 'light' | 'dark'
}

// See resolve-site-tokens.ts — same rationale.
const PROJECT_ROOT = (() => {
  if (process.env.SRC_DIR) return resolve(process.env.SRC_DIR, '..')
  const cwd = process.cwd()
  return existsSync(resolve(cwd, 'src')) ? cwd : resolve(cwd, '..')
})()

function loadJsonFile<T>(relativePath: string): T {
  const fullPath = resolve(PROJECT_ROOT, relativePath)
  const content = readFileSync(fullPath, 'utf-8')
  return JSON.parse(content)
}

import { verticalFolder } from '@/lib/verticals-catalog'
import { getRegistry } from '@/lib/engine/static-config'

/**
 * Load type tokens. Three paths, in order:
 *
 * 1. The type has its own concrete token file with palettes → use it directly.
 * 2. The type has a thin wrapper (`extends: "vertical:<id>"`) → merge the
 *    wrapper overrides onto the vertical defaults.
 * 3. The type token file doesn't exist at all (the common case after we
 *    eliminated the ~1,800 wrapper stubs) → look up the verticalId from the
 *    registry entry and load the vertical defaults straight.
 *
 * Every path resolves the on-disk folder via `verticalFolder()` which consults
 * the single vertical catalog at src/verticals/catalog.json.
 */
function loadTypeTokens(businessType: BusinessType): TypeTokens {
  let raw: (Partial<TypeTokens> & { extends?: string }) | null = null
  try {
    raw = loadJsonFile<Partial<TypeTokens> & { extends?: string }>(
      `src/tokens/${businessType}.tokens.json`,
    )
  } catch {
    // No per-type file — fall through to vertical defaults via registry lookup.
  }

  // Wrapper pattern: explicit `extends: "vertical:<id>"` → merge.
  if (raw?.extends?.startsWith('vertical:')) {
    const verticalId = raw.extends.slice('vertical:'.length)
    const verticalDefaults = loadJsonFile<TypeTokens>(
      `src/verticals/${verticalFolder(verticalId)}/defaults.tokens.json`,
    )
    return { ...verticalDefaults, ...raw, extends: raw.extends } as TypeTokens
  }

  // Concrete palette file present → use as-is.
  if (raw?.palettes) return raw as TypeTokens

  // No token file at all — derive vertical from the registry entry.
  const registry = getRegistry(businessType) as { verticalId?: string } | null
  if (!registry?.verticalId) {
    throw new Error(
      `[TokenResolver] No tokens found for "${businessType}" and no verticalId in registry. Create src/tokens/${businessType}.tokens.json or assign verticalId in registry.`,
    )
  }
  return loadJsonFile<TypeTokens>(
    `src/verticals/${verticalFolder(registry.verticalId)}/defaults.tokens.json`,
  )
}

/**
 * Resolve tokens for a business type into CSS custom properties.
 */
export function resolveTokens(
  businessType: BusinessType,
  paletteOverride?: string
): ResolvedTokens {
  const base = loadJsonFile<BaseTokens>('src/tokens/base.tokens.json')
  const type = loadTypeTokens(businessType)

  const paletteName = paletteOverride || type.defaultPalette
  const palette = type.palettes[paletteName]
  if (!palette) {
    throw new Error(`[TokenResolver] Palette "${paletteName}" not found for ${businessType}`)
  }
  const colors = palette.colors
  const pc = colors as Record<string, string | undefined>

  const vars: Record<string, string> = {}

  // Colors from type palette. Foregrounds are overridable per palette —
  // without them, dark themes default to `colors.text`, which breaks when
  // `primary` is also a light color (white text on light bg = invisible).
  vars['--primary'] = colors.primary
  vars['--primary-foreground'] = pc.primaryForeground || (type.theme === 'dark' ? colors.text : '#ffffff')
  vars['--secondary'] = colors.secondary
  vars['--secondary-foreground'] = pc.secondaryForeground || '#ffffff'
  vars['--accent'] = colors.accent || colors.secondary
  vars['--accent-foreground'] = pc.accentForeground || colors.text
  vars['--background'] = colors.background
  vars['--surface'] = colors.surface
  vars['--surface-light'] = colors.surfaceLight || colors.surface
  vars['--text'] = colors.text
  vars['--text-light'] = colors.textLight || colors.textMuted || '#666666'
  vars['--text-muted'] = colors.textMuted || colors.textLight || '#888888'
  vars['--success'] = colors.success || '#4a7c59'
  vars['--error'] = colors.error || '#c0392b'
  vars['--warning'] = colors.warning || '#f39c12'
  vars['--secondary-hover'] = colors.secondaryHover || colors.secondary

  // Typography
  vars['--font-heading'] = type.typography.heading
  vars['--font-body'] = type.typography.body
  vars['--font-accent'] = type.typography.accent || type.typography.body
  vars['--heading-weight'] = type.typography.headingWeight
  vars['--body-weight'] = type.typography.bodyWeight
  vars['--heading-transform'] = type.typography.textTransform || 'none'

  // Spacing from base
  for (const [key, token] of Object.entries(base.spacing)) {
    vars[`--spacing-${key}`] = token.value
  }

  // Border radius from base
  for (const [key, token] of Object.entries(base.borderRadius)) {
    vars[`--radius-${key}`] = token.value
  }

  // Shadows from base
  vars['--shadow-card'] = base.shadows.card.value
  vars['--shadow-card-hover'] = base.shadows.cardHover.value
  vars['--shadow-button'] = base.shadows.button.value
  vars['--shadow-nav'] = base.shadows.nav.value

  // Semantic colors (success/error/warning/info). Types can override by
  // declaring their own `semanticColors` block; otherwise they inherit
  // these neutral defaults.
  if (base.semanticColors) {
    for (const [key, token] of Object.entries(base.semanticColors)) {
      // Camel → kebab for css (successSurface → success-surface)
      const cssKey = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
      vars[`--color-${cssKey}`] = token.value
    }
  }
  const typeSemantic = (type as { semanticColors?: Record<string, { value: string } | string> }).semanticColors
  if (typeSemantic) {
    for (const [key, token] of Object.entries(typeSemantic)) {
      const cssKey = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
      const value = typeof token === 'string' ? token : token.value
      vars[`--color-${cssKey}`] = value
    }
  }

  // Typography scale from base
  for (const [key, token] of Object.entries(base.typography.scale)) {
    vars[`--text-${key}`] = token.value
  }
  for (const [key, token] of Object.entries(base.typography.lineHeight)) {
    vars[`--leading-${key}`] = token.value
  }

  // Animation from base
  vars['--transition-fast'] = base.animation.duration.fast.value
  vars['--transition-normal'] = base.animation.duration.default.value
  vars['--transition-slow'] = base.animation.duration.slow.value

  // Layout from base
  if (base.layout?.grid) {
    vars['--grid-gap'] = base.layout.grid.gap.value
  }

  // Button component overrides from type
  if (type.components?.button) {
    const btn = type.components.button
    if (btn.borderRadius) vars['--button-radius'] = btn.borderRadius as string
    if (btn.padding) vars['--button-padding'] = btn.padding as string
    if (btn.textTransform) vars['--button-transform'] = btn.textTransform as string
    if (btn.fontWeight) vars['--button-weight'] = btn.fontWeight as string
  }

  // Google Fonts URL
  const googleFontsUrl = type.googleFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${type.googleFonts.map((f) => `family=${f}`).join('&')}&display=swap`
    : ''

  // Build CSS string
  const cssString = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ')

  return {
    cssVariables: vars,
    cssString: `:root {\n  ${cssString}\n}`,
    googleFontsUrl,
    theme: type.theme,
  }
}

/**
 * Get the list of available palettes for a business type.
 */
export function getAvailablePalettes(
  businessType: BusinessType
): Array<{ id: string; name: string }> {
  const type = loadJsonFile<TypeTokens>(`src/tokens/${businessType}.tokens.json`)
  return Object.entries(type.palettes).map(([id, palette]) => ({
    id,
    name: palette.name,
  }))
}

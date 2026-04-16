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
import { loadContent } from '@/lib/content/loader'
import {
  baseTokensSchema,
  typeTokensSchema,
  type BaseTokens,
  type TypeTokens,
} from '@/lib/content/schemas'

// Re-exported for consumers that want the structural types.
export type { BaseTokens, TypeTokens } from '@/lib/content/schemas'

export interface ResolvedTokens {
  cssVariables: Record<string, string>
  cssString: string
  googleFontsUrl: string
  theme: 'light' | 'dark'
}

function loadBaseTokens(): BaseTokens {
  return loadContent('tokens', 'base.tokens.json', baseTokensSchema)
}

function loadTypeTokens(businessType: BusinessType): TypeTokens {
  return loadContent('tokens', `${businessType}.tokens.json`, typeTokensSchema)
}

/**
 * Resolve tokens for a business type into CSS custom properties.
 */
export function resolveTokens(
  businessType: BusinessType,
  paletteOverride?: string
): ResolvedTokens {
  const base = loadBaseTokens()
  const type = loadTypeTokens(businessType)

  const paletteName = paletteOverride || type.defaultPalette
  const palette = type.palettes[paletteName]
  if (!palette) {
    throw new Error(
      `[TokenResolver] Palette "${paletteName}" not found for ${businessType}`
    )
  }
  const colors = palette.colors

  const vars: Record<string, string> = {}

  // Colors from type palette
  vars['--primary'] = colors.primary
  vars['--primary-foreground'] = type.theme === 'dark' ? colors.text : '#ffffff'
  vars['--secondary'] = colors.secondary
  vars['--secondary-foreground'] = '#ffffff'
  vars['--accent'] = colors.accent || colors.secondary
  vars['--accent-foreground'] = colors.text
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
  const gridGap = base.layout?.grid?.gap?.value
  if (gridGap) vars['--grid-gap'] = gridGap

  // Button component overrides from type
  const btn = type.components?.button
  if (btn) {
    if (typeof btn.borderRadius === 'string') vars['--button-radius'] = btn.borderRadius
    if (typeof btn.padding === 'string') vars['--button-padding'] = btn.padding
    if (typeof btn.textTransform === 'string') vars['--button-transform'] = btn.textTransform
    if (typeof btn.fontWeight === 'string') vars['--button-weight'] = btn.fontWeight
  }

  // Google Fonts URL
  const googleFontsUrl =
    type.googleFonts.length > 0
      ? `https://fonts.googleapis.com/css2?${type.googleFonts
          .map((f) => `family=${f}`)
          .join('&')}&display=swap`
      : ''

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
  const type = loadTypeTokens(businessType)
  return Object.entries(type.palettes).map(([id, palette]) => ({
    id,
    name: palette.name,
  }))
}

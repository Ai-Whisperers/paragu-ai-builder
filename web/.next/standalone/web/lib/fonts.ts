/**
 * Pre-declared Google Fonts, served via `next/font/google`.
 *
 * The top 6 font families by tenant usage (Inter, Playfair Display,
 * Cormorant Garamond, Montserrat, Oswald, Lora) cover ~79 of ~100
 * tenant-level font uses. Declaring them statically here lets Next.js
 * self-host the WOFF2 files, auto-preload the critical subset, and
 * eliminate the external `fonts.googleapis.com` stylesheet request —
 * the single biggest remaining render-blocking resource on tenant
 * pages.
 *
 * Tenants whose `typography.heading` / `typography.body` resolves to
 * one of these families get the self-hosted version automatically via
 * `resolve-site-tokens.ts` + `PRELOADED_FONT_FAMILIES` below. Tenants
 * using rarer fonts (long tail in `src/tokens/*.tokens.json`) still
 * flow through the CDN pipeline as before — no regression.
 *
 * NOTE: `next/font/google` arguments must be statically analyzable by
 * Turbopack — no spreads, no dynamic values, no shared config objects.
 * Each call below inlines its full options literal on purpose; do not
 * refactor into a helper that builds options dynamically.
 */
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Montserrat,
  Oswald,
  Lora,
} from 'next/font/google'

export const fontInter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export const fontPlayfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const fontCormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
})

export const fontMontserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

export const fontOswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
})

export const fontLora = Lora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
})

export const preloadedFonts = [
  fontInter,
  fontPlayfair,
  fontCormorant,
  fontMontserrat,
  fontOswald,
  fontLora,
]

/**
 * Map human font-family name → CSS variable reference.
 *
 * `resolveSiteTokens` uses this to:
 *   1. Detect when a tenant's declared font matches a preloaded one
 *   2. Substitute the CSS variable for the font-family in emitted CSS
 *   3. Strip the matching entry from `googleFonts` so the CDN stylesheet
 *      doesn't double-load the font
 */
export const PRELOADED_FONT_FAMILIES: Record<string, string> = {
  Inter: 'var(--font-inter)',
  'Playfair Display': 'var(--font-playfair)',
  'Cormorant Garamond': 'var(--font-cormorant)',
  Montserrat: 'var(--font-montserrat)',
  Oswald: 'var(--font-oswald)',
  Lora: 'var(--font-lora)',
}

/**
 * Whitespace-separated CSS class names from all preloaded fonts. Apply to
 * the root `<html>` (or any wrapping element) so every preloaded font's
 * CSS variable is in scope for descendant rules.
 */
export const rootFontVariables = preloadedFonts.map((f) => f.variable).join(' ')

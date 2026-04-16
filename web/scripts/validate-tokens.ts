#!/usr/bin/env npx tsx
/**
 * Validate all business type design token files.
 * Ensures every token file has required palettes, typography, and components.
 */

import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

const TOKENS_DIR = resolve(__dirname, '../../src/tokens')

function loadJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

const REQUIRED_COLOR_KEYS = ['primary', 'secondary', 'background', 'surface', 'text']
const REQUIRED_TYPOGRAPHY_KEYS = ['heading', 'body', 'headingWeight', 'bodyWeight']

function main() {
  const files = readdirSync(TOKENS_DIR).filter(f => f.endsWith('.tokens.json'))
  let errors = 0

  console.log(`Validating ${files.length} token files...\n`)

  for (const file of files) {
    const path = resolve(TOKENS_DIR, file)
    try {
      const tokens = loadJson(path)
      const issues: string[] = []

      if (file === 'base.tokens.json') {
        // Base tokens have different structure
        if (!tokens.spacing) issues.push('missing spacing')
        if (!tokens.shadows) issues.push('missing shadows')
        if (!tokens.typography?.scale) issues.push('missing typography.scale')
        if (!tokens.animation?.duration) issues.push('missing animation.duration')
      } else {
        // Type tokens
        if (!tokens.name) issues.push('missing name')
        if (!tokens.theme) issues.push('missing theme')
        if (!tokens.palettes) issues.push('missing palettes')
        if (!tokens.defaultPalette) issues.push('missing defaultPalette')
        if (!tokens.typography) issues.push('missing typography')
        if (!tokens.googleFonts || tokens.googleFonts.length === 0) issues.push('missing googleFonts')

        // Validate default palette exists
        if (tokens.palettes && tokens.defaultPalette) {
          if (!tokens.palettes[tokens.defaultPalette]) {
            issues.push(`defaultPalette "${tokens.defaultPalette}" not found in palettes`)
          }
        }

        // Validate palette colors
        if (tokens.palettes) {
          for (const [id, palette] of Object.entries(tokens.palettes)) {
            const colors = (palette as { colors?: Record<string, string> }).colors || {}
            for (const key of REQUIRED_COLOR_KEYS) {
              if (!colors[key]) issues.push(`palette "${id}" missing color: ${key}`)
            }
          }
        }

        // Validate typography
        if (tokens.typography) {
          for (const key of REQUIRED_TYPOGRAPHY_KEYS) {
            if (!tokens.typography[key]) issues.push(`missing typography.${key}`)
          }
        }
      }

      if (issues.length > 0) {
        console.error(`✗ ${file}: ${issues.join(', ')}`)
        errors += issues.length
      } else {
        const paletteCount = tokens.palettes ? Object.keys(tokens.palettes).length : 0
        console.log(`✓ ${file}${paletteCount > 0 ? ` (${paletteCount} palettes)` : ''}`)
      }
    } catch (e) {
      console.error(`✗ ${file}: ${e instanceof Error ? e.message : 'parse error'}`)
      errors++
    }
  }

  console.log(`\n${files.length} token files checked, ${errors} errors`)
  process.exit(errors > 0 ? 1 : 0)
}

main()

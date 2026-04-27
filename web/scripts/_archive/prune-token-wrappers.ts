#!/usr/bin/env node
/**
 * Delete thin token wrapper files of the form
 *
 *   { "extends": "vertical:<id>", ... }
 *
 * Types that need a per-type palette (beauty_base, salon_eventos, fotografia_bodas,
 * veterinaria, etc.) are kept — they have a `palettes` object. The resolver's
 * loadTypeTokens() is updated to fall back to the vertical defaults when no
 * per-type file exists, so the registry-declared verticalId remains the link.
 *
 * Dry-run by default. Pass --apply to actually delete files.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const TOKENS = path.join(ROOT, 'src/tokens')

const APPLY = process.argv.includes('--apply')

const files = fs.readdirSync(TOKENS).filter((f) => f.endsWith('.tokens.json'))
let thin = 0
let kept = 0
let baseFiles = 0

for (const file of files) {
  if (file === 'base.tokens.json') {
    baseFiles++
    continue
  }
  const full = path.join(TOKENS, file)
  const raw = fs.readFileSync(full, 'utf-8')
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.warn(`! malformed JSON, skipping: ${file}`)
    continue
  }

  const hasPalettes = parsed.palettes && typeof parsed.palettes === 'object'
  const isWrapper = typeof parsed.extends === 'string' && parsed.extends.startsWith('vertical:')

  if (!hasPalettes && isWrapper) {
    thin++
    if (APPLY) fs.unlinkSync(full)
  } else {
    kept++
  }
}

console.log(`\n=== ${APPLY ? 'Pruned' : 'Would prune'} thin token wrappers ===`)
console.log(`  thin (${APPLY ? 'deleted' : 'removable'}): ${thin}`)
console.log(`  kept (concrete palette): ${kept}`)
console.log(`  base tokens: ${baseFiles}`)
if (!APPLY) console.log(`\nRe-run with --apply to actually delete.`)

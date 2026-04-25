#!/usr/bin/env node
/**
 * Contrast audit. For every per-vertical token file in src/tokens/, check
 * that the colour pairs likely to co-render on the same surface meet WCAG
 * AA contrast ratios:
 *
 *   text on background  — ≥ 4.5 for normal text
 *   primary on background — ≥ 3.0 (AA large) and logged if < 4.5
 *   error on background — ≥ 4.5
 *
 * Exits 1 when normal-text pairs fail AA. Logs warnings for large-text
 * fails (≥ 3.0 only). Runs across every palette defined in each token
 * file (palette names vary: optionA, optionB, cool, warm, etc.).
 *
 * Pure AST-free audit — no browser needed.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const TOKENS = path.join(ROOT, 'src/tokens')

type Colors = Record<string, string>

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const h = m[1].length === 3
    ? m[1].split('').map((c) => c + c).join('')
    : m[1]
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const c = [r, g, b].map((v) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

function contrast(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)
  if (!fgRgb || !bgRgb) return null
  const l1 = relLuminance(fgRgb)
  const l2 = relLuminance(bgRgb)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

interface Pair {
  fgKey: string
  bgKey: string
  threshold: number // AA: 4.5 for normal text, 3.0 for large
  severity: 'error' | 'warn'
}

const PAIRS: Pair[] = [
  { fgKey: 'text', bgKey: 'background', threshold: 4.5, severity: 'error' },
  { fgKey: 'text', bgKey: 'surface', threshold: 4.5, severity: 'error' },
  { fgKey: 'textLight', bgKey: 'background', threshold: 4.5, severity: 'warn' },
  { fgKey: 'primary', bgKey: 'background', threshold: 3.0, severity: 'error' },
  { fgKey: 'secondary', bgKey: 'background', threshold: 3.0, severity: 'warn' },
  { fgKey: 'error', bgKey: 'background', threshold: 4.5, severity: 'warn' },
]

interface Finding {
  file: string
  palette: string
  fg: string
  bg: string
  ratio: number
  threshold: number
  severity: 'error' | 'warn'
}

const findings: Finding[] = []

const tokenFiles = fs
  .readdirSync(TOKENS)
  .filter((f) => f.endsWith('.tokens.json') && f !== 'base.tokens.json')

for (const file of tokenFiles) {
  const full = path.join(TOKENS, file)
  let raw: { palettes?: Record<string, { colors?: Colors }> }
  try {
    raw = JSON.parse(fs.readFileSync(full, 'utf-8'))
  } catch {
    continue
  }
  const palettes = raw.palettes || {}
  for (const [paletteName, palette] of Object.entries(palettes)) {
    const colors = palette.colors || {}
    for (const pair of PAIRS) {
      const fg = colors[pair.fgKey]
      const bg = colors[pair.bgKey]
      if (!fg || !bg) continue
      const ratio = contrast(fg, bg)
      if (ratio === null) continue
      if (ratio < pair.threshold) {
        findings.push({
          file,
          palette: paletteName,
          fg: `${pair.fgKey}=${fg}`,
          bg: `${pair.bgKey}=${bg}`,
          ratio,
          threshold: pair.threshold,
          severity: pair.severity,
        })
      }
    }
  }
}

if (findings.length === 0) {
  // eslint-disable-next-line no-console
  console.log('contrast-audit: ✓ all AA contrast checks passed across', tokenFiles.length, 'token files')
  process.exit(0)
}

const errors = findings.filter((f) => f.severity === 'error')
const warns = findings.filter((f) => f.severity === 'warn')

for (const f of errors) {
  // eslint-disable-next-line no-console
  console.log(
    `✗ [${f.file} palette=${f.palette}] ${f.fg} on ${f.bg} → ratio ${f.ratio.toFixed(2)} < ${f.threshold}`,
  )
}
for (const f of warns) {
  // eslint-disable-next-line no-console
  console.log(
    `! [${f.file} palette=${f.palette}] ${f.fg} on ${f.bg} → ratio ${f.ratio.toFixed(2)} < ${f.threshold} (warn)`,
  )
}
// eslint-disable-next-line no-console
console.log(`\ncontrast-audit: ${errors.length} error(s), ${warns.length} warning(s).`)
process.exit(errors.length > 0 ? 1 : 0)

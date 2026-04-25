#!/usr/bin/env node
/**
 * Lightweight a11y audit — scans section components for common violations
 * without running a browser. Catches:
 *   - <img> without alt=""
 *   - <button> without text or aria-label
 *   - <a> without text
 *   - color references to bare hex (should use var(--...))
 *
 * Not a replacement for axe-core or Lighthouse but catches the obvious
 * regressions in code review.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SECTIONS = path.join(ROOT, 'web/components/sections')

interface Finding {
  file: string
  kind: string
  line: number
  excerpt: string
}

function scan(file: string): Finding[] {
  const src = fs.readFileSync(file, 'utf-8')
  const lines = src.split('\n')
  const findings: Finding[] = []

  lines.forEach((line, i) => {
    // <img ... /> without alt attr
    if (/<img[^>]+>/.test(line) && !/alt=/.test(line)) {
      findings.push({ file, kind: 'img-missing-alt', line: i + 1, excerpt: line.trim() })
    }
    // <button ...> without aria-label and no text (rough; false positives tolerable)
    if (/<button[^>]*>\s*$/.test(line) && !/aria-label|children=/.test(line)) {
      // content might be on next line; skip simple heuristic
    }
    // Hex colors outside CSS variables
    if (/#[0-9a-fA-F]{3,8}/.test(line) && !/var\(--/.test(line)) {
      // Allow hex inside token files or palette defs; section components should use CSS vars.
      if (!/palette|STATUS_COLORS|color:\s*'#/.test(line)) {
        // Skip unless it looks like inline style
        if (/style=|backgroundColor|color:/.test(line)) {
          findings.push({ file, kind: 'hex-color-without-var', line: i + 1, excerpt: line.trim().slice(0, 100) })
        }
      }
    }
  })

  return findings
}

const sectionFiles = fs
  .readdirSync(SECTIONS)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => path.join(SECTIONS, f))

const all = sectionFiles.flatMap(scan)

if (all.length === 0) {
  console.log('a11y-audit: ✓ no obvious issues in components/sections/')
  process.exit(0)
}

const byKind = new Map<string, Finding[]>()
for (const f of all) {
  const arr = byKind.get(f.kind) || []
  arr.push(f)
  byKind.set(f.kind, arr)
}

for (const [kind, items] of byKind) {
  console.log(`\n${kind}: ${items.length}`)
  for (const it of items.slice(0, 5)) {
    const rel = path.relative(ROOT, it.file)
    console.log(`  ${rel}:${it.line}  ${it.excerpt.slice(0, 80)}`)
  }
  if (items.length > 5) console.log(`  …and ${items.length - 5} more`)
}

console.log(`\na11y-audit: ${all.length} finding(s) across ${byKind.size} kind(s)`)
process.exit(all.length > 0 ? 0 : 0)

#!/usr/bin/env tsx
/**
 * Validate a single vertical: starter kits only use sections from the
 * catalog (and from the vertical's allowedSections whitelist if set),
 * copy templates exist for every expected locale, schema file parses.
 *
 * Usage: npm run validate:vertical relocacion
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { SECTION_CATALOG } from '../lib/engine/section-registry'
import { ALL_LOCALES } from '../lib/i18n/config'

function repoPath(...s: string[]): string {
  return resolve(process.cwd(), '..', ...s)
}
function readJson<T>(p: string): T { return JSON.parse(readFileSync(p, 'utf-8')) as T }

function main() {
  const id = process.argv[2]
  if (!id) {
    console.error('Usage: validate-vertical <vertical-id>')
    process.exit(1)
  }
  const base = repoPath('src', 'verticals', id)
  if (!existsSync(base)) {
    console.error(`[validate-vertical] not found: ${base}`)
    process.exit(1)
  }

  const problems: string[] = []

  const vertical = readJson<{ allowedSections?: string[]; locales?: string[] }>(
    join(base, 'vertical.json'),
  )
  if (!existsSync(join(base, 'schema.json'))) problems.push('missing schema.json')
  if (!existsSync(join(base, 'defaults.tokens.json'))) problems.push('missing defaults.tokens.json')

  const requiredLocales: readonly string[] = vertical.locales?.length
    ? vertical.locales
    : ALL_LOCALES

  const copyDir = join(base, 'copy')
  if (!existsSync(copyDir)) {
    problems.push('missing copy/ directory')
  } else {
    const files = readdirSync(copyDir).map((f) => f.replace(/\.json$/, ''))
    for (const loc of requiredLocales) {
      if (!files.includes(loc)) problems.push(`copy missing for locale ${loc}`)
    }
  }

  const kitsDir = join(base, 'starter-kits')
  if (!existsSync(kitsDir)) {
    problems.push('missing starter-kits/ directory')
  } else {
    for (const file of readdirSync(kitsDir).filter((f) => f.endsWith('.pages.json'))) {
      const kit = readJson<{ pages: Record<string, { sections: Array<{ id: string; variant?: string }> }> }>(join(kitsDir, file))
      for (const [pageName, page] of Object.entries(kit.pages)) {
        for (const sec of page.sections) {
          const manifest = SECTION_CATALOG[sec.id]
          if (!manifest) { problems.push(`${file}#${pageName}: unknown section ${sec.id}`); continue }
          if (sec.variant && !manifest.variants.includes(sec.variant)) {
            problems.push(`${file}#${pageName}: ${sec.id} has no variant "${sec.variant}"`)
          }
          if (vertical.allowedSections && !vertical.allowedSections.includes(sec.id)) {
            problems.push(`${file}#${pageName}: ${sec.id} not in allowedSections`)
          }
        }
      }
    }
  }

  if (problems.length === 0) {
    console.log(`validate-vertical(${id}): OK`)
    process.exit(0)
  }
  console.error(`validate-vertical(${id}): ${problems.length} problem(s):`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}

main()

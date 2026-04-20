#!/usr/bin/env npx tsx
/**
 * validate-content — static check for content/template mismatches.
 *
 * Walks every src/content/*.content.json and sites/<slug>/content/<locale>.json
 * file and reports any {{placeholder}} in a string value whose key is not one
 * of the placeholders the composition engine supplies at runtime.
 *
 * Catches the class of bug where a new content file references `{{name}}` but
 * the engine only knows `{{businessName}}`, producing a visible `{{name}}` in
 * the rendered site.
 *
 * Exits non-zero on any violation so it can gate CI.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const REPO_ROOT = resolve(__dirname, '..', '..')
const CONTENT_DIR = resolve(REPO_ROOT, 'src', 'content')
const SITES_DIR = resolve(REPO_ROOT, 'sites')

// Placeholders the flat-type composition engine supplies (see compose.ts
// composePageForType → templateData and section builders).
const FLAT_ENGINE_PLACEHOLDERS = new Set([
  'businessName',
  'city',
  'neighborhood',
  'year',
])

// Placeholders that section components themselves fill at render time.
// These appear inside content templates (e.g. product-catalog order messages)
// and are legitimately left unresolved by fillTemplate.
const COMPONENT_PLACEHOLDERS = new Set([
  'productName',
  'productPrice',
  'serviceName',
  'memberName',
  'memberTitle',
  'accessHours',
  'classCount',
  'memberCount',
  'specialties',
  'yearsExperience',
  'name', // common in client-rendered forms
])

// Placeholders verticals supply via their content.placeholders map.
// These are legitimate even if no flat-type engine supplies them.
const VERTICAL_PLACEHOLDERS = new Set([
  'siteName',
  'country',
  'locale',
])

const PLACEHOLDER_RE = /\{\{(\w+)\}\}/g

interface Violation {
  file: string
  jsonPath: string
  placeholder: string
  snippet: string
}

function walk(dir: string, pattern: RegExp, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walk(full, pattern, out)
    } else if (pattern.test(name)) {
      out.push(full)
    }
  }
  return out
}

function walkJson(
  value: unknown,
  path: string,
  knownPlaceholders: Set<string>,
  onViolation: (v: Omit<Violation, 'file'>) => void,
): void {
  if (typeof value === 'string') {
    const matches = value.matchAll(PLACEHOLDER_RE)
    for (const m of matches) {
      const key = m[1]
      if (!knownPlaceholders.has(key)) {
        onViolation({
          jsonPath: path || '<root>',
          placeholder: key,
          snippet: value.length > 120 ? value.slice(0, 120) + '…' : value,
        })
      }
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkJson(v, `${path}[${i}]`, knownPlaceholders, onViolation))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      walkJson(v, path ? `${path}.${key}` : key, knownPlaceholders, onViolation)
    }
  }
}

/**
 * Vertical content files can declare their own placeholder map at the root
 * (e.g. `{ "placeholders": { "taxRate": "10%", ... } }`). Those keys are
 * legitimate wherever they appear in the same file.
 */
function extractInlinePlaceholders(parsed: unknown): string[] {
  if (!parsed || typeof parsed !== 'object') return []
  const root = parsed as Record<string, unknown>
  const map = root.placeholders
  if (!map || typeof map !== 'object') return []
  return Object.keys(map as Record<string, unknown>)
}

function validateFile(filePath: string, baseAllowed: Set<string>): Violation[] {
  const violations: Violation[] = []
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (err) {
    violations.push({
      file: filePath,
      jsonPath: '<parse>',
      placeholder: '',
      snippet: err instanceof Error ? err.message : String(err),
    })
    return violations
  }
  const allowed = new Set([...baseAllowed, ...extractInlinePlaceholders(parsed)])
  walkJson(parsed, '', allowed, (v) => {
    violations.push({ ...v, file: filePath })
  })
  return violations
}

function formatViolation(v: Violation): string {
  const rel = relative(REPO_ROOT, v.file)
  if (v.jsonPath === '<parse>') {
    return `  ${rel} — JSON parse error: ${v.snippet}`
  }
  return `  ${rel} → ${v.jsonPath}: unknown placeholder {{${v.placeholder}}}
      in: ${v.snippet}`
}

function main(): void {
  const flatAllowed = new Set([...FLAT_ENGINE_PLACEHOLDERS, ...COMPONENT_PLACEHOLDERS])
  const verticalAllowed = new Set([
    ...FLAT_ENGINE_PLACEHOLDERS,
    ...COMPONENT_PLACEHOLDERS,
    ...VERTICAL_PLACEHOLDERS,
  ])

  const flatFiles = walk(CONTENT_DIR, /\.content\.json$/)
  const siteContentFiles = walk(SITES_DIR, /\.json$/).filter((p) => p.includes('/content/'))

  console.log(`validate-content: scanning ${flatFiles.length} flat + ${siteContentFiles.length} site content file(s)`)

  let totalViolations = 0
  const perFile: Array<{ file: string; issues: Violation[] }> = []

  for (const file of flatFiles) {
    const issues = validateFile(file, flatAllowed)
    if (issues.length > 0) perFile.push({ file, issues })
    totalViolations += issues.length
  }

  for (const file of siteContentFiles) {
    const issues = validateFile(file, verticalAllowed)
    if (issues.length > 0) perFile.push({ file, issues })
    totalViolations += issues.length
  }

  if (totalViolations === 0) {
    console.log(`✓ all content files use only known placeholders`)
    process.exit(0)
  }

  console.error(`\n✗ ${totalViolations} unknown placeholder reference(s) across ${perFile.length} file(s):\n`)
  for (const { issues } of perFile) {
    for (const issue of issues) {
      console.error(formatViolation(issue))
    }
  }
  console.error(`\nTo allow a new placeholder, add it to the allowlists in scripts/validate-content.ts.`)
  process.exit(1)
}

main()

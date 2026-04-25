#!/usr/bin/env node
/**
 * Parse docs/GLOBAL_BUSINESS_TYPE_ENUMERATION.md and auto-seed every type that
 * doesn't already exist.
 *
 * Format expected in the doc:
 *   ### <vertical-id> / <sub-vertical-id>
 *   - type_id | Name EN | Name ES [optional flags]
 *
 * For each parsed row we create (if missing):
 *   src/registry/<id>.type.json   (extends the vertical's *_base type)
 *   src/tokens/<id>.tokens.json   (wrapper inheriting from vertical defaults)
 *   src/content/<id>.content.json (skeleton with the type's name)
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const REGISTRY = path.join(ROOT, 'src/registry')
const TOKENS = path.join(ROOT, 'src/tokens')
const CONTENT = path.join(ROOT, 'src/content')
const ENUMERATION_DOC = path.join(ROOT, 'docs/GLOBAL_BUSINESS_TYPE_ENUMERATION.md')
const CATALOG_PATH = path.join(ROOT, 'src/verticals/catalog.json')

/**
 * Vertical metadata — base type + Schema.org type — comes from the single
 * source of truth at src/verticals/catalog.json. Never duplicate it here.
 */
const CATALOG = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8')) as {
  verticals: Record<string, { baseType: string; schemaType: string }>
}
const VERTICAL_BASE: Record<string, string> = Object.fromEntries(
  Object.entries(CATALOG.verticals).map(([id, v]) => [id, v.baseType]),
)
const VERTICAL_SCHEMA_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(CATALOG.verticals).map(([id, v]) => [id, v.schemaType]),
)

interface ParsedType {
  id: string
  nameEn: string
  nameEs: string
  flags: string[]
  verticalId: string
  subVertical: string
}

function parseEnumeration(): ParsedType[] {
  const text = fs.readFileSync(ENUMERATION_DOC, 'utf-8')
  const lines = text.split('\n')
  const results: ParsedType[] = []
  let currentVertical = ''
  let currentSub = ''

  for (const line of lines) {
    const headerMatch = line.match(/^### ([a-z0-9-]+)\s*\/\s*([a-z0-9-]+)/)
    if (headerMatch) {
      currentVertical = headerMatch[1]
      currentSub = headerMatch[2]
      continue
    }
    const rowMatch = line.match(/^-\s+([a-z][a-z0-9_]*)\s*\|\s*([^|]+?)\s*\|\s*(.+?)\s*$/)
    if (rowMatch && currentVertical) {
      const id = rowMatch[1]
      let nameEn = rowMatch[2].trim()
      let rest = rowMatch[3].trim()
      // Detect inline flags like [regulated], [B2B], [age-gated]
      const flags: string[] = []
      const flagRe = /\[([^\]]+)\]/g
      let flagMatch: RegExpExecArray | null
      const flagged = new Set<string>()
      while ((flagMatch = flagRe.exec(rest)) !== null) {
        flagged.add(flagMatch[1])
      }
      if (flagged.size > 0) {
        flags.push(...flagged)
        rest = rest.replace(flagRe, '').trim()
      }
      // Remove dangling flags from nameEn too
      const enFlagMatch = nameEn.match(/\[([^\]]+)\]/g)
      if (enFlagMatch) {
        for (const m of enFlagMatch) flags.push(m.replace(/[\[\]]/g, ''))
        nameEn = nameEn.replace(/\[[^\]]+\]/g, '').trim()
      }
      const nameEs = rest
      results.push({ id, nameEn, nameEs, flags, verticalId: currentVertical, subVertical: currentSub })
    }
  }
  return results
}

function generateRegistry(t: ParsedType): object {
  const base = VERTICAL_BASE[t.verticalId]
  const schemaType = VERTICAL_SCHEMA_TYPE[t.verticalId] || 'LocalBusiness'
  const registry: Record<string, unknown> = {
    id: t.id,
    nameEs: t.nameEs,
    nameEn: t.nameEn,
    verticalId: t.verticalId,
    subVertical: t.subVertical,
    extends: base,
    tokens: t.id,
    seo: {
      schemaType,
      titleTemplate: `{{businessName}} - ${t.nameEs} en {{city}}`,
      descriptionTemplate: `${t.nameEs} profesional en {{city}}. Servicios de calidad con atencion personalizada.`,
      keywords: [`${t.nameEs.toLowerCase()} {{city}}`, `${t.nameEn.toLowerCase()} {{city}}`]
    },
    hero: {
      headlineTemplate: `{{businessName}} - ${t.nameEs}`,
      subheadlineTemplate: `${t.nameEs} profesional en {{city}}.`
    }
  }
  if (t.flags.length) registry.flags = t.flags
  return registry
}

function generateTokens(t: ParsedType): object {
  return {
    $comment: `Inherits ${t.verticalId} vertical defaults`,
    extends: `vertical:${t.verticalId}`
  }
}

function generateContent(t: ParsedType): object {
  return {
    id: t.id,
    locale: 'es-PY',
    hero: {
      headline: `{{businessName}} - ${t.nameEs}`,
      subheadline: `${t.nameEs} en {{city}} con atencion personalizada y profesionalismo.`,
      ctaPrimary: 'Consultar por WhatsApp',
      ctaSecondary: 'Ver Servicios'
    },
    about: {
      title: 'Sobre {{businessName}}',
      content: `En {{businessName}} brindamos ${t.nameEs.toLowerCase()} en {{city}}. Combinamos experiencia, herramientas modernas y atencion cercana para cada cliente.`
    },
    services: {
      title: 'Nuestros Servicios',
      categories: [
        { id: 'principal', name: t.nameEs, description: `Servicios profesionales de ${t.nameEs.toLowerCase()}.` }
      ]
    },
    testimonials: [
      { quote: 'Excelente servicio, los recomiendo a todos.', author: 'Cliente Satisfecho', rating: 5 },
      { quote: 'Profesionales y confiables, una gran experiencia.', author: 'Cliente Habitual', rating: 5 }
    ],
    faq: [
      { q: '¿Como puedo contactarlos?', a: 'Escribinos por WhatsApp o llamanos. Respondemos en el dia.' },
      { q: '¿Atienden en mi zona?', a: 'Si, trabajamos en {{city}} y alrededores.' }
    ],
    footer: {
      tagline: `{{businessName}} - ${t.nameEs} en {{city}}`,
      copyright: '© {{year}} {{businessName}}'
    }
  }
}

function writeIfMissing(filePath: string, payload: object): boolean {
  if (fs.existsSync(filePath)) return false
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + '\n', 'utf-8')
  return true
}

// ----- main -----

const parsed = parseEnumeration()
console.log(`Parsed ${parsed.length} types from enumeration doc.`)

// Deduplicate within the parsed list (enumeration might have collisions across sub-verticals).
const seenIds = new Set<string>()
const unique = parsed.filter((t) => {
  if (seenIds.has(t.id)) return false
  seenIds.add(t.id)
  return true
})
console.log(`Unique ids: ${unique.length}`)

// Filter to types missing from the registry.
const missing = unique.filter((t) => !fs.existsSync(path.join(REGISTRY, `${t.id}.type.json`)))
console.log(`Missing from registry: ${missing.length}`)

// Skip types with unknown verticalIds (sanity).
const valid = missing.filter((t) => {
  if (!VERTICAL_BASE[t.verticalId]) {
    console.warn(`! unknown vertical ${t.verticalId} for ${t.id}; skipping`)
    return false
  }
  return true
})

let seeded = 0
let skipped = 0
const byVertical: Record<string, number> = {}

for (const t of valid) {
  const registryPath = path.join(REGISTRY, `${t.id}.type.json`)
  const tokensPath = path.join(TOKENS, `${t.id}.tokens.json`)
  const contentPath = path.join(CONTENT, `${t.id}.content.json`)

  const a = writeIfMissing(registryPath, generateRegistry(t))
  const b = writeIfMissing(tokensPath, generateTokens(t))
  const c = writeIfMissing(contentPath, generateContent(t))

  if (a || b || c) {
    seeded++
    byVertical[t.verticalId] = (byVertical[t.verticalId] || 0) + 1
  } else {
    skipped++
  }
}

console.log(`\n=== Seed Results ===`)
console.log(`Seeded: ${seeded}`)
console.log(`Skipped: ${skipped}`)
console.log(`\nBy vertical:`)
for (const [v, n] of Object.entries(byVertical).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${v}: ${n}`)
}

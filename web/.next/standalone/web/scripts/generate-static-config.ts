#!/usr/bin/env node
/**
 * Sharded variant of generate-static-config.
 *
 * Instead of one 1.8 MB static-config.ts monolith, this emits:
 *   web/lib/engine/data/<vertical-id>.ts  — one file per vertical with its
 *                                            REGISTRY and CONTENT maps.
 *   web/lib/engine/static-config.ts       — thin facade that lazy-loads the
 *                                            shard for a given type on demand.
 *
 * The facade preserves the public API (REGISTRY_MAP, CONTENT_MAP, getRegistry,
 * getContent) so no callers change.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, '../..')
const REGISTRY_DIR = path.join(PROJECT_ROOT, 'src/registry')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src/content')
const CATALOG_PATH = path.join(PROJECT_ROOT, 'src/verticals/catalog.json')
const DATA_DIR = path.join(PROJECT_ROOT, 'web/lib/engine/data')
const FACADE_PATH = path.join(PROJECT_ROOT, 'web/lib/engine/static-config.ts')

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
}

function format(obj: unknown): string {
  return JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ')
}

/** Convert "trades-home-services" → "tradesHomeServices" for TS identifiers. */
function toCamel(id: string): string {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

// ----- discovery -----
const catalog = readJson<{ verticals: Record<string, unknown> }>(CATALOG_PATH)
const verticalIds = Object.keys(catalog.verticals)

const typeFiles = fs.readdirSync(REGISTRY_DIR).filter((f) => f.endsWith('.type.json')).sort()

interface TypeRecord {
  id: string
  data: Record<string, unknown>
  content: unknown | null
}

const byVertical: Record<string, TypeRecord[]> = {}
for (const v of verticalIds) byVertical[v] = []
const orphan: TypeRecord[] = []

for (const file of typeFiles) {
  const id = file.replace(/\.type\.json$/, '')
  const data = readJson<Record<string, unknown>>(path.join(REGISTRY_DIR, file))
  const contentPath = path.join(CONTENT_DIR, `${id}.content.json`)
  const content = fs.existsSync(contentPath) ? readJson<unknown>(contentPath) : null
  const record: TypeRecord = { id, data, content }
  const verticalId = (data.verticalId as string) || ''
  if (verticalId && byVertical[verticalId]) byVertical[verticalId].push(record)
  else orphan.push(record)
}

// ----- emit per-vertical shards -----
fs.mkdirSync(DATA_DIR, { recursive: true })
const shardEntries: string[] = []

for (const v of verticalIds) {
  const types = byVertical[v]
  if (types.length === 0) continue
  const shardPath = path.join(DATA_DIR, `${v}.ts`)
  const lines: string[] = []
  lines.push(`/** Auto-generated shard for vertical "${v}". DO NOT EDIT MANUALLY. */`)
  lines.push('')
  lines.push('export const REGISTRY: Record<string, unknown> = {')
  for (const t of types) {
    lines.push(`  '${t.id}': ${format(t.data)},`)
  }
  lines.push('}')
  lines.push('')
  lines.push('export const CONTENT: Record<string, unknown> = {')
  for (const t of types) {
    if (t.content) lines.push(`  '${t.id}': ${format(t.content)},`)
  }
  lines.push('}')
  lines.push('')
  fs.writeFileSync(shardPath, lines.join('\n'), 'utf-8')
  shardEntries.push(`  '${v}': () => import('./data/${v}')`)
}

// ----- emit orphan shard (pre-catalog types) -----
if (orphan.length > 0) {
  const orphanPath = path.join(DATA_DIR, '_orphan.ts')
  const lines: string[] = []
  lines.push('/** Types with no verticalId — should be empty after migration. */')
  lines.push('')
  lines.push('export const REGISTRY: Record<string, unknown> = {')
  for (const t of orphan) lines.push(`  '${t.id}': ${format(t.data)},`)
  lines.push('}')
  lines.push('')
  lines.push('export const CONTENT: Record<string, unknown> = {')
  for (const t of orphan) if (t.content) lines.push(`  '${t.id}': ${format(t.content)},`)
  lines.push('}')
  fs.writeFileSync(orphanPath, lines.join('\n'), 'utf-8')
  shardEntries.push(`  '_orphan': () => import('./data/_orphan')`)
}

// ----- emit type-to-vertical index (small, always loaded eagerly) -----
const typeIndex: Record<string, string> = {}
for (const v of verticalIds) {
  for (const t of byVertical[v]) typeIndex[t.id] = v
}
for (const t of orphan) typeIndex[t.id] = '_orphan'

const indexPath = path.join(DATA_DIR, 'index.ts')
fs.writeFileSync(
  indexPath,
  [
    '/** Auto-generated type→vertical index. DO NOT EDIT MANUALLY. */',
    '',
    `export const TYPE_TO_VERTICAL: Record<string, string> = ${JSON.stringify(typeIndex, null, 2)} as Record<string, string>`,
    '',
  ].join('\n'),
  'utf-8',
)

// ----- emit facade -----
const shardImportLines = verticalIds
  .filter((v) => byVertical[v].length > 0)
  .map((v) => `import * as ${toCamel(v)}Shard from './data/${v}'`)
if (orphan.length > 0) shardImportLines.push(`import * as _orphanShard from './data/_orphan'`)

const shardAssemblyLines = verticalIds
  .filter((v) => byVertical[v].length > 0)
  .map((v) => `  Object.assign(reg, ${toCamel(v)}Shard.REGISTRY); Object.assign(con, ${toCamel(v)}Shard.CONTENT)`)
if (orphan.length > 0) {
  shardAssemblyLines.push(`  Object.assign(reg, _orphanShard.REGISTRY); Object.assign(con, _orphanShard.CONTENT)`)
}

const facade = `/**
 * Static-config facade — assembles REGISTRY_MAP and CONTENT_MAP from per-
 * vertical shards in web/lib/engine/data/*.ts. Each shard is its own module
 * (~60-160 KB) which is far easier on the TS language server and IDE than
 * the old 1.8 MB monolith.
 *
 * Generated by web/scripts/generate-static-config-sharded.ts — regenerate
 * with \`npm run generate:config\` after adding or changing type files.
 */

${shardImportLines.join('\n')}

function assemble(): { REGISTRY: Record<string, unknown>; CONTENT: Record<string, unknown> } {
  const reg: Record<string, unknown> = {}
  const con: Record<string, unknown> = {}
${shardAssemblyLines.join('\n')}
  return { REGISTRY: reg, CONTENT: con }
}

const assembled = assemble()

export const REGISTRY_MAP: Record<string, unknown> = assembled.REGISTRY
export const CONTENT_MAP: Record<string, unknown> = assembled.CONTENT

export function getRegistry(type: string): unknown | null {
  return REGISTRY_MAP[type] ?? null
}

export function getContent(type: string): unknown | null {
  return CONTENT_MAP[type] ?? null
}
`

fs.writeFileSync(FACADE_PATH, facade, 'utf-8')

console.log(`\n=== Sharded static-config generated ===`)
console.log(`  verticals: ${verticalIds.length}`)
console.log(`  types total: ${typeFiles.length}`)
console.log(`  curated content files: ${Object.values(byVertical).flat().filter((t) => t.content).length + orphan.filter((t) => t.content).length}`)
console.log(`  shards written to: ${DATA_DIR}`)
console.log(`  facade: ${FACADE_PATH}`)

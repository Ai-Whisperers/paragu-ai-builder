#!/usr/bin/env node
/**
 * Inspect the registry: prints an extends-tree, per-vertical counts, content
 * coverage, custom-palette distribution, duplicate-id detection, and orphan
 * types. Read-only — this is a debugger, not a mutator.
 *
 *   cli graph                 → summary
 *   cli graph --tree          → full extends tree per vertical
 *   cli graph --vertical=<id> → focus on one vertical
 *   cli graph --orphans       → types with no extends target reachable
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const REGISTRY = path.join(ROOT, 'src/registry')
const CONTENT = path.join(ROOT, 'src/content')
const TOKENS = path.join(ROOT, 'src/tokens')
const CATALOG = path.join(ROOT, 'src/verticals/catalog.json')

const args = process.argv.slice(2)
const showTree = args.includes('--tree')
const showOrphans = args.includes('--orphans')
const verticalFlag = args.find((a) => a.startsWith('--vertical='))
const focusVertical = verticalFlag?.slice('--vertical='.length)

const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf-8')) as {
  verticals: Record<string, { nameEs: string; baseType: string }>
}
const verticalIds = Object.keys(catalog.verticals)

interface TypeRecord {
  id: string
  nameEs: string
  verticalId?: string
  extends?: string
  abstract?: boolean
  hasCuratedContent: boolean
  hasCustomPalette: boolean
}

const types: TypeRecord[] = []
const typeFiles = fs.readdirSync(REGISTRY).filter((f) => f.endsWith('.type.json'))

for (const file of typeFiles) {
  const id = file.replace(/\.type\.json$/, '')
  const data = JSON.parse(fs.readFileSync(path.join(REGISTRY, file), 'utf-8')) as {
    nameEs?: string
    verticalId?: string
    extends?: string
    abstract?: boolean
  }
  types.push({
    id,
    nameEs: data.nameEs || '',
    verticalId: data.verticalId,
    extends: data.extends,
    abstract: data.abstract,
    hasCuratedContent: fs.existsSync(path.join(CONTENT, `${id}.content.json`)),
    hasCustomPalette: fs.existsSync(path.join(TOKENS, `${id}.tokens.json`)),
  })
}

const byId = new Map(types.map((t) => [t.id, t]))

// ----- Summary -----
console.log(`\n=== Registry summary ===`)
console.log(`  Total types:        ${types.length}`)
console.log(`  Abstract bases:     ${types.filter((t) => t.abstract).length}`)
console.log(`  Concrete:           ${types.filter((t) => !t.abstract).length}`)
console.log(`  Curated content:    ${types.filter((t) => t.hasCuratedContent).length}`)
console.log(`  Custom palettes:    ${types.filter((t) => t.hasCustomPalette).length}`)
console.log(`  Verticals:          ${verticalIds.length}`)

// ----- Duplicates -----
const seen = new Map<string, number>()
for (const t of types) seen.set(t.id, (seen.get(t.id) || 0) + 1)
const dupes = [...seen.entries()].filter(([, c]) => c > 1)
if (dupes.length) {
  console.log(`\n!! Duplicate ids: ${dupes.map(([k]) => k).join(', ')}`)
}

// ----- Per-vertical breakdown -----
console.log(`\n=== Types per vertical ===`)
for (const v of verticalIds) {
  if (focusVertical && v !== focusVertical) continue
  const list = types.filter((t) => t.verticalId === v)
  const curated = list.filter((t) => t.hasCuratedContent).length
  const custom = list.filter((t) => t.hasCustomPalette).length
  console.log(`  ${v.padEnd(30)} ${String(list.length).padStart(4)}  (curated=${curated}, palette=${custom})`)
}

// ----- Orphans -----
const orphanNoVertical = types.filter((t) => !t.verticalId)
const orphanBadVertical = types.filter((t) => t.verticalId && !verticalIds.includes(t.verticalId))
const orphanBadExtends = types.filter((t) => t.extends && !byId.has(t.extends))

if (showOrphans || orphanNoVertical.length || orphanBadVertical.length || orphanBadExtends.length) {
  console.log(`\n=== Orphans ===`)
  if (orphanNoVertical.length) console.log(`  No verticalId (${orphanNoVertical.length}): ${orphanNoVertical.slice(0, 10).map((t) => t.id).join(', ')}${orphanNoVertical.length > 10 ? '…' : ''}`)
  if (orphanBadVertical.length) console.log(`  Unknown verticalId (${orphanBadVertical.length}): ${orphanBadVertical.slice(0, 10).map((t) => `${t.id}→${t.verticalId}`).join(', ')}${orphanBadVertical.length > 10 ? '…' : ''}`)
  if (orphanBadExtends.length) console.log(`  Broken extends chain (${orphanBadExtends.length}): ${orphanBadExtends.slice(0, 10).map((t) => `${t.id}→${t.extends}`).join(', ')}${orphanBadExtends.length > 10 ? '…' : ''}`)
  if (!orphanNoVertical.length && !orphanBadVertical.length && !orphanBadExtends.length) {
    console.log(`  (none — catalog is clean)`)
  }
}

// ----- Extends tree -----
if (showTree) {
  console.log(`\n=== Extends tree ===`)
  const byParent = new Map<string, TypeRecord[]>()
  const roots: TypeRecord[] = []
  for (const t of types) {
    if (t.extends && byId.has(t.extends)) {
      const arr = byParent.get(t.extends) || []
      arr.push(t)
      byParent.set(t.extends, arr)
    } else {
      roots.push(t)
    }
  }
  const printNode = (t: TypeRecord, depth: number, verticalId?: string) => {
    if (focusVertical && t.verticalId !== focusVertical && verticalId !== focusVertical) return
    const marker = t.abstract ? '◇' : '●'
    const content = t.hasCuratedContent ? '✎' : ' '
    const palette = t.hasCustomPalette ? '◆' : ' '
    console.log(`${'  '.repeat(depth)}${marker}${content}${palette} ${t.id}`)
    const children = byParent.get(t.id) || []
    for (const c of children) printNode(c, depth + 1, t.verticalId)
  }
  for (const r of roots) printNode(r, 0)
  console.log(`\n  Legend: ◇ abstract, ● concrete, ✎ curated content, ◆ custom palette`)
}

// ----- Unreachable (types whose extends chain can never touch curated content) -----
if (focusVertical) {
  const inVertical = types.filter((t) => t.verticalId === focusVertical)
  const neverReachesContent = inVertical.filter((t) => {
    if (t.hasCuratedContent) return false
    let cursor = t.extends
    const seen = new Set([t.id])
    while (cursor && !seen.has(cursor)) {
      seen.add(cursor)
      const p = byId.get(cursor)
      if (!p) break
      if (p.hasCuratedContent) return false
      cursor = p.extends
    }
    return true
  })
  console.log(`\n=== ${focusVertical}: no curated content (falls back to synthesizer) ===`)
  console.log(`  ${neverReachesContent.length} of ${inVertical.length}`)
}

console.log()

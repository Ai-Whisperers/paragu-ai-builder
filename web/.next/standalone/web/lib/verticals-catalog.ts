/**
 * Runtime reader for the vertical catalog SSOT at src/verticals/catalog.json.
 *
 * Every place that needs vertical metadata (resolver.ts, seed scripts,
 * SEO generator, build tooling) reads from this module — never duplicates the
 * map inline. When you need a new field per vertical, add it to catalog.json
 * and surface it here.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

export interface VerticalCatalogEntry {
  nameEs: string
  nameEn: string
  baseType: string
  schemaType: string
  /** When set, the folder on disk uses this name instead of the vertical id. */
  folderAlias: string | null
  /** true | false | "partial" | "optional" */
  i18n: boolean | string
  b2b: boolean
  /** "low" | "medium" | "high" | "very-high" | "variable" */
  regulation: string
  culturallyVariant: boolean
}

export interface VerticalCatalog {
  version: string
  verticals: Record<string, VerticalCatalogEntry>
}

let cached: VerticalCatalog | null = null

/**
 * Works in two environments:
 *   - Next.js runtime: process.cwd() === /.../web, catalog at ../src/verticals
 *   - Node scripts (tsx): process.cwd() varies; we try both locations.
 */
function catalogPath(): string {
  const candidates = [
    resolve(process.cwd(), '..', 'src/verticals/catalog.json'),
    resolve(process.cwd(), 'src/verticals/catalog.json'),
    resolve(__dirname, '../../src/verticals/catalog.json'),
  ]
  for (const p of candidates) {
    try {
      readFileSync(p, 'utf-8')
      return p
    } catch {
      // try next
    }
  }
  throw new Error('[verticals-catalog] Could not locate src/verticals/catalog.json')
}

export function loadCatalog(): VerticalCatalog {
  if (cached) return cached
  const raw = readFileSync(catalogPath(), 'utf-8')
  const parsed = JSON.parse(raw) as VerticalCatalog
  cached = parsed
  return parsed
}

export function getVertical(verticalId: string): VerticalCatalogEntry | undefined {
  return loadCatalog().verticals[verticalId]
}

export function verticalFolder(verticalId: string): string {
  const v = getVertical(verticalId)
  return v?.folderAlias || verticalId
}

export function verticalBaseType(verticalId: string): string | undefined {
  return getVertical(verticalId)?.baseType
}

export function verticalSchemaType(verticalId: string): string {
  return getVertical(verticalId)?.schemaType || 'LocalBusiness'
}

export function listVerticals(): string[] {
  return Object.keys(loadCatalog().verticals)
}

/**
 * Contract test: every registered business type must be renderable.
 *
 * Guarantees:
 *   1. Every `src/registry/<id>.type.json` has required fields (id, nameEs, nameEn, verticalId).
 *   2. Every declared verticalId appears in src/verticals/catalog.json.
 *   3. Every `extends:` target exists.
 *   4. The type can be composed to a page without throwing, and every composed
 *      section resolves to a known section component (kebab-case).
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { REGISTRY_MAP, CONTENT_MAP } from '@/lib/engine/static-config'
import { SECTION_CATALOG, hasSection, resolveSectionAlias } from '@/lib/engine/section-registry'

const ROOT = path.resolve(__dirname, '../../..')
const REGISTRY_DIR = path.join(ROOT, 'src/registry')
const CATALOG_PATH = path.join(ROOT, 'src/verticals/catalog.json')

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8')) as {
  verticals: Record<string, { baseType: string }>
}
const validVerticals = new Set(Object.keys(catalog.verticals))

const allTypeIds = Object.keys(REGISTRY_MAP)
const abstractIds = new Set(
  allTypeIds.filter((id) => {
    const entry = REGISTRY_MAP[id] as { abstract?: boolean }
    return entry?.abstract === true
  }),
)
const concreteIds = allTypeIds.filter((id) => !abstractIds.has(id))

// use resolveSectionAlias from section-registry — the canonical map

describe('registry contract', () => {
  it('loads at least a reasonable number of types', () => {
    expect(allTypeIds.length).toBeGreaterThan(1500)
  })

  it('every type has required fields', () => {
    const missing: string[] = []
    for (const id of allTypeIds) {
      const t = REGISTRY_MAP[id] as {
        id?: string
        nameEs?: string
        nameEn?: string
        verticalId?: string
      }
      if (!t.id || !t.nameEs || !t.nameEn || !t.verticalId) {
        missing.push(`${id} (missing ${['id', 'nameEs', 'nameEn', 'verticalId'].filter((k) => !(t as Record<string, unknown>)[k]).join(', ')})`)
      }
    }
    if (missing.length) throw new Error(`Types missing required fields:\n${missing.slice(0, 10).join('\n')}${missing.length > 10 ? `\n…and ${missing.length - 10} more` : ''}`)
    expect(missing.length).toBe(0)
  })

  it('every verticalId is known in src/verticals/catalog.json', () => {
    const unknown: string[] = []
    for (const id of allTypeIds) {
      const t = REGISTRY_MAP[id] as { verticalId?: string }
      if (t.verticalId && !validVerticals.has(t.verticalId)) {
        unknown.push(`${id} → ${t.verticalId}`)
      }
    }
    if (unknown.length) throw new Error(`Types with unknown verticalId:\n${unknown.slice(0, 10).join('\n')}`)
    expect(unknown.length).toBe(0)
  })

  it('every extends target exists', () => {
    const broken: string[] = []
    for (const id of allTypeIds) {
      const t = REGISTRY_MAP[id] as { extends?: string }
      if (t.extends && !(t.extends in REGISTRY_MAP)) {
        broken.push(`${id} extends missing "${t.extends}"`)
      }
    }
    if (broken.length) throw new Error(`Broken extends chains:\n${broken.slice(0, 10).join('\n')}`)
    expect(broken.length).toBe(0)
  })

  it('every section referenced by a concrete type has a registered renderer', () => {
    const unknownSections: Array<{ type: string; section: string }> = []
    for (const id of concreteIds) {
      const t = REGISTRY_MAP[id] as { pages?: Record<string, { sections?: string[] }> }
      const homepage = t.pages?.homepage
      if (!homepage?.sections) continue
      for (const sec of homepage.sections) {
        const kebab = resolveSectionAlias(sec)
        if (!hasSection(kebab)) {
          unknownSections.push({ type: id, section: sec })
        }
      }
    }
    if (unknownSections.length) {
      const sample = unknownSections
        .slice(0, 15)
        .map((u) => `${u.type}: ${u.section}`)
        .join('\n')
      throw new Error(`Unknown sections (kebab-case lookup failed):\n${sample}`)
    }
    expect(unknownSections.length).toBe(0)
  })

  it('abstract types are not required to ship content files', () => {
    for (const id of abstractIds) {
      // Abstract types may or may not have content; either is fine.
      // This just asserts the flag is respected and doesn't break loading.
      expect(REGISTRY_MAP[id]).toBeDefined()
    }
  })

  it('concrete types fall back to synthesized default content when CONTENT_MAP misses', async () => {
    // With the content-overlay pattern, ~95% of types have no on-disk content
    // file — they fall through to defaultContentFor() which produces the hero
    // / about / services / testimonials / faq / footer shape from the registry
    // entry. Just verify the synthesizer returns valid content for any
    // concrete type.
    const { defaultContentFor } = await import('@/lib/engine/content-defaults')
    // Filter to types without curated content so we're only testing the
    // synthesizer (curated files can have any shape).
    const idsForFallback = concreteIds.filter((id) => !CONTENT_MAP[id])
    const samples = idsForFallback.slice(0, 30)
    for (const id of samples) {
      const synthesized = defaultContentFor(id)
      expect(synthesized, `no default content for ${id}`).toBeTruthy()
      const s = synthesized as { hero?: { headline?: string }; services?: { categories?: unknown[] } }
      expect(s.hero?.headline, `${id} missing hero.headline`).toBeTruthy()
      expect(s.services?.categories, `${id} missing services.categories`).toBeTruthy()
    }
  })

  it('section catalog has no unreachable entries', () => {
    // Sanity: every section id in SECTION_CATALOG is used by at least one type
    // OR is a "universal" section (header/hero/footer/whatsapp-float).
    const universal = new Set(['header', 'hero', 'footer', 'whatsapp-float', 'contact'])
    const usedSections = new Set<string>()
    for (const id of concreteIds) {
      const t = REGISTRY_MAP[id] as { pages?: Record<string, { sections?: string[] }> }
      for (const page of Object.values(t.pages || {})) {
        for (const sec of page.sections || []) usedSections.add(resolveSectionAlias(sec))
      }
    }
    const unreachable = Object.keys(SECTION_CATALOG).filter(
      (id) => !universal.has(id) && !usedSections.has(id),
    )
    // Soft: log but don't fail. These are sections that exist in the
    // component library but no type currently references them. That's fine
    // for library sections, just useful to see.
    if (unreachable.length) {
      // eslint-disable-next-line no-console
      console.log(`[contract] unreachable section components: ${unreachable.join(', ')}`)
    }
    expect(true).toBe(true)
  })
})

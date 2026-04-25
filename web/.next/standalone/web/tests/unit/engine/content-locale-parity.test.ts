import { describe, it, expect } from 'vitest'
import { loadSite, loadSiteContent } from '@/lib/engine/site-loader'

/**
 * En/Es content parity — every tenant that ships multiple locales must
 * have the same content-key tree in every locale. Catches the class of
 * bug where a dev adds a new content block to content/es.json and forgets
 * to mirror it into content/en.json, which then silently renders an empty
 * section for English visitors.
 *
 * We compare dotted key paths (leaf keys only, so ordering / grouping
 * doesn't matter) and assert the set is identical across locales.
 *
 * Some map-shaped values have *translated keys* — e.g. a `hours` object
 * has "Lunes": "09:00-18:00" in es.json and "Monday": "09:00-18:00" in
 * en.json. Those inner keys are translations, not structure, so we stop
 * descending at the parent path. Configured via STOP_AT_PATHS below.
 */
const STOP_AT_PATHS: string[] = [
  // Day-name maps — keys are translated weekday names
  'home.contact.hours',
  'contactPage.contact.hours',
  'hours',
]

function isStopPath(path: string): boolean {
  return STOP_AT_PATHS.some((stop) => path === stop || path.endsWith(`.${stop}`))
}

function flatten(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix]
  if (Array.isArray(obj)) {
    // Arrays are treated as leaf — we only compare structure, not array
    // content, which can legitimately differ between locales (e.g. a
    // translated FAQ might have 7 items in ES and 6 in EN if one wasn't
    // ported). The block's presence is what matters.
    return [prefix]
  }
  if (prefix && isStopPath(prefix)) {
    // Reached a translated-key map — record the parent and stop.
    return [prefix]
  }
  const record = obj as Record<string, unknown>
  const keys: string[] = []
  for (const k of Object.keys(record)) {
    const nextPrefix = prefix ? `${prefix}.${k}` : k
    keys.push(...flatten(record[k], nextPrefix))
  }
  return keys
}

const MULTILOCALE_SITES = ['dayah-litworks', 'nexa-paraguay']

describe('content locale parity', () => {
  for (const slug of MULTILOCALE_SITES) {
    it(`${slug}: en and es content have the same key tree`, () => {
      const site = loadSite(slug)
      if (site.locales.length < 2) return
      if (!site.locales.includes('en') || !site.locales.includes('es')) return

      const es = loadSiteContent(slug, 'es')
      const en = loadSiteContent(slug, 'en')

      const esKeys = new Set(flatten(es))
      const enKeys = new Set(flatten(en))

      const missingInEn = [...esKeys].filter((k) => !enKeys.has(k)).sort()
      const missingInEs = [...enKeys].filter((k) => !esKeys.has(k)).sort()

      expect(
        missingInEn,
        `Keys in es but missing in en for ${slug}: ${missingInEn.join(', ')}`,
      ).toEqual([])
      expect(
        missingInEs,
        `Keys in en but missing in es for ${slug}: ${missingInEs.join(', ')}`,
      ).toEqual([])
    })
  }
})

import { describe, it, expect } from 'vitest'
import { SECTION_CATALOG } from '@/lib/engine/section-registry'
import { COMPONENTS } from '@/lib/engine/site-renderer'

// Guard against the silent-skip bug class that recurred four times:
// - #245 tax-savings-calculator wasn't in COMPONENTS → home rendered empty band
// - #247 FeaturesSection wasn't in COMPONENTS   → /recursos empty
// - #248 intake-questionnaire, process, menu-categorized-priced missing
//
// Every section-registry entry that live content references MUST have a
// COMPONENTS map binding. Without that, renderPage() silently drops the
// section and only logs a warning — visually broken pages ship.

// Sections the platform exposes but that no live tenant uses yet. When
// they get wired up (or a tenant starts using one), remove from this set
// and the wiring must exist. Keep this list short and reviewed — it's
// the opt-out escape hatch for genuinely un-shipped features.
const INTENTIONALLY_UNWIRED = new Set<string>([
  'conveyor-belt',
  'delivery-slot-picker',
  'mortgage-calculator',
  'omakase',
  'pricing',
  'property-listings',
  'regulatory-status-badge',
  'sake-menu',
  'sample-week-preview',
  'savings-calculator',
  'tiered-service-ladder',
  'weekly-cadence-calendar',
])

describe('renderer wiring', () => {
  it('every registered section (minus intentionally unwired) has a COMPONENTS binding', () => {
    const registered = new Set(Object.keys(SECTION_CATALOG))
    const wired = new Set(Object.keys(COMPONENTS))

    const missing: string[] = []
    for (const id of registered) {
      if (INTENTIONALLY_UNWIRED.has(id)) continue
      if (!wired.has(id)) missing.push(id)
    }

    expect(
      missing,
      `Section(s) registered in section-registry.ts but missing from COMPONENTS in site-renderer.tsx:\n` +
        missing.map((m) => `  - ${m}`).join('\n') +
        `\n\nEither add to the COMPONENTS map, or add to INTENTIONALLY_UNWIRED in this test ` +
        `if the section is a platform-level placeholder no tenant uses yet.`,
    ).toEqual([])
  })

  it('every COMPONENTS key exists in SECTION_CATALOG', () => {
    const registered = new Set(Object.keys(SECTION_CATALOG))
    const orphans = Object.keys(COMPONENTS).filter((k) => !registered.has(k))
    expect(
      orphans,
      `COMPONENTS key(s) not registered in section-registry:\n` +
        orphans.map((o) => `  - ${o}`).join('\n'),
    ).toEqual([])
  })

  it('INTENTIONALLY_UNWIRED ids all actually exist in SECTION_CATALOG', () => {
    // Stops this list from silently aging out of sync with the registry.
    const registered = new Set(Object.keys(SECTION_CATALOG))
    const stale = [...INTENTIONALLY_UNWIRED].filter((id) => !registered.has(id))
    expect(
      stale,
      `INTENTIONALLY_UNWIRED contains id(s) no longer in SECTION_CATALOG:\n` +
        stale.map((s) => `  - ${s}`).join('\n') +
        `\nRemove these from INTENTIONALLY_UNWIRED.`,
    ).toEqual([])
  })
})

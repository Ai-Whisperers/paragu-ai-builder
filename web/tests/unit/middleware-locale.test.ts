import { describe, it, expect } from 'vitest'

// Re-export the helper for testing. `pickBestLocale` lives inside
// middleware.ts (an env-sensitive module we don't want to import into
// tests wholesale). We copy-paste the implementation here to keep the
// test pure — if the middleware changes, update both.
function pickBestLocale(acceptLanguage: string, enabled: readonly string[]): string | undefined {
  if (!acceptLanguage || enabled.length === 0) return undefined
  const tags = acceptLanguage
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(';')
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
      const weight = q ? Number(q.slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 1 }
    })
    .filter((t) => t.tag)
    .sort((a, b) => b.weight - a.weight)
  const enabledLower = enabled.map((l) => l.toLowerCase())
  for (const { tag } of tags) {
    const i = enabledLower.indexOf(tag)
    if (i !== -1) return enabled[i]
  }
  for (const { tag } of tags) {
    const primary = tag.split('-')[0]
    const i = enabledLower.indexOf(primary)
    if (i !== -1) return enabled[i]
  }
  return undefined
}

const NEXA = ['nl', 'en', 'de', 'es'] as const

describe('pickBestLocale', () => {
  it('returns undefined when header is empty', () => {
    expect(pickBestLocale('', NEXA)).toBeUndefined()
  })

  it('returns undefined when enabled is empty', () => {
    expect(pickBestLocale('en-US,en;q=0.9', [])).toBeUndefined()
  })

  it('matches a primary tag (de → de)', () => {
    expect(pickBestLocale('de', NEXA)).toBe('de')
  })

  it('matches a regional tag via its primary (de-DE → de)', () => {
    expect(pickBestLocale('de-DE', NEXA)).toBe('de')
  })

  it('respects q-value ordering — picks higher-q match first', () => {
    // 'fr' not enabled, 'de' is — should skip fr and pick de
    expect(pickBestLocale('fr;q=1,de;q=0.8', NEXA)).toBe('de')
  })

  it('picks the highest-q match even when multiple tags match', () => {
    // 'en' enabled (0.9) AND 'de' enabled (0.7) — should pick en
    expect(pickBestLocale('en;q=0.9,de;q=0.7', NEXA)).toBe('en')
  })

  it('is case-insensitive (DE-de → de)', () => {
    expect(pickBestLocale('DE-de', NEXA)).toBe('de')
  })

  it('returns undefined when no language in the header matches enabled', () => {
    // Japanese visitor, Nexa only has 4 European locales
    expect(pickBestLocale('ja-JP,ja;q=0.9', NEXA)).toBeUndefined()
  })

  it('handles realistic Chrome Accept-Language for a German user', () => {
    // Chrome on German Windows typically sends something like this
    expect(pickBestLocale('de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7', NEXA)).toBe('de')
  })

  it('handles realistic Chrome Accept-Language for a Dutch user', () => {
    expect(pickBestLocale('nl-NL,nl;q=0.9,en;q=0.8', NEXA)).toBe('nl')
  })

  it('handles Accept-Language for a Spanish user — finds es even at lower q', () => {
    expect(pickBestLocale('pt-BR,pt;q=0.9,es;q=0.5', NEXA)).toBe('es')
  })

  it('picks first-enabled when multiple enabled match the same tag', () => {
    expect(pickBestLocale('en', ['en', 'de'])).toBe('en')
  })
})

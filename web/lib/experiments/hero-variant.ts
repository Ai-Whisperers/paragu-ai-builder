/**
 * Lightweight client-side A/B for the homepage hero.
 *
 * Why not the Supabase-backed experiments framework: this is a marketing
 * surface seen by anonymous visitors before any lead exists. We just want
 * to pin the variant per visitor, render the right copy, and emit a single
 * exposure event so we can measure conversion downstream by variant.
 *
 * Cookie-based to survive page reloads. 30-day TTL.
 */
'use client'

import { useEffect, useState } from 'react'
import { trackEvent, EventTypes } from '@/lib/analytics/events'

const COOKIE_NAME = 'pa_hero_v'
const COOKIE_TTL_DAYS = 30

export type HeroVariant = 'A' | 'B'

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))
  return match ? match.slice(name.length + 1) : null
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 86_400_000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function pickVariant(): HeroVariant {
  // Crypto-strong assignment if available, else Math.random.
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint8Array(1)
    crypto.getRandomValues(buf)
    return (buf[0] ?? 0) % 2 === 0 ? 'A' : 'B'
  }
  return Math.random() < 0.5 ? 'A' : 'B'
}

/**
 * Returns the hero variant pinned for this visitor, or null on the first
 * server render. Render the default ("A") on the server and hydrate to the
 * real variant on the client to avoid SSR/CSR mismatches.
 */
export function useHeroVariant(): HeroVariant | null {
  const [variant, setVariant] = useState<HeroVariant | null>(null)

  useEffect(() => {
    const existing = readCookie(COOKIE_NAME) as HeroVariant | null
    let assigned: HeroVariant
    if (existing === 'A' || existing === 'B') {
      assigned = existing
    } else {
      assigned = pickVariant()
      writeCookie(COOKIE_NAME, assigned, COOKIE_TTL_DAYS)
    }
    // Hydration-only: we deliberately defer to the client because the
    // assignment depends on document.cookie which doesn't exist on the server.
    // The brief flash of variant A on first paint is acceptable for this
    // marketing experiment.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariant(assigned)
    // Single exposure event per session (sessionStorage flag).
    if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('pa_hero_v_exposed')) {
      sessionStorage.setItem('pa_hero_v_exposed', '1')
      void trackEvent(EventTypes.SECTION_VIEW, {
        sectionId: 'hero',
        metadata: { experiment: 'hero_copy_v1', variant: assigned },
      })
    }
  }, [])

  return variant
}

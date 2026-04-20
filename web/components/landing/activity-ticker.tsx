'use client'

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { REAL_CLIENTS } from '@/lib/landing/marketing-data'

type Entry = {
  slug: string
  name: string
  href: string
  context?: string
  ago?: string
}

/** Fallback used while the fetch is in flight or if the endpoint fails. */
const FALLBACK: Entry[] = REAL_CLIENTS.map((c) => ({
  slug: c.slug,
  name: c.name,
  href: c.href,
  context: c.vertical,
}))

/**
 * Auto-rotating "recent activity" ticker. Fetches from `/api/activity` so the
 * list can be backed by a Supabase table later without re-deploying. Falls
 * back to the curated REAL_CLIENTS list if the endpoint fails — never shows
 * a blank or fake activity.
 *
 * Rotates every ~4 seconds. No autoplay sound, no blocking UI.
 */
export function ActivityTicker() {
  const [entries, setEntries] = useState<Entry[]>(FALLBACK)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/activity')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.entries?.length) return
        setEntries(data.entries as Entry[])
      })
      .catch(() => {
        // Silent fallback — the FALLBACK is already set.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (entries.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % entries.length), 4200)
    return () => clearInterval(id)
  }, [entries.length])

  const current = entries[index] ?? entries[0]
  if (!current) return null

  return (
    <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
        <Activity size={14} />
      </span>
      <span className="text-[var(--text-muted)]">
        {current.ago ? `Lanzado ${current.ago}` : 'Online ahora'} ·{' '}
        <a
          href={current.href}
          className="font-semibold text-[var(--text)] underline-offset-2 hover:underline"
        >
          {current.name}
        </a>
      </span>
    </div>
  )
}

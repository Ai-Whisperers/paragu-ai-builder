'use client'

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { REAL_CLIENTS } from '@/lib/landing/marketing-data'

/**
 * Auto-rotating "recent activity" ticker. Pulls from real clients so every
 * line is verifiable. Rotates every ~4 seconds for casual peripheral attention
 * — never block content, never autoplay sound, no fake activity.
 */
export function ActivityTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % REAL_CLIENTS.length), 4200)
    return () => clearInterval(id)
  }, [])

  const current = REAL_CLIENTS[index]

  return (
    <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
        <Activity size={14} />
      </span>
      <span className="text-[var(--text-muted)]">
        Online ahora ·{' '}
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

import Link from 'next/link'
import { REAL_CLIENTS } from '@/lib/landing/marketing-data'
import { CASE_STUDIES } from '@/lib/landing/case-studies'

/**
 * Wordmark strip used above-the-fold to show real client brands.
 * Pure text wordmarks (no image deps) styled with each client's brand color
 * as an accent.
 *
 * Per BUG_HUNT_500 #335: prefer linking to the /casos/<slug> case study
 * (where we frame the win) rather than the live tenant site. Falls back to
 * the tenant URL when no case study exists for that client.
 */
const CASE_SLUGS = new Set(CASE_STUDIES.map((c) => c.slug))

export function LogoStrip({ label = 'Confían en nosotros:' }: { label?: string }) {
  return (
    <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {REAL_CLIENTS.map((c) => {
          const href = CASE_SLUGS.has(c.slug) ? `/casos/${c.slug}` : c.href
          return (
            <Link
              key={c.slug}
              href={href}
              className="group inline-flex items-center gap-2 text-base font-bold tracking-tight text-[var(--text-light)] transition-colors hover:text-[var(--text)] sm:text-lg"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full opacity-70 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: c.color }}
                aria-hidden
              />
              {c.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

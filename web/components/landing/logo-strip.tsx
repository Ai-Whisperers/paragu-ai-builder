import Link from 'next/link'
import { REAL_CLIENTS } from '@/lib/landing/marketing-data'

/**
 * Wordmark strip used above-the-fold to show real client brands.
 * Pure text wordmarks (no image deps) styled with each client's brand color
 * as an accent. Links to the live tenant site so the proof is one click away.
 */
export function LogoStrip({ label = 'Confían en nosotros:' }: { label?: string }) {
  return (
    <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {REAL_CLIENTS.map((c) => (
          <Link
            key={c.slug}
            href={c.href}
            className="group inline-flex items-center gap-2 text-base font-bold tracking-tight text-[var(--text-light)] transition-colors hover:text-[var(--text)] sm:text-lg"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full opacity-70 transition-opacity group-hover:opacity-100"
              style={{ backgroundColor: c.color }}
              aria-hidden
            />
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

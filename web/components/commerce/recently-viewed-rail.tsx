'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { readRecentlyViewed, type RecentlyViewedItem } from '@/lib/stores/recently-viewed'
import { formatCents } from '@/lib/commerce/compute-totals'

interface Props {
  siteSlug: string
  locale: string
  /** Product id to filter out (e.g., the PDP you're viewing right now). */
  excludeId?: string
  /** Max rendered items. Defaults to 6. */
  limit?: number
}

// No live updates needed — the rail is read-once on mount. The empty
// subscribe satisfies useSyncExternalStore so we get a clean
// SSR-safe load without the "setState in effect" cascading-renders
// lint warning that the useState+useEffect pattern triggers.
const noopSubscribe = () => () => {}

/**
 * Reads recently-viewed items from localStorage and renders a horizontal
 * rail. SSR returns the empty list (returns null), then on the client
 * useSyncExternalStore swaps in the real items once mounted.
 */
export function RecentlyViewedRail({ siteSlug, locale, excludeId, limit = 6 }: Props) {
  const all = useSyncExternalStore<RecentlyViewedItem[]>(
    noopSubscribe,
    () => readRecentlyViewed(siteSlug),
    () => [],
  )
  const items = all.filter((it) => it.id !== excludeId).slice(0, limit)

  if (items.length === 0) return null

  return (
    <section aria-labelledby="recent-heading" className="mx-auto max-w-5xl px-4 pb-8">
      <h2 id="recent-heading" className="mb-3 text-xl font-semibold text-[color:var(--text,#111)]">
        Vistos recientemente
      </h2>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {items.map((it) => (
          <li key={it.id} className="w-32 flex-shrink-0 snap-start">
            <Link
              href={`/s/${locale}/${siteSlug}/producto/${it.slug}`}
              className="block rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-2 hover:border-[color:var(--primary,#111)]"
            >
              {it.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.imageUrl}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full rounded object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded bg-[color:var(--surface-muted,#f3f4f6)]" />
              )}
              <p className="mt-2 line-clamp-2 text-xs font-medium text-[color:var(--text,#111)]">{it.name}</p>
              <p className="mt-1 text-xs font-semibold text-[color:var(--text,#111)]">
                {formatCents(it.priceCents, it.currency)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

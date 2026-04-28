'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { formatCents } from '@/lib/commerce/compute-totals'
import {
  getWishlistSnapshot,
  removeFromWishlist,
  subscribeWishlist,
  type WishlistItem,
} from '@/lib/stores/wishlist'

interface Props {
  siteSlug: string
  locale: string
}

const SSR_EMPTY: WishlistItem[] = []

export function WishlistPageClient({ siteSlug, locale }: Props) {
  const items = useSyncExternalStore(
    subscribeWishlist(siteSlug),
    () => getWishlistSnapshot(siteSlug),
    () => SSR_EMPTY,
  )

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-surface p-12 text-center">
        <p className="text-[color:var(--text-muted,#6b7280)]">Tu lista de favoritos está vacía.</p>
        <Link
          href={`/s/${locale}/${siteSlug}/tienda`}
          className="mt-4 inline-block text-sm font-medium text-[color:var(--primary,#111)] underline"
        >
          Explorar la tienda →
        </Link>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <li key={it.id} className="group relative overflow-hidden rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface">
          <Link href={`/s/${locale}/${siteSlug}/producto/${it.slug}`}>
            {it.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt={it.name} loading="lazy" className="aspect-square w-full object-cover transition group-hover:scale-[1.02]" />
            ) : (
              <div className="aspect-square w-full bg-surface-light" />
            )}
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-medium text-[color:var(--text,#111)]">{it.name}</p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text,#111)]">
                {formatCents(it.priceCents, it.currency)}
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => removeFromWishlist(siteSlug, it.id)}
            aria-label={`Quitar ${it.name} de favoritos`}
            className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs text-[color:var(--text-muted,#6b7280)] shadow hover:bg-white"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}

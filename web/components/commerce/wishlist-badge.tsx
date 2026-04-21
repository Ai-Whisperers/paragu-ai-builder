'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { readWishlist } from '@/lib/stores/wishlist'

const WISHLIST_EVENT = 'paragu:wishlist-change'

function subscribe(cb: () => void) {
  window.addEventListener(WISHLIST_EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(WISHLIST_EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

/**
 * Wishlist link + count badge in the commerce header. Count updates live
 * via the paragu:wishlist-change custom event and cross-tab storage event.
 */
export function WishlistBadge({ siteSlug, locale = 'es' }: { siteSlug: string; locale?: string }) {
  const items = useSyncExternalStore(
    subscribe,
    () => readWishlist(siteSlug),
    () => [],
  )
  const count = items.length
  return (
    <Link
      href={`/s/${locale}/${siteSlug}/favoritos`}
      aria-label={`Mis favoritos${count > 0 ? ` (${count})` : ''}`}
      className="relative inline-flex items-center gap-1 rounded-full p-1.5 text-sm text-[color:var(--text-muted,#6b7280)] hover:bg-[color:var(--surface-muted,#f3f4f6)]"
    >
      <svg aria-hidden="true" className="h-5 w-5" fill={count > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={count > 0 ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
      <span className="hidden sm:inline">Favoritos</span>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white sm:-top-0 sm:-right-2">
          {count}
        </span>
      ) : null}
    </Link>
  )
}

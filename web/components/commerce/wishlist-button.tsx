'use client'

import { useSyncExternalStore } from 'react'
import {
  addToWishlist,
  isInWishlist,
  readWishlist,
  removeFromWishlist,
  type WishlistItem,
} from '@/lib/stores/wishlist'

interface Props {
  siteSlug: string
  product: Omit<WishlistItem, 'addedAt'>
  className?: string
}

const EVENT = 'paragu:wishlist-change'

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb) // catch cross-tab edits
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

function getServerSnapshot(): boolean {
  return false
}

/**
 * Heart toggle on a PDP. Click to add / click again to remove. Uses
 * useSyncExternalStore so React re-renders when addToWishlist fires
 * the custom event (and when another tab edits localStorage). No
 * backend trip; the merchant can't see individual wishlists.
 */
export function WishlistButton({ siteSlug, product, className }: Props) {
  const added = useSyncExternalStore(
    subscribe,
    () => isInWishlist(siteSlug, product.id),
    getServerSnapshot,
  )

  function toggle() {
    if (added) {
      removeFromWishlist(siteSlug, product.id)
    } else {
      addToWishlist(siteSlug, product)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={added}
      aria-label={added ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
      className={
        className ??
        'inline-flex items-center gap-2 rounded-lg border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm font-medium hover:bg-surface-light'
      }
    >
      <span aria-hidden="true" className={added ? 'text-red-500' : 'text-[color:var(--text-muted,#6b7280)]'}>
        {added ? '♥' : '♡'}
      </span>
      <span>{added ? 'Guardado' : 'Guardar'}</span>
    </button>
  )
}

// Re-export readWishlist so the /favoritos page can server-bootstrap a
// component without duplicating the import path.
export { readWishlist }

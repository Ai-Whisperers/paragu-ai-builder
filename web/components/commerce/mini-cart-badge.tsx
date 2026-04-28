'use client'

import { useCartStore, cartItemCount } from '@/lib/stores/cart-store'

export function MiniCartBadge({ onClick }: { onClick: () => void }) {
  const cart = useCartStore((s) => s.cart)
  const count = cartItemCount(cart)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Carrito (${count})`}
      className="relative inline-flex items-center justify-center rounded-full p-2 text-[color:var(--text,#111)] hover:bg-surface-light focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary,#111)]"
    >
      <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-[color:var(--primary-foreground,#fff)]">
          {count}
        </span>
      ) : null}
    </button>
  )
}

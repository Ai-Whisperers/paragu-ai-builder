'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, CartItem } from '@/lib/schemas/commerce/cart'

interface CartStoreState {
  siteSlug: string | null
  cart: Cart | null
  status: 'idle' | 'syncing' | 'error'
  error: string | null
}

interface CartStoreActions {
  hydrate(siteSlug: string, cart: Cart | null): void
  refresh(siteSlug: string): Promise<void>
  addItem(siteSlug: string, productId: string, quantity: number): Promise<void>
  updateItem(siteSlug: string, itemId: string, quantity: number): Promise<void>
  removeItem(siteSlug: string, itemId: string): Promise<void>
  reset(): void
}

type CartStore = CartStoreState & CartStoreActions

import { apiCall } from './api-call'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      siteSlug: null,
      cart: null,
      status: 'idle',
      error: null,

      // Passing cart=null means "I don't have fresh server data", NOT "the
      // cart is empty" — we keep whatever the persist layer already
      // rehydrated from localStorage. That matters when a page (e.g. the
      // checkout /pagar page) renders without pre-fetching the cart: the
      // old behavior wiped the drawer's items on mount and surfaced as a
      // confusing "cart has items / checkout empty" regression. Callers
      // that genuinely want to clear should call `reset()`.
      hydrate: (siteSlug, cart) =>
        set((prev) => ({
          siteSlug,
          cart: cart ?? prev.cart,
          status: 'idle',
          error: null,
        })),

      refresh: async (siteSlug) => {
        set({ status: 'syncing', error: null })
        try {
          const { cart } = await apiCall<{ cart: Cart }>(`/api/storefront/${siteSlug}/cart`)
          set({ siteSlug, cart, status: 'idle' })
        } catch (err) {
          set({ status: 'error', error: err instanceof Error ? err.message : 'sync_failed' })
        }
      },

      addItem: async (siteSlug, productId, quantity) => {
        set({ status: 'syncing', error: null })
        try {
          const { cart } = await apiCall<{ cart: Cart }>(`/api/storefront/${siteSlug}/cart/items`, {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
          })
          set({ siteSlug, cart, status: 'idle' })
        } catch (err) {
          set({ status: 'error', error: err instanceof Error ? err.message : 'add_failed' })
          throw err
        }
      },

      updateItem: async (siteSlug, itemId, quantity) => {
        const prev = get().cart
        // Optimistic update
        if (prev) {
          const optimisticItems: CartItem[] = quantity === 0
            ? prev.items.filter((it) => it.id !== itemId)
            : prev.items.map((it) => (it.id === itemId ? { ...it, quantity } : it))
          set({ cart: { ...prev, items: optimisticItems }, status: 'syncing' })
        }
        try {
          const { cart } = await apiCall<{ cart: Cart }>(`/api/storefront/${siteSlug}/cart/items/${itemId}`, {
            method: quantity === 0 ? 'DELETE' : 'PATCH',
            body: quantity === 0 ? undefined : JSON.stringify({ quantity }),
          })
          set({ cart, status: 'idle' })
        } catch (err) {
          // Roll back optimistic update on failure
          if (prev) set({ cart: prev })
          set({ status: 'error', error: err instanceof Error ? err.message : 'update_failed' })
          throw err
        }
      },

      removeItem: async (siteSlug, itemId) => {
        await get().updateItem(siteSlug, itemId, 0)
      },

      reset: () => set({ siteSlug: null, cart: null, status: 'idle', error: null }),
    }),
    {
      name: 'paragu-cart',
      partialize: (state) => ({ siteSlug: state.siteSlug, cart: state.cart }),
    },
  ),
)

export function cartItemCount(cart: Cart | null): number {
  if (!cart) return 0
  return cart.items.reduce((sum, it) => sum + it.quantity, 0)
}

export function cartSubtotalCents(cart: Cart | null): number {
  if (!cart) return 0
  return cart.items.reduce((sum, it) => sum + it.unitPriceCents * it.quantity, 0)
}

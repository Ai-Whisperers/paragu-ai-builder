'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: string
  productId: string
  variantId: string | null
  createdAt: string
}

interface WishlistStoreState {
  siteSlug: string | null
  items: WishlistItem[]
  status: 'idle' | 'syncing' | 'error'
  error: string | null
}

interface WishlistStoreActions {
  hydrate(siteSlug: string, items: WishlistItem[]): void
  refresh(siteSlug: string): Promise<void>
  add(siteSlug: string, productId: string, variantId?: string): Promise<void>
  remove(siteSlug: string, itemId: string): Promise<void>
  reset(): void
}

type WishlistStore = WishlistStoreState & WishlistStoreActions

async function apiCall<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    credentials: 'same-origin',
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `http_${res.status}`)
  }
  return res.json() as Promise<T>
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      siteSlug: null,
      items: [],
      status: 'idle',
      error: null,

      hydrate: (siteSlug, items) => set({ siteSlug, items, status: 'idle', error: null }),

      refresh: async (siteSlug) => {
        set({ status: 'syncing', error: null })
        try {
          const { items } = await apiCall<{ items: WishlistItem[] }>(`/api/storefront/${siteSlug}/wishlist`)
          set({ items, status: 'idle' })
        } catch (e) {
          set({ error: (e as Error).message, status: 'error' })
        }
      },

      add: async (siteSlug, productId, variantId) => {
        set({ status: 'syncing', error: null })
        try {
          await apiCall(`/api/storefront/${siteSlug}/wishlist`, {
            method: 'POST',
            body: JSON.stringify({ productId, variantId }),
          })
          await get().refresh(siteSlug)
        } catch (e) {
          set({ error: (e as Error).message, status: 'error' })
        }
      },

      remove: async (siteSlug, itemId) => {
        set({ status: 'syncing', error: null })
        try {
          await apiCall(`/api/storefront/${siteSlug}/wishlist`, {
            method: 'DELETE',
            body: JSON.stringify({ wishlistItemId: itemId }),
          })
          const { items } = get()
          set({ items: items.filter(i => i.id !== itemId), status: 'idle' })
        } catch (e) {
          set({ error: (e as Error).message, status: 'error' })
        }
      },

      reset: () => set({ siteSlug: null, items: [], status: 'idle', error: null }),
    }),
    { name: 'f4m-wishlist' }
  )
)
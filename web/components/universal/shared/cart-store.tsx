/**
 * ANNOTATION: CartStore
 *
 * What it is: React Context + localStorage cart state for the storefront.
 * Stores items (product id, name, price, quantity), persists across sessions.
 *
 * Why your business needs it: The store needs to remember what customers add to their cart
 * even if they navigate away and come back. localStorage persistence means no lost carts.
 *
 * What AI populates from your data: None — pure client state. Product data comes from content/_shared/products.json.
 *
 * Your input: Nothing — this is automatic storefront infrastructure.
 *
 * Plan availability: Crecimiento, Profesional
 */

/**
 * @component CartStore
 * @description Client-side cart state via React Context + localStorage.
 * Persists cart items (product id, name, price, quantity) to localStorage.
 * Provides add/remove/update/clear actions and computed totals.
 * No Supabase dependency — demo/localStorage-only.
 */

"use client"
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CART_KEY = "cart_items"

const CartContext = createContext<CartContextValue | null>(null)

function getStoredItems(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getStoredItems)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    return { items: [], addItem: () => {}, removeItem: () => {}, updateQuantity: () => {}, clearCart: () => {}, totalItems: 0, totalPrice: 0 }
  }
  return ctx
}

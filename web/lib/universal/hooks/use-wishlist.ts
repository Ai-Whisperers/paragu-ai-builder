'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'wishlist'

function getStored(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setStored(ids: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function useWishlist() {
  const [items, setItems] = useState<string[]>(() => getStored())

  useEffect(() => {
    setStored(items)
  }, [items])

  function addItem(id: string) {
    setItems((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id]
      setStored(next)
      return next
    })
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i !== id)
      setStored(next)
      return next
    })
  }

  function toggleItem(id: string) {
    setItems((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      setStored(next)
      return next
    })
  }

  function isWishlisted(id: string): boolean {
    return items.includes(id)
  }

  function clearItems() {
    setItems([])
    setStored([])
  }

  return { items, addItem, removeItem, toggleItem, isWishlisted, clearItems }
}
'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'recently_viewed'
const MAX_ITEMS = 10

export interface RecentItem {
  id: string
  name: string
  imageUrl?: string
  price?: number
}

function getStored(): RecentItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setStored(items: RecentItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>(() => getStored())

  useEffect(() => {
    setStored(items)
  }, [items])

  function addItem(item: RecentItem) {
    setItems((prev) => {
      const without = prev.filter((i) => i.id !== item.id)
      const next = [item, ...without].slice(0, MAX_ITEMS)
      setStored(next)
      return next
    })
  }

  function clearItems() {
    setItems([])
    setStored([])
  }

  return { items, addItem, clearItems }
}
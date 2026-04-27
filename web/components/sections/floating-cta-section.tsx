'use client'

import { useState, useEffect } from 'react'

export interface FloatingCTAItem {
  label: string
  action: string
  icon?: string
  type: 'whatsapp' | 'phone' | 'scroll' | 'link' | 'booking'
}

export interface FloatingCTASectionProps {
  items?: FloatingCTAItem[]
  phone?: string
  whatsapp?: string
  bookingUrl?: string
  showAfter?: number
}

const DEFAULT_ITEMS: FloatingCTAItem[] = [
  { label: 'WhatsApp', action: 'whatsapp', icon: '💬', type: 'whatsapp' },
  { label: 'Llamar', action: 'phone', icon: '📞', type: 'phone' },
]

export function FloatingCTASection({
  items,
  phone,
  whatsapp,
  bookingUrl,
  showAfter = 300,
}: FloatingCTASectionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > showAfter)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfter])

  const ctaItems = items || DEFAULT_ITEMS

  const handleAction = (item: FloatingCTAItem) => {
    switch (item.type) {
      case 'whatsapp':
        if (whatsapp) window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank')
        break
      case 'phone':
        if (phone) window.location.href = `tel:${phone.replace(/\D/g, '')}`
        break
      case 'scroll':
        const el = document.querySelector(item.action)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        break
      case 'link':
        if (item.action) window.open(item.action, '_blank')
        break
      case 'booking':
        if (bookingUrl) window.open(bookingUrl, '_blank')
        break
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)] border-t border-[var(--border)] shadow-lg transition-transform duration-300 md:hidden">
      <div className="flex">
        {ctaItems.map((item, i) => (
          <button
            key={i}
            onClick={() => handleAction(item)}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              item.type === 'whatsapp'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-light)]'
            }`}
          >
            {item.icon && <span>{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

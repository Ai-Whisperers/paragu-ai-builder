'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Share2 } from 'lucide-react'

interface DemoLeadBarProps {
  isDemo?: boolean
  siteSlug: string
  siteName?: string
  vertical?: string
  locale?: string
}

const DISMISS_KEY = 'pa_demo_bar_dismissed'

export function DemoLeadBar({ isDemo = false, siteSlug, siteName, vertical, locale = 'es' }: DemoLeadBarProps) {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!isDemo) return
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === siteSlug) {
        setHidden(true)
        return
      }
    } catch {}
    setHidden(false)
  }, [isDemo, siteSlug])

  if (!isDemo || hidden) return null

  const whatsappMessage = encodeURIComponent(
    `¡Mirá este sitio que armamos con ParaguAI! 👇\n\nhttps://paragu-ai.com/s/${locale}/${siteSlug}\n\nPedí el tuyo en 48 horas.`
  )

  const demoUrl = vertical ? `/demo?v=${encodeURIComponent(vertical)}` : '/demo'

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, siteSlug) } catch {}
    setHidden(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-200 bg-blue-600 text-white shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold sm:text-base truncate">
            {siteName ? `¿Querés un sitio como este para tu negocio?` : `¿Querés un sitio web profesional?`}
          </p>
          <p className="mt-0.5 text-xs text-blue-100 sm:text-sm">
            Pedí tu demo personalizada y la tenés en 48 horas
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <a
            href={demoUrl}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            Quiero el mío
          </a>
          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors sm:text-sm"
            title="Compartir por WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compartir</span>
          </a>
          <button
            onClick={dismiss}
            className="ml-1 rounded-lg p-1.5 text-blue-200 hover:bg-blue-700 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

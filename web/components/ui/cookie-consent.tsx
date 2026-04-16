'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const CONSENT_KEY = 'paragu-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t p-4 shadow-lg sm:p-6"
      style={{
        backgroundColor: 'var(--surface, #ffffff)',
        borderColor: 'var(--border, #e2e8f0)',
      }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm" style={{ color: 'var(--text-muted, #5a6577)' }}>
          Utilizamos cookies para mejorar su experiencia. Al continuar navegando, acepta nuestra{' '}
          <a href="/politica-de-privacidad" className="underline" style={{ color: 'var(--secondary, #c9a96e)' }}>
            politica de privacidad
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="ghost" size="sm" onClick={handleDecline}>
            Rechazar
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}

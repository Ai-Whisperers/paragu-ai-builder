'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const CONSENT_KEY = 'paragu-cookie-consent'

interface GA4Props {
  measurementId?: string
}

/**
 * Google Analytics 4 integration with cookie consent awareness.
 * Only loads the GA script if user has accepted cookies.
 */
export function GA4({ measurementId }: GA4Props) {
  useEffect(() => {
    if (!measurementId) return

    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent !== 'accepted') return

    // Listen for consent changes and reload if accepted later
    const handler = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue === 'accepted') {
        window.location.reload()
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [measurementId])

  if (!measurementId) return null

  // Only render scripts on client after consent
  if (typeof window !== 'undefined') {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent !== 'accepted') return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}

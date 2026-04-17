'use client'

import { useEffect, useState } from 'react'
import { readConsent } from '@/components/consent/cookie-banner'

/**
 * GA4 loader gated on analytics consent. Mounts the GA script only after
 * the user has given explicit consent via the cookie banner. Listens for
 * `consent:updated` events so a decision made on the current page takes
 * effect immediately without a reload.
 */
export function Ga4Loader({ measurementId, anonymizeIp = true }: {
  measurementId: string
  anonymizeIp?: boolean
}) {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = readConsent()
    if (consent?.analytics) setHasConsent(true)
    function onUpdate(evt: Event) {
      const c = (evt as CustomEvent).detail as { analytics?: boolean }
      setHasConsent(!!c?.analytics)
    }
    window.addEventListener('consent:updated', onUpdate)
    return () => window.removeEventListener('consent:updated', onUpdate)
  }, [])

  useEffect(() => {
    if (!hasConsent || !measurementId) return
    const existing = document.querySelector(`script[data-ga="${measurementId}"]`)
    if (existing) return
    const tag = document.createElement('script')
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    tag.async = true
    tag.setAttribute('data-ga', measurementId)
    document.head.appendChild(tag)

    const inline = document.createElement('script')
    inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:${anonymizeIp}});`
    inline.setAttribute('data-ga-init', measurementId)
    document.head.appendChild(inline)
  }, [hasConsent, measurementId, anonymizeIp])

  return null
}

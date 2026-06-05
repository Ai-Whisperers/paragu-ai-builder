/**
 * ANNOTATION: MetaPixel
 *
 * What it is: Facebook/Meta Pixel integration for tracking visitor actions — page views, purchases, leads.
 * Fires automatically on every page and provides event tracking functions for conversions.
 *
 * Why your business needs it: Meta Pixel lets you measure ad effectiveness, build custom audiences,
 * and track ROI on Facebook/Instagram ad campaigns. Essential for paid social marketing.
 *
 * What AI populates from your data: Pixel ID from NEXT_PUBLIC_META_PIXEL_ID environment variable.
 * Events like "Purchase" and "Lead" are fired from relevant conversion points in the funnel.
 *
 * Your input: Provide your Meta Pixel ID during setup (or ParaguAI configures it from your ad account).
 *
 * Plan availability: Crecimiento, Profesional
 */

'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) | undefined
    _fbq: ((...args: unknown[]) => void) | undefined
  }
}

export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  useEffect(() => {
    if (!pixelId) return

    // Inject Facebook Pixel base code
    const fn = (...args: unknown[]) => {
      if (window.fbq) window.fbq(...args)
    }
    window.fbq =
      window.fbq ||
      function (...args: unknown[]) {
        fn(...args)
        const q: unknown[] = args
        q.unshift('track')
        fn(...q)
      }

    window.fbq('init', pixelId, undefined, { autoConfig: true, config: { idempotency_key: undefined } })
    window.fbq('track', 'PageView')
  }, [pixelId])

  if (!pixelId) return null

  return (
    <>
      <script
        id="facebook-pixel"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />
    </>
  )
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}
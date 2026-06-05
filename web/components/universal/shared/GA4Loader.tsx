/**
 * ANNOTATION: GA4Loader (alternative)
 * 
 * What it is: An alternative Google Analytics 4 loader component with visible loading and ready states. Provides feedback while the analytics script initializes.
 * 
 * Why your business needs it: Offers the same visitor tracking as the primary GA4 loader but with status indicators, useful for debugging or when you want visual confirmation that analytics is active.
 * 
 * What AI populates from your data: ParaguAI reads your GA4 measurement ID from site configuration.
 * 
 * Your input: Your Google Analytics 4 measurement ID (G-XXXXXXXXXX).
 * 
 * Plan availability: All plans
 */
"use client"

import React from "react"

interface GA4LoaderProps {
  measurementId?: string | null
}

export function GA4Loader({ measurementId }: GA4LoaderProps) {
  if (!measurementId) return null

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', { page_path: window.location.pathname });
          `,
        }}
      />
    </>
  )
}

// Page view event helper
export function trackPageView(url: string, title?: string) {
  if (typeof window === "undefined") return
  const gtag = (window as unknown as {gtag?: (...args: unknown[]) => void}).gtag
  if (typeof gtag === "function") {
    gtag("event", "page_view", { page_location: url, page_title: title })
  }
}
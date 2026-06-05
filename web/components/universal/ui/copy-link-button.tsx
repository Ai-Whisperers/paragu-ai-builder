/**
 * ANNOTATION: CopyLinkButton
 *
 * What it is: Clipboard copy button for sharing URLs. Copies the URL to clipboard and shows a brief "Copied!" confirmation.
 *
 * Why your business needs it: Makes it easy for visitors to share specific pages of your site.
 * Used on product pages, blog posts, and promotional pages.
 *
 * What AI populates from your data: None — pure utility. URL passed as prop by parent component.
 *
 * Your input: Nothing — used automatically by share components.
 *
 * Plan availability: All plans
 */

/**
 * @component CopyLinkButton
 * @description Clipboard copy button that copies a given URL and shows brief Copied feedback text for 2 seconds.
 * @featureFlags core
 * @requires navigator.clipboard API (browser)
 * @implementation navigator.clipboard.writeText, temporary innerHTML swap for feedback
 */

"use client"

import { Share2 } from "lucide-react"

export function CopyLinkButton({ url, label }: { url: string; label: string }) {
  return (
    <button
      onClick={() => {
        try {
          navigator.clipboard.writeText(url)
        } catch (err) {
          console.error('Failed to copy link:', err)
        }
        const btn = document.activeElement as HTMLButtonElement
        if (btn) {
          btn.innerHTML = "✓ " + (label === "Copy link" ? "Copied!" : "¡Copiado!")
          setTimeout(() => {
            btn.innerHTML = `<svg class="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> ${label}`
          }, 2000)
        }
      }}
      className="inline-flex items-center gap-2 bg-surface-muted text-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <Share2 className="w-4 h-4" />
      {label}
    </button>
  )
}

'use client'

import { useState } from 'react'

interface Props {
  productName: string
  productUrl: string
}

/**
 * Share affordance on PDPs. PY shoppers expect WhatsApp share + copy-link
 * — those are the two ways products actually get recommended in country.
 * Web Share API is preferred when available (mobile gets the native sheet
 * with all installed apps), with explicit WA + copy fallbacks for desktop.
 */
export function ProductShare({ productName, productUrl }: Props) {
  const [copied, setCopied] = useState(false)
  const shareText = `Mirá este producto: ${productName}`

  async function handleNativeShare() {
    if (typeof navigator === 'undefined' || !navigator.share) {
      // No Web Share API — fall back to copy
      await handleCopy()
      return
    }
    try {
      await navigator.share({ title: productName, text: shareText, url: productUrl })
    } catch {
      // User cancelled or share failed; do nothing.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked — last resort: prompt
      window.prompt('Copiá este enlace:', productUrl)
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-xs font-medium uppercase text-[color:var(--text-muted,#6b7280)]">Compartir</span>
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1 rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)]"
      >
        <span aria-hidden="true">↗</span>
        Compartir
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
      >
        <span aria-hidden="true">💬</span>
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)]"
      >
        <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
        {copied ? '¡Copiado!' : 'Copiar enlace'}
      </button>
    </div>
  )
}

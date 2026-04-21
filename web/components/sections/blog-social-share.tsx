'use client'

import { useState } from 'react'
import { MessageCircle, Mail, Link2, Check } from 'lucide-react'

// lucide-react does not ship brand icons; use an inline SVG for LinkedIn.
function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

type Labels = { copied: string; share: string }

const LABELS: Record<string, Labels> = {
  de: { copied: 'Link kopiert', share: 'Teilen' },
  en: { copied: 'Link copied', share: 'Share' },
  es: { copied: 'Link copiado', share: 'Compartir' },
  nl: { copied: 'Link gekopieerd', share: 'Delen' },
  pt: { copied: 'Link copiado', share: 'Compartilhar' },
}

export function BlogSocialShare({ url, title, locale = 'es' }: { url: string; title: string; locale?: string }) {
  const L = LABELS[locale] || LABELS.es
  const [copied, setCopied] = useState(false)
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked — other buttons still work */ }
  }

  const btnClass = 'flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-light)] text-[var(--text-muted)] transition-colors hover:bg-[var(--secondary)]/10 hover:text-[var(--secondary)]'

  return (
    <div className="mt-10 flex items-center gap-3 border-t border-[var(--border)] pt-6">
      <span className="mr-2 text-sm font-medium text-[var(--text-muted)]">{L.share}</span>
      <a href={`https://wa.me/?text=${encodedTitle}%20${encoded}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={btnClass}>
        <MessageCircle size={18} />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={btnClass}>
        <LinkedInIcon size={18} />
      </a>
      <a href={`mailto:?subject=${encodedTitle}&body=${encoded}`} aria-label="Email" className={btnClass}>
        <Mail size={18} />
      </a>
      <button type="button" onClick={handleCopy} aria-label={copied ? L.copied : 'Copy link'} className={btnClass}>
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </button>
      {copied && <span className="text-sm text-[var(--secondary)]" aria-live="polite">{L.copied}</span>}
    </div>
  )
}

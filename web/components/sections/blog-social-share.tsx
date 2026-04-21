'use client'

import { useState } from 'react'
import { MessageCircle, Linkedin, Mail, Link2, Check } from 'lucide-react'

/**
 * Social share for blog posts. Keeps the channels that Europeans
 * actually use to share long-form content — WhatsApp, LinkedIn, Email —
 * plus a copy-link button. Twitter/X deliberately omitted; the audience
 * for USD 6.9k relocation content doesn't share on X.
 *
 * Share URLs built with encodeURIComponent; the component is pure
 * client-side so the page stays static.
 */

type Labels = { copied: string; share: string }

const LABELS: Record<string, Labels> = {
  de: { copied: 'Link kopiert', share: 'Teilen' },
  en: { copied: 'Link copied', share: 'Share' },
  es: { copied: 'Link copiado', share: 'Compartir' },
  nl: { copied: 'Link gekopieerd', share: 'Delen' },
  pt: { copied: 'Link copiado', share: 'Compartilhar' },
}

export function BlogSocialShare({
  url,
  title,
  locale = 'es',
}: {
  url: string
  title: string
  locale?: string
}) {
  const L = LABELS[locale] || LABELS.es
  const [copied, setCopied] = useState(false)
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — noop, the WA/LinkedIn buttons still work */
    }
  }

  const btnClass =
    'flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-light)] text-[var(--text-muted)] transition-colors hover:bg-[var(--secondary)]/10 hover:text-[var(--secondary)]'

  return (
    <div className="mt-10 flex items-center gap-3 border-t border-[var(--border)] pt-6">
      <span className="mr-2 text-sm font-medium text-[var(--text-muted)]">{L.share}</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={btnClass}
      >
        <MessageCircle size={18} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={btnClass}
      >
        <Linkedin size={18} />
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encoded}`}
        aria-label="Email"
        className={btnClass}
      >
        <Mail size={18} />
      </a>
      <button type="button" onClick={handleCopy} aria-label={copied ? L.copied : 'Copy link'} className={btnClass}>
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </button>
      {copied && (
        <span className="text-sm text-[var(--secondary)]" aria-live="polite">{L.copied}</span>
      )}
    </div>
  )
}

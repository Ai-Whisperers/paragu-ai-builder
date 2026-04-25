'use client'

import { useState } from 'react'
import { PlayCircle } from 'lucide-react'

/**
 * Above-the-fold video slot. Click-to-play to keep LCP fast.
 *
 * Pass a YouTube/Vimeo embed URL via `embedUrl` once you have a real video.
 * Until then the component renders a poster + play button that opens the
 * configured WhatsApp link as a fallback action — so the slot is always
 * a working CTA, not a dead placeholder.
 */
export function VideoBlock({
  embedUrl,
  posterAlt = 'Cómo funciona ParaguAI en 60 segundos',
  fallbackHref,
  caption = '60 segundos: de mensaje de WhatsApp a sitio publicado.',
}: {
  embedUrl?: string
  posterAlt?: string
  fallbackHref?: string
  caption?: string
}) {
  const [playing, setPlaying] = useState(false)

  const showEmbed = playing && embedUrl

  return (
    <figure className="mx-auto w-full max-w-3xl">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--surface)] to-[var(--accent)]/10 shadow-xl">
        {showEmbed ? (
          <iframe
            src={embedUrl}
            title={posterAlt}
            allow="accelerated-2d-canvas; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : embedUrl ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={posterAlt}
            className="group absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/30 to-[var(--accent)]/30" aria-hidden />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-[var(--primary)] shadow-2xl transition-transform group-hover:scale-110">
              <PlayCircle size={48} />
            </span>
          </button>
        ) : (
          <a
            href={fallbackHref || '#como-funciona'}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20" aria-hidden />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-[var(--primary)] shadow-2xl transition-transform group-hover:scale-110">
              <PlayCircle size={48} />
            </span>
            <span className="relative max-w-md text-sm font-medium text-[var(--text)]">
              Video walkthrough en producción · mientras tanto, mirá <u>cómo funciona</u>.
            </span>
          </a>
        )}
      </div>
      <figcaption className="mt-3 text-center text-sm text-[var(--text-muted)]">
        {caption}
      </figcaption>
    </figure>
  )
}

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * Accessible poster-to-video modal.
 *
 * Renders a clickable poster that opens a modal with an embedded YouTube /
 * Vimeo iframe (or any URL that accepts autoplay=1 query param). When
 * `videoUrl` is falsy we render a poster with a "video coming soon"
 * badge instead — the expected Nexa launch state.
 *
 * Why client component: the modal open state and Esc-to-close + focus
 * trap are inherently interactive.
 */
export interface VideoModalProps {
  /** YouTube embed URL or similar. When empty, renders the "coming soon" poster. */
  videoUrl?: string
  poster: string
  posterAlt: string
  /** Label rendered next to the play icon; e.g. "Play testimonial". */
  playLabel?: string
  /** Label shown on the poster when no video is wired yet. */
  comingSoonLabel?: string
  labelClose?: string
  labelDialog?: string
  className?: string
  aspectRatio?: string
}

function toEmbedUrl(url: string): string {
  // YouTube: accept `watch?v=…` and `youtu.be/…`, convert to embed.
  try {
    const u = new URL(url)
    if (u.hostname.endsWith('youtube.com') && u.pathname === '/watch') {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '')
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    return url
  } catch {
    return url
  }
}

export function VideoModal({
  videoUrl,
  poster,
  posterAlt,
  playLabel = 'Play video',
  comingSoonLabel = 'Video coming soon',
  labelClose = 'Close',
  labelDialog = 'Video',
  className = '',
  aspectRatio = 'aspect-video',
}: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const prevFocus = useRef<HTMLElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const titleId = useId()

  const hasVideo = Boolean(videoUrl)

  const open = useCallback(() => {
    if (!hasVideo) return
    prevFocus.current = (document.activeElement as HTMLElement) ?? null
    setIsOpen(true)
  }, [hasVideo])

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handler)
      prevFocus.current?.focus?.()
    }
  }, [isOpen, close])

  const posterContent = (
    <>
      <Image
        src={poster}
        alt={posterAlt}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover"
        unoptimized={poster.startsWith('data:')}
      />
      {/* Gradient tint + play button overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {hasVideo ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-1" aria-hidden="true">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
          {comingSoonLabel}
        </div>
      )}
    </>
  )

  return (
    <>
      {hasVideo ? (
        <button
          type="button"
          onClick={open}
          aria-label={playLabel}
          className={`group relative block w-full overflow-hidden rounded-lg bg-[var(--surface-light)] ${aspectRatio} ${className} focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2`}
        >
          {posterContent}
        </button>
      ) : (
        <div
          className={`relative block w-full overflow-hidden rounded-lg bg-[var(--surface-light)] ${aspectRatio} ${className}`}
          aria-label={posterAlt}
        >
          {posterContent}
        </div>
      )}

      {isOpen && hasVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <h2 id={titleId} className="sr-only">{labelDialog}</h2>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label={labelClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="relative aspect-video w-full max-w-5xl px-4">
            {videoUrl && (
              <iframe
                src={toEmbedUrl(videoUrl)}
                title={labelDialog}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                className="h-full w-full rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

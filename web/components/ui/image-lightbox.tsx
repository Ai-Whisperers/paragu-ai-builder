'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * Accessible image lightbox. Opens into a modal dialog with keyboard nav:
 *  - Esc closes
 *  - ArrowLeft / ArrowRight cycles prev/next (wraps around)
 *  - Tab is focus-trapped inside the dialog
 *
 * The trigger is each tile rendered in `children` — the parent grid passes
 * a `<button>` per tile that calls `open(index)`. The dialog backdrop is
 * not a click-to-close target on purpose: accidentally dismissing a full
 * viewing is more annoying than an explicit close button that users can
 * always find.
 */
export interface LightboxImage {
  src: string
  alt: string
  caption?: string
}

export interface ImageLightboxProps {
  images: LightboxImage[]
  children: (api: {
    open: (index: number) => void
    isOpen: boolean
    activeIndex: number
  }) => React.ReactNode
  labelPrev?: string
  labelNext?: string
  labelClose?: string
  labelDialog?: string
}

export function ImageLightbox({
  images,
  children,
  labelPrev = 'Previous image',
  labelNext = 'Next image',
  labelClose = 'Close',
  labelDialog = 'Image gallery',
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const previousFocus = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const titleId = useId()

  const count = images.length

  const open = useCallback((index: number) => {
    previousFocus.current = (document.activeElement as HTMLElement) ?? null
    setActiveIndex(Math.max(0, Math.min(count - 1, index)))
    setIsOpen(true)
  }, [count])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const next = useCallback(() => {
    if (count === 0) return
    setActiveIndex((i) => (i + 1) % count)
  }, [count])

  const prev = useCallback(() => {
    if (count === 0) return
    setActiveIndex((i) => (i - 1 + count) % count)
  }, [count])

  // Body scroll lock + return focus on close.
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Move focus into the dialog on open.
    closeBtnRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      previousFocus.current?.focus?.()
    }
  }, [isOpen])

  // Keyboard handling at the document level so arrows work regardless of
  // which element inside the dialog is focused.
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'Tab') {
        // Focus trap: keep Tab within the dialog.
        const root = dialogRef.current
        if (!root) return
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, close, next, prev])

  const active = useMemo(
    () => (isOpen && images[activeIndex]) || null,
    [isOpen, images, activeIndex],
  )

  return (
    <>
      {children({ open, isOpen, activeIndex })}

      {isOpen && active && (
        <div
          ref={dialogRef}
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

          {count > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label={labelPrev}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {count > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label={labelNext}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center p-4 sm:p-8">
            <div className="relative h-[70vh] w-full max-w-5xl">
              <Image
                key={active.src}
                src={active.src}
                alt={active.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
                unoptimized={active.src.startsWith('data:')}
              />
            </div>
            {active.caption && (
              <p className="mt-4 max-w-3xl text-center text-sm text-white/80">
                {active.caption}
              </p>
            )}
            {count > 1 && (
              <p className="mt-2 text-xs text-white/60">
                {activeIndex + 1} / {count}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

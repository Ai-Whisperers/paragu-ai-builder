'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'paragu:consent:v1'

export interface ConsentState {
  analytics: boolean
  marketing: boolean
  decidedAt: string
}

export interface CookieBannerCopy {
  title: string
  body: string
  acceptAll: string
  acceptEssential: string
  manage: string
  privacyHref: string
  privacyLabel: string
}

export function CookieBanner({ copy }: { copy: CookieBannerCopy }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (!stored) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function persist(state: ConsentState) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage errors — banner will re-appear on next load
    }
    window.dispatchEvent(new CustomEvent('consent:updated', { detail: state }))
    setVisible(false)
  }

  function acceptAll() {
    persist({ analytics: true, marketing: true, decidedAt: new Date().toISOString() })
  }
  function acceptEssential() {
    persist({ analytics: false, marketing: false, decidedAt: new Date().toISOString() })
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label={copy.title}
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-lg bg-[var(--surface)] p-5 shadow-card-hover md:bottom-6 md:left-6 md:right-6"
      style={{ border: '1px solid var(--border)' }}
    >
      <p className="mb-1 text-sm font-semibold text-[var(--text)]">{copy.title}</p>
      <p className="mb-4 text-sm text-[var(--text-light)]">
        {copy.body}{' '}
        <a href={copy.privacyHref} className="underline">
          {copy.privacyLabel}
        </a>
        .
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={acceptAll}
          className="rounded-md bg-[var(--secondary)] px-4 py-2 text-sm font-medium text-[var(--secondary-foreground)] shadow-button"
        >
          {copy.acceptAll}
        </button>
        <button
          type="button"
          onClick={acceptEssential}
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)]"
        >
          {copy.acceptEssential}
        </button>
      </div>
    </div>
  )
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ConsentState
  } catch {
    return null
  }
}

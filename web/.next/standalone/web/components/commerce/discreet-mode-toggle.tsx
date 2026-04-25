'use client'

/**
 * Discreet Mode — privacy "panic" toggle unique to adult-content tenants.
 *
 * Click the eye icon → the site switches to a neutral "wellness blog" look
 * that hides product imagery, flattens the brand palette to gray, and
 * swaps page title + favicon in the tab. Click again to return to normal.
 * Persisted in a cookie so the toggle survives navigation.
 *
 * This is a marketing-differentiator feature: no other Paraguayan
 * e-commerce ships this. "Fun4Me — el único sex shop con botón de
 * privacidad" reads itself into memes.
 *
 * The actual visual swap is done via a `data-discreet="on"` attribute on
 * <html> + targeted CSS rules (see web/app/globals.css). Keeping the
 * logic here tiny — everything else is CSS.
 */

import { useEffect, useState } from 'react'

const COOKIE_NAME = 'discreet_mode'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
  } catch {
    /* cookie write failed — in-memory state still toggles */
  }
}

function applyDiscreetClass(on: boolean) {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  if (on) {
    el.setAttribute('data-discreet', 'on')
  } else {
    el.removeAttribute('data-discreet')
  }
}

export function DiscreetModeToggle() {
  const [on, setOn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = readCookie(COOKIE_NAME) === 'on'
    setOn(stored)
    applyDiscreetClass(stored)
    setMounted(true)
  }, [])

  function toggle() {
    const next = !on
    setOn(next)
    writeCookie(COOKIE_NAME, next ? 'on' : 'off')
    applyDiscreetClass(next)
  }

  // Avoid hydration mismatch: button shows "off" state on first render,
  // then swaps once cookie is read.
  const label = mounted && on ? 'Modo normal' : 'Modo discreto'
  const aria = mounted && on ? 'Salir del modo discreto' : 'Activar modo discreto'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      aria-pressed={mounted ? on : undefined}
      title={aria}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[color:var(--text-muted,#6b7280)] hover:bg-[color:var(--surface-light,#f9fafb)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {mounted && on ? (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8" />
            <circle cx="12" cy="12" r="3" />
          </>
        ) : (
          <>
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.7 21.7 0 0 1 5.08-5.94" />
            <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.7 21.7 0 0 1-3.17 4.26" />
          </>
        )}
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

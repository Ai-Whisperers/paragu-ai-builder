'use client'

import { useState, useSyncExternalStore } from 'react'

export interface AgeGateSectionProps {
  title?: string
  message?: string
  confirmText?: string
  denyText?: string
  /** Where to send the user when they decline — typically a safe external URL. */
  denyHref?: string
  /** Storage key; default is site-wide. Override per tenant if needed. */
  storageKey?: string
  /** Minimum age declared (used only for default copy). */
  minAge?: number
}

const DEFAULT_KEY = 'paragu_age_gate_confirmed'

const SERVER_SNAPSHOT: string | null = null
const subscribe = () => () => {}

function readStoredFlag(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Self-declared age gate for adult-content tenants. The registry flags
 * `features.ageGate.enabled: true, minAge: 18` for sex_shop,
 * cigar_lounge_shop, onlyfans_creator_studio, etc.; this component
 * enforces it at render time.
 *
 * Not a legal substitute for identity verification. Matches what
 * similar storefronts do locally: show a modal, require the visitor to
 * self-declare 18+, remember the choice in localStorage. Decline sends
 * them to a neutral external URL (defaults to google.com).
 *
 * Renders on the server too so bots and cached HTML still carry the
 * gate; the client swaps to hidden the moment localStorage says
 * confirmed=yes. Uses useSyncExternalStore so the read doesn't trigger
 * the "setState in effect" lint warning the naive useEffect pattern
 * would.
 */
export function AgeGateSection({
  title = 'Verificación de edad',
  message,
  confirmText,
  denyText = 'Salir',
  denyHref = 'https://google.com',
  storageKey = DEFAULT_KEY,
  minAge = 18,
}: AgeGateSectionProps) {
  const stored = useSyncExternalStore(
    subscribe,
    () => readStoredFlag(storageKey),
    () => SERVER_SNAPSHOT,
  )
  // Local toggle so confirm() hides the modal synchronously without a
  // full reload — useSyncExternalStore alone won't re-fire here because
  // we're not listening to storage events.
  const [dismissed, setDismissed] = useState(false)

  if (stored === 'yes' || dismissed) return null

  const resolvedMessage =
    message ??
    `Este sitio contiene contenido para adultos. Debés ser mayor de ${minAge} años para continuar.`
  const resolvedConfirm = confirmText ?? `Soy mayor de ${minAge}`

  function confirm() {
    try {
      window.localStorage.setItem(storageKey, 'yes')
    } catch {
      /* private mode or quota — still hide on this tab */
    }
    setDismissed(true)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      aria-describedby="agegate-message"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4"
    >
      <div className="max-w-md rounded-lg bg-[color:var(--surface,#fff)] p-6 text-center shadow-xl">
        <h2 id="agegate-title" className="mb-2 text-xl font-bold text-[color:var(--text,#111)]">
          {title}
        </h2>
        <p id="agegate-message" className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
          {resolvedMessage}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={confirm}
            className="rounded-lg bg-[color:var(--primary,#111)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90"
          >
            {resolvedConfirm}
          </button>
          <a
            href={denyHref}
            className="rounded-lg border border-[color:var(--border,#e5e7eb)] px-5 py-2.5 text-sm font-medium text-[color:var(--text-muted,#6b7280)] hover:bg-[color:var(--surface-muted,#f3f4f6)]"
          >
            {denyText}
          </a>
        </div>
      </div>
    </div>
  )
}

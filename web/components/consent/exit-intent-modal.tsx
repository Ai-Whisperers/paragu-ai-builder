'use client'

import { useEffect, useRef, useState } from 'react'
import { trackLeadSubmit } from '@/lib/analytics/marketing-events'
import { X } from 'lucide-react'

const STORAGE_KEY = 'nexa:exit-intent:seen'

export interface ExitIntentModalProps {
  headline: string
  subheadline: string
  emailPlaceholder: string
  submitLabel: string
  privacyLabel: string
  successMessage: string
  closeLabel: string
  fallbackEmail: string
  siteSlug: string
  locale: string
}

export function ExitIntentModal(props: ExitIntentModalProps) {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const alreadyShownRef = useRef(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) { alreadyShownRef.current = true; return }
    } catch { /* private-browsing fallthrough */ }
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    const handler = (e: MouseEvent) => {
      if (alreadyShownRef.current) return
      if (e.clientY <= 0 && e.relatedTarget === null) {
        alreadyShownRef.current = true
        try { sessionStorage.setItem(STORAGE_KEY, '1') } catch { /* noop */ }
        setVisible(true)
      }
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.includes('@')) { setStatus('error'); return }
    setStatus('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteSlug: props.siteSlug,
          locale: props.locale,
          email,
          source: 'exit-intent',
          consent: { privacyPolicy: true, marketing: true },
        }),
      })
      if (!res.ok) throw new Error(`status_${res.status}`)
      setStatus('success')
      trackLeadSubmit({ source: 'exit-intent', success: true, tenant: props.siteSlug })
    } catch {
      const subject = encodeURIComponent('Exit-intent lead — Nexa Paraguay')
      const body = encodeURIComponent(`New subscriber: ${email}`)
      window.location.href = `mailto:${props.fallbackEmail}?subject=${subject}&body=${body}`
      setStatus('success')
      // lead_fallback — API call failed, mailto used; still worth counting.
      trackLeadSubmit({ source: 'exit-intent', success: false, tenant: props.siteSlug })
    }
  }

  if (!visible) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-headline"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) setVisible(false) }}
    >
      <div className="relative w-[min(32rem,100%)] rounded-2xl bg-surface p-8 shadow-2xl">
        <button
          type="button"
          aria-label={props.closeLabel}
          onClick={() => setVisible(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-surface-light hover:text-foreground"
        >
          <X size={20} />
        </button>
        {status === 'success' ? (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold text-primary">{props.successMessage}</p>
          </div>
        ) : (
          <>
            <h3
              id="exit-intent-headline"
              className="mb-2 text-2xl font-bold text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {props.headline}
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{props.subheadline}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={props.emailPlaceholder}
                className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-md bg-secondary px-4 py-2.5 text-sm font-semibold text-[var(--secondary-foreground)] shadow-button disabled:opacity-60"
              >
                {status === 'sending' ? '…' : props.submitLabel}
              </button>
              <p className="pt-1 text-xs text-muted-foreground">{props.privacyLabel}</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

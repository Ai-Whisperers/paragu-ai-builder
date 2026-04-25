'use client'

import { useState } from 'react'

interface Props {
  siteSlug: string
  productId: string
  locale?: string
}

/**
 * Email capture shown on agotado PDPs. On submit, POSTs to
 * /api/storefront/[site]/back-in-stock. One-shot — switches to a
 * confirmation message on success; no second submit allowed in this
 * session.
 */
export function BackInStockSignup({ siteSlug, productId, locale = 'es' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = email.trim()
    if (!clean.includes('@')) {
      setStatus('error')
      setErrorMsg('Ingresá un email válido.')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(`/api/storefront/${encodeURIComponent(siteSlug)}/back-in-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email: clean, locale }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setErrorMsg(data.error === 'invalid_email' ? 'Email inválido.' : 'No pudimos guardar tu email. Probá de nuevo.')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setErrorMsg('Error de red. Probá de nuevo.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-sm text-green-900">
        <p className="font-semibold">✓ Te avisamos cuando vuelva.</p>
        <p className="mt-1 text-xs">
          Te mandamos un email a <strong>{email}</strong> en cuanto tengamos stock. Sin spam, solo este aviso.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4">
      <p className="mb-1 text-sm font-semibold text-[color:var(--text,#111)]">Avisame cuando vuelva</p>
      <p className="mb-3 text-xs text-[color:var(--text-muted,#6b7280)]">
        Te mandamos un solo email cuando esté disponible. Nada más.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
            disabled={status === 'sending'}
          />
        </label>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] disabled:opacity-50"
        >
          {status === 'sending' ? 'Enviando…' : 'Avisame'}
        </button>
      </div>
      {status === 'error' ? (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {errorMsg}
        </p>
      ) : null}
    </form>
  )
}

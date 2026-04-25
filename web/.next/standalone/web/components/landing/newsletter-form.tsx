'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) {
      setStatus('error')
      setMessage('Tenés que aceptar recibir novedades por email.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source: 'landing-footer', locale: 'es' }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        status?: string
        error?: string
      }
      if (!res.ok || data.error) {
        setStatus('error')
        setMessage('No pudimos registrarte. Intentá de nuevo o escribinos por WhatsApp.')
        return
      }
      setStatus('success')
      setMessage(
        data.status === 'already_subscribed'
          ? 'Ya estabas suscrito. ¡Gracias!'
          : 'Listo. Revisá tu email para confirmar la suscripción.',
      )
      setEmail('')
      setConsent(false)
    } catch {
      setStatus('error')
      setMessage('Error de conexión. Escribinos por WhatsApp si el problema persiste.')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Tu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-4 pl-12 pr-4 text-[var(--text)] placeholder-[var(--text-muted)] transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || status === 'success'}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-4 font-bold text-[var(--primary-foreground)] transition-all hover:opacity-90 disabled:opacity-60"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          {status === 'success' && <Check size={18} />}
          {status === 'success' ? 'Suscrito' : isLoading ? 'Enviando...' : 'Suscribirse'}
        </button>
      </div>

      <label className="flex items-start gap-3 text-left text-sm text-[var(--text-light)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={isLoading}
          className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
        />
        <span>
          Acepto recibir novedades de ParaguAI por email. Puedo darme de baja en cualquier momento.
        </span>
      </label>

      {message && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={`text-sm ${status === 'error' ? 'text-[var(--error)]' : 'text-[var(--success)]'}`}
        >
          {message}
        </p>
      )}
    </form>
  )
}

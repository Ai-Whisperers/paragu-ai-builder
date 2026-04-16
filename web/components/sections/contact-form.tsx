'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormProps {
  businessSlug: string
  businessName: string
  whatsapp?: string
}

/**
 * Contact form that submits to /api/contact.
 * Displayed alongside the contact info in the ContactSection.
 */
export function ContactForm({ businessSlug, businessName, whatsapp }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, businessSlug }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar el mensaje')
      }

      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('[ContactForm] Submit error:', error)
      setStatus('error')
      setErrorMsg(error instanceof Error ? error.message : 'Error al enviar el mensaje')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <CheckCircle size={48} className="mb-4 text-[var(--success)]" />
        <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Mensaje Enviado</h3>
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          Gracias por contactar a {businessName}. Te responderemos lo antes posible.
        </p>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Acabo de enviar un mensaje desde su sitio web.`)}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            O escribinos por WhatsApp
          </a>
        )}
        <button
          onClick={() => setStatus('idle')}
          className="mt-3 text-sm text-[var(--primary)] hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Envianos un Mensaje</h3>

      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Tu nombre *"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="email"
          placeholder="Tu email *"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
        <input
          type="tel"
          placeholder="Tu telefono"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>

      <div>
        <textarea
          placeholder="Tu mensaje *"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-white shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover disabled:pointer-events-none disabled:opacity-50"
      >
        {status === 'loading' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={16} />
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  )
}

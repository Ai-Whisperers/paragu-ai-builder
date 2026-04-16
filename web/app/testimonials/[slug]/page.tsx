'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { useParams } from 'next/navigation'
import {
  Star,
  Send,
  CheckCircle2,
  MessageSquareHeart,
  Link2,
} from 'lucide-react'

export default function TestimonialPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const businessName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Por favor ingresa tu nombre.')
      return
    }
    if (rating === 0) {
      setError('Por favor selecciona una calificacion.')
      return
    }
    if (!message.trim()) {
      setError('Por favor comparte tu experiencia.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: `testimonial-${Date.now()}@placeholder.local`,
          message: `[Testimonio - ${rating}/5 estrellas] ${message.trim()}`,
          businessSlug: slug,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(data.error || 'Error al enviar')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('[Testimonials] Submit error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error al enviar. Intenta de nuevo.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `/testimonials/${slug}`

  /* Success state */
  if (submitted) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <Container size="sm" className="py-12">
          <div
            className="mx-auto max-w-md rounded-2xl border p-8 text-center"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--success) 12%, transparent)',
              }}
            >
              <CheckCircle2
                className="h-8 w-8"
                style={{ color: 'var(--success)' }}
              />
            </div>
            <h1
              className="mb-2 text-2xl font-bold"
              style={{ color: 'var(--text)' }}
            >
              Gracias por tu opinion!
            </h1>
            <p
              className="mb-6 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Tu testimonio para <strong>{businessName}</strong> ha sido
              enviado correctamente. Lo valoramos mucho.
            </p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-6 w-6"
                  style={{
                    color: s <= rating ? 'var(--warning)' : 'var(--muted)',
                    fill: s <= rating ? 'var(--warning)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </Container>
      </main>
    )
  }

  /* Form state */
  return (
    <main
      className="flex min-h-screen items-center justify-center py-12"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <Container size="sm">
        <div
          className="mx-auto max-w-md rounded-2xl border p-8"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--primary) 10%, transparent)',
              }}
            >
              <MessageSquareHeart
                className="h-7 w-7"
                style={{ color: 'var(--primary)' }}
              />
            </div>
            <h1
              className="mb-1 text-xl font-bold"
              style={{ color: 'var(--text)' }}
            >
              Dejanos tu opinion
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Comparte tu experiencia con{' '}
              <strong style={{ color: 'var(--primary)' }}>
                {businessName}
              </strong>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: 'var(--text)' }}
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text)',
                }}
              />
            </div>

            {/* Calificacion */}
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: 'var(--text)' }}
              >
                Calificacion
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => {
                  const active = s <= (hoverRating || rating)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="rounded-lg p-1.5 transition-transform hover:scale-110"
                      aria-label={`${s} estrella${s > 1 ? 's' : ''}`}
                    >
                      <Star
                        className="h-8 w-8"
                        style={{
                          color: active ? 'var(--warning)' : 'var(--border)',
                          fill: active ? 'var(--warning)' : 'none',
                          transition: 'color 150ms, fill 150ms',
                        }}
                      />
                    </button>
                  )
                })}
              </div>
              {rating > 0 && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {rating === 1 && 'Mala'}
                  {rating === 2 && 'Regular'}
                  {rating === 3 && 'Buena'}
                  {rating === 4 && 'Muy buena'}
                  {rating === 5 && 'Excelente'}
                </p>
              )}
            </div>

            {/* Tu experiencia */}
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: 'var(--text)' }}
              >
                Tu experiencia
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuentanos sobre tu experiencia..."
                rows={4}
                className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text)',
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <p
                className="rounded-lg p-3 text-sm"
                style={{
                  backgroundColor:
                    'color-mix(in srgb, var(--error) 8%, transparent)',
                  color: 'var(--error)',
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                boxShadow: 'var(--shadow-button)',
              }}
            >
              {submitting ? (
                'Enviando...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Testimonio
                </>
              )}
            </button>
          </form>

          {/* QR / Share hint */}
          <div
            className="mt-6 rounded-xl border p-4 text-center"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
            }}
          >
            <div className="mb-2 flex items-center justify-center gap-1.5">
              <Link2
                className="h-4 w-4"
                style={{ color: 'var(--primary)' }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Comparte este enlace con tus clientes
              </span>
            </div>
            <p
              className="break-all rounded-lg px-3 py-2 font-mono text-xs"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--text-light)',
              }}
            >
              {currentUrl}
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}

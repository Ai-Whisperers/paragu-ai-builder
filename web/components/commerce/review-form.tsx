'use client'

import { useState } from 'react'

interface Props {
  siteSlug: string
  productId: string
}

/**
 * Lightweight review form. POSTs to the storefront endpoint which inserts
 * with is_approved=false — submissions are queued until an admin approves.
 * The copy sets that expectation so users don't refresh and wonder where
 * their review went.
 */
export function ReviewForm({ siteSlug, productId }: Props) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'ok' | 'err'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !name || !content) return
    setState('submitting')
    try {
      const res = await fetch(`/api/storefront/${siteSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, authorName: name, rating, title: title || undefined, content }),
      })
      setState(res.ok ? 'ok' : 'err')
      if (res.ok) {
        setName('')
        setRating(null)
        setTitle('')
        setContent('')
      }
    } catch {
      setState('err')
    }
  }

  return (
    <section aria-labelledby="review-form-heading" className="mt-8 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4">
      <h3 id="review-form-heading" className="mb-1 text-lg font-semibold">Escribí una reseña</h3>
      <p className="mb-3 text-xs text-[color:var(--text-muted,#6b7280)]">
        Las reseñas son revisadas antes de publicarse. Puede demorar 24–48 hs.
      </p>
      {state === 'ok' ? (
        <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">
          Gracias, tu reseña quedó pendiente de aprobación.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tu puntaje:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-pressed={rating === n}
                  aria-label={`${n} estrella${n === 1 ? '' : 's'}`}
                  className={`text-2xl leading-none transition-colors ${
                    rating !== null && n <= rating ? 'text-amber-500' : 'text-[color:var(--border,#d1d5db)]'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm">
            Tu nombre (o alias):
            <input
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
              placeholder="Ej. Ana, LuciC, etc."
            />
          </label>
          <label className="block text-sm">
            Título (opcional):
            <input
              type="text"
              maxLength={160}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
              placeholder="Ej. Excelente calidad"
            />
          </label>
          <label className="block text-sm">
            Tu experiencia:
            <textarea
              required
              minLength={10}
              maxLength={4000}
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
              placeholder="Contanos qué te pareció. Mínimo 10 caracteres."
            />
          </label>
          <button
            type="submit"
            disabled={state === 'submitting' || !rating || !name || content.length < 10}
            className="rounded bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-medium text-[color:var(--primary-foreground,#fff)] disabled:opacity-50"
          >
            {state === 'submitting' ? 'Enviando…' : 'Enviar reseña'}
          </button>
          {state === 'err' ? (
            <p className="text-sm text-red-700">No pudimos enviar tu reseña. Probá de nuevo en un momento.</p>
          ) : null}
        </form>
      )}
    </section>
  )
}

'use client'

import { useState } from 'react'
import type { TestimonialsContent, Testimonial } from '@/lib/commerce/business-content'
import { useSaveSection } from './use-save-section'
import { SaveButton } from './form-primitives'

const EMPTY: Testimonial = { name: '', quote: '', photoUrl: '', role: '', rating: 5 }

export function TestimonialsEditor({ businessId, initial }: { businessId: string; initial?: TestimonialsContent }) {
  const { saving, feedback, save } = useSaveSection(businessId, 'testimonials')
  const [items, setItems] = useState<Testimonial[]>(initial?.items ?? [])

  function update(index: number, patch: Partial<Testimonial>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }
  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }
  function add() {
    setItems((prev) => [...prev, { ...EMPTY }])
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Zod rejects empty-string name/quote — trim before sending.
    const cleaned = items
      .map((it) => ({
        ...it,
        name: it.name.trim(),
        quote: it.quote.trim(),
        role: it.role?.trim() ?? '',
        photoUrl: it.photoUrl?.trim() ?? '',
      }))
      .filter((it) => it.name.length > 0 && it.quote.length > 0)
    await save({ items: cleaned })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-6 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
          Aún no agregaste testimonios. Mínimo 2 recomendados.
        </p>
      ) : null}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="space-y-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
              Testimonio {idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-xs text-red-700 hover:underline"
            >
              Quitar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={item.name}
              onChange={(e) => update(idx, { name: e.target.value })}
              placeholder="Nombre del cliente"
              maxLength={120}
              className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            />
            <input
              value={item.role ?? ''}
              onChange={(e) => update(idx, { role: e.target.value })}
              placeholder="Rol / ciudad (opcional)"
              maxLength={120}
              className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            />
          </div>

          <textarea
            value={item.quote}
            onChange={(e) => update(idx, { quote: e.target.value })}
            placeholder="La frase que dijeron..."
            rows={3}
            maxLength={1000}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
            <input
              value={item.photoUrl ?? ''}
              onChange={(e) => update(idx, { photoUrl: e.target.value })}
              placeholder="Foto (URL https:// opcional)"
              type="url"
              className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            />
            <select
              value={item.rating ?? 5}
              onChange={(e) => update(idx, { rating: parseInt(e.target.value, 10) })}
              className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {'⭐'.repeat(n)} ({n})
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] px-4 py-3 text-sm font-medium text-[color:var(--text-muted,#6b7280)] hover:bg-surface-light"
      >
        + Agregar testimonio
      </button>

      <SaveButton saving={saving} feedback={feedback} />
    </form>
  )
}

'use client'

import { useState } from 'react'
import type { FaqContent, FaqItem } from '@/lib/commerce/business-content'
import { useSaveSection } from './use-save-section'
import { SaveButton } from './form-primitives'

export function FaqEditor({ businessId, initial }: { businessId: string; initial?: FaqContent }) {
  const { saving, feedback, save } = useSaveSection(businessId, 'faq')
  const [items, setItems] = useState<FaqItem[]>(initial?.items ?? [])

  function update(i: number, patch: Partial<FaqItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }
  function add() {
    setItems((prev) => [...prev, { question: '', answer: '' }])
  }
  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev]
      const target = i + dir
      if (target < 0 || target >= next.length) return next
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleaned = items
      .map((it) => ({ question: it.question.trim(), answer: it.answer.trim() }))
      .filter((it) => it.question.length > 0 && it.answer.length > 0)
    await save({ items: cleaned })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="space-y-2 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
              FAQ #{idx + 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="text-xs text-[color:var(--text-muted,#6b7280)] disabled:opacity-30 hover:underline"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(idx, 1)}
                disabled={idx === items.length - 1}
                className="text-xs text-[color:var(--text-muted,#6b7280)] disabled:opacity-30 hover:underline"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="ml-2 text-xs text-red-700 hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>

          <input
            value={item.question}
            onChange={(e) => update(idx, { question: e.target.value })}
            placeholder="Pregunta"
            maxLength={300}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm font-medium"
          />
          <textarea
            value={item.answer}
            onChange={(e) => update(idx, { answer: e.target.value })}
            placeholder="Respuesta"
            rows={3}
            maxLength={2000}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] px-4 py-3 text-sm font-medium text-[color:var(--text-muted,#6b7280)] hover:bg-surface-light"
      >
        + Agregar pregunta
      </button>

      <SaveButton saving={saving} feedback={feedback} />
    </form>
  )
}

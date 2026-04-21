'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function TenantNoteForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [pinned, setPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/tenants/${slug}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, pinned }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      setBody('')
      setPinned(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Nota sobre este tenant — observación, decisión, próximo paso…"
        rows={3}
        disabled={submitting}
        className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
      />
      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            disabled={submitting}
            className="rounded border-gray-300"
          />
          Fijar arriba
        </label>
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Agregar nota'}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  )
}

'use client'

import { useState } from 'react'
import type { ContentSection, BusinessContent } from '@/lib/commerce/business-content'

type Feedback = { kind: 'ok' | 'error'; message: string } | null

export function useSaveSection<K extends ContentSection>(businessId: string, section: K) {
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  async function save(value: BusinessContent[K]) {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/content/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, value }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'save_failed')
      }
      setFeedback({ kind: 'ok', message: 'Guardado' })
      return true
    } catch (err) {
      setFeedback({ kind: 'error', message: err instanceof Error ? err.message : 'Error al guardar' })
      return false
    } finally {
      setSaving(false)
    }
  }

  return { saving, feedback, save }
}

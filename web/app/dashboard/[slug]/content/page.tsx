'use client'

import { useEffect, useState } from 'react'
import { Save, Eye, Edit3 } from 'lucide-react'

export default function ContentPage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal/content')
      .then((r) => r.json())
      .then((d) => {
        const c = d.content || {}
        if (typeof c === 'object') {
          const flat: Record<string, string> = {}
          for (const [k, v] of Object.entries(c)) {
            flat[k] = typeof v === 'string' ? v : JSON.stringify(v)
          }
          setContent(flat)
        } else {
          setContent(c)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/portal/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  const entries = Object.entries(content)
  const hasContent = entries.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contenido del sitio</h1>
          <p className="mt-1 text-sm text-gray-500">
            Modificá los textos de tu sitio web
          </p>
        </div>
        <div className="flex gap-2">
          {hasContent && (
            <>
              <button
                onClick={() => setPreview(!preview)}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {preview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {preview ? 'Editar' : 'Vista previa'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar cambios'}
              </button>
            </>
          )}
        </div>
      </div>

      {!hasContent ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-gray-500">No hay contenido editable disponible.</p>
          <p className="mt-2 text-sm text-gray-400">
            El contenido de tu sitio se gestiona desde la configuración del negocio.
          </p>
        </div>
      ) : preview ? (
        <div className="rounded-xl border bg-white p-6">
          <div className="prose max-w-none">
            {entries.map(([key, value]) => (
              <div key={key} className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{key}</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-6">
          <div className="space-y-4">
            {entries.map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                {typeof value === 'string' && value.length > 200 ? (
                  <textarea
                    value={value}
                    onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y min-h-[80px]"
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    value={String(value ?? '')}
                    onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

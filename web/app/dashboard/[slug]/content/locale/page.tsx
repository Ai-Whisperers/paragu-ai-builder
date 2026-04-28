'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Save, Globe } from 'lucide-react'

const LOCALE_NAMES: Record<string, string> = {
  en: 'English', es: 'Español', nl: 'Nederlands', de: 'Deutsch', pt: 'Português',
}

export default function LocaleContentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const locale = searchParams.get('locale') || 'es'
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/portal/content/locale?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => {
        const c = d.content || {}
        const flat: Record<string, string> = {}
        for (const [k, v] of Object.entries(c)) {
          flat[k] = typeof v === 'string' ? v : JSON.stringify(v)
        }
        setContent(flat)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [locale])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/portal/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, _locale: locale }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  }

  const entries = Object.entries(content)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Contenido en {LOCALE_NAMES[locale] || locale}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Editá los textos de tu sitio en {LOCALE_NAMES[locale] || locale}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
          No hay contenido traducible disponible para este idioma.
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[80px]"
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    value={String(value ?? '')}
                    onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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

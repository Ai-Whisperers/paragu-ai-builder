'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, Send } from 'lucide-react'

interface ScheduledPage {
  id: string
  title: string
  status: string
  scheduled_at: string | null
  published_at: string | null
  created_at: string
}

export default function SchedulePage() {
  const [pages, setPages] = useState<ScheduledPage[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    fetch('/api/portal/schedule')
      .then((r) => r.json())
      .then((d) => { setPages(d.pages ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSent(false)
    const res = await fetch('/api/portal/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, scheduledDate }),
    })
    const data = await res.json()
    if (data.ok) {
      setSent(true)
      setTitle('')
      setContent('')
      setScheduledDate('')
      load()
    } else {
      setError(data.error || 'Error al programar')
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Contenido programado
        </h1>
        <p className="mt-1 text-sm text-gray-500">Programá publicaciones para tu blog o sitio</p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Programar nueva publicación</h2>
        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de publicación</label>
            <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {sent && <p className="text-sm text-green-600">Publicación programada correctamente</p>}
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Send className="h-4 w-4" />
            {saving ? 'Programando...' : 'Programar'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Publicaciones</h2>
        </div>
        {pages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No hay publicaciones aún.</div>
        ) : (
          <div className="divide-y">
            {pages.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{p.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {p.scheduled_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(p.scheduled_at).toLocaleDateString('es-PY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  p.status === 'published' ? 'bg-green-50 text-green-700' :
                  p.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {p.status === 'published' ? 'Publicado' : p.status === 'scheduled' ? 'Programado' : p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

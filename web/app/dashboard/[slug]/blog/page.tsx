'use client'

import { useEffect, useState, useRef } from 'react'
import { FileText, Plus, Edit3, Eye, Trash2, Calendar, Upload, Sparkles } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string | null
  status: string
  excerpt: string | null
  published_at: string | null
  scheduled_at: string | null
  created_at: string
  locale: string
}

const CATEGORIES = ['General', 'Noticias', 'Consejos', 'Promociones', 'Tutoriales', 'Eventos']

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('General')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [coverUrl, setCoverUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = () => {
    fetch('/api/portal/blog')
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(load, [])

  const resetForm = () => {
    setTitle(''); setContent(''); setExcerpt(''); setCategory('General')
    setStatus('draft'); setCoverUrl(''); setEditingId(null); setError('')
  }

  const startEdit = (p?: BlogPost) => {
    if (p) {
      setEditingId(p.id); setTitle(p.title)
      fetch(`/api/portal/blog/${p.id}`).then((r) => r.json()).then((d) => {
        setContent(d.post.content || '')
        setExcerpt(d.post.excerpt || '')
        setCategory(d.post.category || 'General')
        setStatus(d.post.status)
        setCoverUrl(d.post.cover_image_url || '')
      })
    } else {
      resetForm()
    }
    setShowEditor(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/portal/blog/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) setCoverUrl(data.url)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Título y contenido requeridos'); return }
    setSaving(true); setError('')
    const body = { title, content, excerpt, category, status, cover_image_url: coverUrl || null }
    const url = editingId ? `/api/portal/blog/${editingId}` : '/api/portal/blog'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.error) { setError(data.error) } else { resetForm(); setShowEditor(false); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta publicación?')) return
    await fetch(`/api/portal/blog/${id}`, { method: 'DELETE' })
    load()
  }

  const handlePublish = async (id: string) => {
    await fetch(`/api/portal/blog/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'published' }) })
    load()
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Blog
          </h1>
          <p className="mt-1 text-sm text-gray-500">{posts.length} publicacione{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={async () => {
            setGenerating(true)
            await fetch('/api/portal/blog/generate', { method: 'POST' })
            setGenerating(false)
            load()
          }} disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors">
            <Sparkles className="h-4 w-4 text-amber-500" />
            {generating ? 'Generando...' : 'Generar con IA'}
          </button>
          <button onClick={() => startEdit()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" /> Nueva publicación
          </button>
        </div>
      </div>

      {showEditor && (
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Editar' : 'Nueva'} publicación</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extracto (opcional)</label>
              <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada</label>
            <div className="flex gap-2 items-center">
              <input type="text" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="URL de la imagen"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="button" onClick={() => fileInput.current?.click()}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                <Upload className="h-4 w-4" />
              </button>
              <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
            {coverUrl && <img src={coverUrl} alt="" className="mt-2 h-20 w-32 rounded-lg object-cover" />}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={status === 'published'} onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')} />
              Publicar ahora
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear publicación'}
            </button>
            <button onClick={() => { resetForm(); setShowEditor(false) }}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500">No hay publicaciones aún. Creá tu primera entrada de blog.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === 'published' ? 'bg-green-50 text-green-700' :
                    p.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  }`}>{p.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  {p.category && <span>{p.category}</span>}
                  {p.published_at && <span>{new Date(p.published_at).toLocaleDateString('es-PY')}</span>}
                  {p.scheduled_at && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.scheduled_at).toLocaleDateString('es-PY')}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => startEdit(p)} className="rounded p-1.5 text-gray-500 hover:bg-gray-100" title="Editar"><Edit3 className="h-4 w-4" /></button>
                {p.status === 'draft' && <button onClick={() => handlePublish(p.id)} className="rounded p-1.5 text-green-600 hover:bg-green-50" title="Publicar"><Eye className="h-4 w-4" /></button>}
                <button onClick={() => handleDelete(p.id)} className="rounded p-1.5 text-red-500 hover:bg-red-50" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

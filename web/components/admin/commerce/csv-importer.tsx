'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PreviewRow {
  rowIndex: number
  ok: boolean
  error?: string
  data?: {
    slug: string
    name: string
    priceCents: number
    inventoryQty: number
    status: string
  }
}

interface PreviewResponse {
  mode: 'preview' | 'commit'
  summary: {
    total: number
    valid: number
    invalid: number
    inserted?: number
    headerWarnings: string[]
  }
  rows: PreviewRow[]
}

const TEMPLATE_CSV = `slug,name,description,category,price,compare_at_price,sku,stock,status,image_url
remera-basica-blanca,Remera Básica Blanca,100% algodón premium,ropa,85000,,REM-001,10,active,
jean-recto-azul,Jean Recto Azul,Calce recto clásico,ropa,180000,220000,JEAN-002,8,active,https://example.com/jean.jpg`

export function CsvImporter({ businessId }: { businessId: string }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [loading, setLoading] = useState<'idle' | 'previewing' | 'committing'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function run(mode: 'preview' | 'commit') {
    if (!file) return
    setError(null)
    setLoading(mode === 'preview' ? 'previewing' : 'committing')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('mode', mode)
      const res = await fetch(`/api/admin/commerce/${businessId}/products/import`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? data.error ?? 'Error')
      setPreview(data as PreviewResponse)
      if (mode === 'commit' && (data as PreviewResponse).summary.inserted) {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar')
    } finally {
      setLoading('idle')
    }
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paragu-productos-plantilla.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold">1. Preparar el CSV</h2>
        <p className="mb-3 text-xs text-[color:var(--text-muted,#6b7280)]">
          Columnas obligatorias: <code>slug</code>, <code>name</code>, <code>price</code>. Opcionales:{' '}
          <code>description</code>, <code>category</code>, <code>compare_at_price</code>, <code>sku</code>,{' '}
          <code>stock</code>, <code>status</code> (active/draft/archived), <code>image_url</code>.
        </p>
        <button
          type="button"
          onClick={downloadTemplate}
          className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-surface-light"
        >
          Descargar plantilla CSV
        </button>
      </section>

      <section className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">2. Subir archivo</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null)
              setPreview(null)
            }}
            className="text-sm"
          />
          <button
            type="button"
            onClick={() => run('preview')}
            disabled={!file || loading !== 'idle'}
            className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-surface-light disabled:opacity-50"
          >
            {loading === 'previewing' ? 'Procesando…' : 'Vista previa'}
          </button>
        </div>
        {file && (
          <p className="mt-2 text-xs text-[color:var(--text-muted,#6b7280)]">
            {file.name} · {(file.size / 1024).toFixed(1)} KB
          </p>
        )}
      </section>

      {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {preview && (
        <section className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold">3. Vista previa</h2>

          {preview.summary.headerWarnings.length > 0 ? (
            <div className="mb-3 rounded bg-red-50 p-3 text-xs text-red-800">
              {preview.summary.headerWarnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          ) : null}

          <div className="mb-3 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded bg-[color:var(--surface-muted,#f9fafb)] p-3">
              <p className="text-2xl font-bold">{preview.summary.total}</p>
              <p className="text-xs text-[color:var(--text-muted,#6b7280)]">Filas</p>
            </div>
            <div className="rounded bg-green-50 p-3 text-green-800">
              <p className="text-2xl font-bold">{preview.summary.valid}</p>
              <p className="text-xs">Válidas</p>
            </div>
            <div className="rounded bg-red-50 p-3 text-red-800">
              <p className="text-2xl font-bold">{preview.summary.invalid}</p>
              <p className="text-xs">Con errores</p>
            </div>
          </div>

          {preview.mode === 'commit' && preview.summary.inserted !== undefined ? (
            <p className="mb-3 rounded bg-green-50 p-3 text-sm text-green-800">
              ✓ {preview.summary.inserted} productos guardados (upsert por slug — existentes fueron actualizados).
            </p>
          ) : null}

          {preview.rows.length > 0 && (
            <div className="mb-3 max-h-80 overflow-y-auto rounded border border-[color:var(--border,#e5e7eb)]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[color:var(--surface-muted,#f9fafb)]">
                  <tr>
                    <th className="px-2 py-1 text-left">Fila</th>
                    <th className="px-2 py-1 text-left">Estado</th>
                    <th className="px-2 py-1 text-left">Slug</th>
                    <th className="px-2 py-1 text-left">Nombre</th>
                    <th className="px-2 py-1 text-right">Precio</th>
                    <th className="px-2 py-1 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((r) => (
                    <tr key={r.rowIndex} className="border-t border-[color:var(--border,#e5e7eb)]">
                      <td className="px-2 py-1 font-mono">{r.rowIndex}</td>
                      <td className="px-2 py-1">
                        {r.ok ? (
                          <span className="text-green-700">✓</span>
                        ) : (
                          <span className="text-red-700" title={r.error}>
                            ✗ {r.error?.slice(0, 60)}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1 font-mono">{r.data?.slug ?? '—'}</td>
                      <td className="px-2 py-1">{r.data?.name ?? '—'}</td>
                      <td className="px-2 py-1 text-right">
                        {r.data ? `Gs ${r.data.priceCents.toLocaleString('es-PY')}` : '—'}
                      </td>
                      <td className="px-2 py-1 text-right">{r.data?.inventoryQty ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preview.mode === 'preview' && preview.summary.valid > 0 && (
            <button
              type="button"
              onClick={() => run('commit')}
              disabled={loading !== 'idle'}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading === 'committing'
                ? 'Guardando…'
                : `Guardar ${preview.summary.valid} producto${preview.summary.valid === 1 ? '' : 's'}`}
            </button>
          )}
        </section>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductProps {
  id: string
  slug: string
  name: string
  description: string
  category: string
  brand: string
  tags: string[]
  priceCents: number
  inventoryQty: number
  status: 'active' | 'draft' | 'archived'
  isSeed: boolean
}

interface Props {
  businessId: string
  product: ProductProps
}

export function EditProductForm({ businessId, product }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = new FormData(event.currentTarget)
    const tagsRaw = String(form.get('tags') ?? '').trim()
    const payload = {
      name: String(form.get('name') ?? ''),
      description: String(form.get('description') ?? '') || undefined,
      category: String(form.get('category') ?? '') || undefined,
      brand: String(form.get('brand') ?? '') || undefined,
      tags: tagsRaw
        ? Array.from(
            new Set(
              tagsRaw
                .split(/[,\s]+/)
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean),
            ),
          )
        : [],
      priceCents: parseInt(String(form.get('priceCents') ?? '0').replace(/[^0-9]/g, ''), 10),
      inventoryQty: parseInt(String(form.get('inventoryQty') ?? '0'), 10) || 0,
      status: String(form.get('status') ?? 'active') as 'active' | 'draft' | 'archived',
    }

    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'update_failed')
      }
      router.push(`/admin/commerce/${businessId}/products`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Eliminar este producto? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/products/${product.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('delete_failed')
      router.push(`/admin/commerce/${businessId}/products`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
      {product.isSeed ? (
        <div className="rounded bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          Este es un producto de ejemplo. Editalo con tus datos reales o eliminalo.
        </div>
      ) : null}

      <Field label="Nombre" name="name" defaultValue={product.name} required />
      <Field label="URL slug" name="slug" defaultValue={product.slug} disabled hint="El slug no se puede cambiar después de crear el producto." />
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Descripción</span>
        <textarea
          name="description"
          defaultValue={product.description}
          rows={4}
          className="w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría" name="category" defaultValue={product.category} />
        <Field label="Marca" name="brand" defaultValue={product.brand} hint="Opcional — habilita el filtro de marca en la tienda." />
      </div>
      <Field
        label="Etiquetas"
        name="tags"
        defaultValue={product.tags.join(', ')}
        hint="Coma-separadas. Ej: silicona, impermeable, recargable. Se usan en los filtros de #Características."
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio (Gs)" name="priceCents" defaultValue={String(product.priceCents)} required />
        <Field label="Stock" name="inventoryQty" type="number" defaultValue={String(product.inventoryQty)} required />
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Estado</span>
        <select name="status" defaultValue={product.status} className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm">
          <option value="active">Activo (visible en la tienda)</option>
          <option value="draft">Borrador (oculto)</option>
          <option value="archived">Archivado</option>
        </select>
      </label>

      {error ? (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={submitting || deleting}
          className="rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? 'Eliminando…' : 'Eliminar producto'}
        </button>
        <button
          type="submit"
          disabled={submitting || deleting}
          className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  defaultValue,
  disabled,
  hint,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string
  disabled?: boolean
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        disabled={disabled}
        className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm disabled:bg-[color:var(--surface-muted,#f3f4f6)] disabled:text-[color:var(--text-muted,#9ca3af)]"
      />
      {hint ? <span className="mt-1 block text-xs text-[color:var(--text-muted,#9ca3af)]">{hint}</span> : null}
    </label>
  )
}

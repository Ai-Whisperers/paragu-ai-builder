'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  businessId: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

export function NewProductForm({ businessId }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = new FormData(event.currentTarget)
    const tagsRaw = String(form.get('tags') ?? '').trim()
    const payload = {
      slug: slug || slugify(name),
      name,
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
      inventoryPolicy: 'deny' as const,
      images: [],
      currency: 'PYG',
      status: 'active' as const,
      metadata: {},
    }

    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'create_failed')
      router.push(`/admin/commerce/${businessId}/products`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-6">
      <Field
        label="Nombre"
        required
        value={name}
        onChange={(v) => {
          setName(v)
          if (!slugTouched) setSlug(slugify(v))
        }}
      />
      <Field
        label="URL slug (auto)"
        value={slug}
        onChange={(v) => {
          setSlug(v)
          setSlugTouched(true)
        }}
        placeholder="ej: remera-blanca-basica"
      />
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Descripción</span>
        <textarea name="description" rows={4} className="w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm" />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría" name="category" placeholder="ej: mujer, hombre, accesorios" />
        <Field label="Marca" name="brand" placeholder="Opcional" />
      </div>
      <Field
        label="Etiquetas"
        name="tags"
        placeholder="silicona, impermeable, recargable"
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio (Gs)" name="priceCents" type="text" placeholder="150000" required />
        <Field label="Stock" name="inventoryQty" type="number" placeholder="10" required />
      </div>

      {error ? (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || !name}
        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        {submitting ? 'Guardando…' : 'Crear producto'}
      </button>
      <p className="text-center text-xs text-[color:var(--text-muted,#6b7280)]">
        Podés editar imágenes y detalles después de crear el producto.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string
  name?: string
  type?: string
  required?: boolean
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
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
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
      />
    </label>
  )
}

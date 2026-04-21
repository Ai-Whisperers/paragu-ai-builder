'use client'

import { useState, useRef, type DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductImage } from '@/lib/schemas/commerce/product'
import { resizeImageIfNeeded } from '@/lib/commerce/client-image-resize'

interface Props {
  businessId: string
  productId: string
  images: ProductImage[]
}

export function ProductImageUploader({ businessId, productId, images: initialImages }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState(initialImages)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBase = `/api/admin/commerce/${businessId}/products/${productId}/images`

  async function uploadFiles(files: FileList | File[]) {
    setError(null)
    setUploading(true)
    try {
      for (const original of Array.from(files)) {
        if (!original.type.startsWith('image/')) {
          setError(`${original.name} no es una imagen`)
          continue
        }
        const { file } = await resizeImageIfNeeded(original)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${original.name} supera los 5MB incluso después de reducir`)
          continue
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', '')
        if (images.length === 0) formData.append('isCover', 'true')

        const res = await fetch(apiBase, { method: 'POST', body: formData })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.message ?? data.error ?? 'upload_failed')
        }
        const { product } = await res.json()
        setImages(product.images)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files.length > 0) {
      await uploadFiles(event.dataTransfer.files)
    }
  }

  async function deleteImage(url: string) {
    if (!confirm('Eliminar esta imagen?')) return
    setError(null)
    try {
      const res = await fetch(apiBase, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error('delete_failed')
      const { product } = await res.json()
      setImages(product.images)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  async function setCover(url: string) {
    setError(null)
    try {
      const res = await fetch(apiBase, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_cover', url }),
      })
      if (!res.ok) throw new Error('set_cover_failed')
      const { product } = await res.json()
      setImages(product.images)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar portada')
    }
  }

  return (
    <section className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Imágenes del producto</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)] disabled:opacity-50"
        >
          {uploading ? 'Subiendo…' : 'Elegir archivos'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging
            ? 'border-[color:var(--primary,#111)] bg-[color:var(--primary,#111)]/5'
            : 'border-[color:var(--border,#e5e7eb)]'
        }`}
      >
        <p className="text-sm text-[color:var(--text-muted,#6b7280)]">
          {uploading ? 'Subiendo imágenes…' : 'Arrastrá imágenes acá o hacé clic en "Elegir archivos"'}
        </p>
        <p className="mt-1 text-xs text-[color:var(--text-muted,#9ca3af)]">
          JPG / PNG / WebP / GIF · máx 5MB · la primera imagen se marca como portada
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded bg-red-50 p-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}

      {images.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.url}
              className="group relative overflow-hidden rounded-lg border border-[color:var(--border,#e5e7eb)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? ''}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              {img.isCover ? (
                <span className="absolute left-2 top-2 rounded bg-[color:var(--primary,#111)] px-2 py-0.5 text-xs font-semibold text-white">
                  Portada
                </span>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.isCover && (
                  <button
                    type="button"
                    onClick={() => setCover(img.url)}
                    className="rounded bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
                  >
                    Portada
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteImage(img.url)}
                  className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}

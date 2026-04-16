'use client'

import { useState, useRef } from 'react'
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react'

interface ImageUploadProps {
  /** Current image URL (if editing) */
  currentUrl?: string
  /** Called with the uploaded file's public URL */
  onUpload: (url: string) => void
  /** Called when image is removed */
  onRemove?: () => void
  /** Supabase storage bucket name */
  bucket?: string
  /** Path prefix in the bucket */
  pathPrefix?: string
  /** Max file size in MB */
  maxSizeMb?: number
  /** Accepted file types */
  accept?: string
  /** Label text */
  label?: string
}

/**
 * Image upload component with preview and Supabase Storage integration.
 * Falls back to local preview when Supabase isn't configured.
 */
export function ImageUpload({
  currentUrl,
  onUpload,
  onRemove,
  bucket = 'business-images',
  pathPrefix = 'uploads',
  maxSizeMb = 5,
  accept = 'image/jpeg,image/png,image/webp',
  label = 'Subir Imagen',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`El archivo es muy grande. Maximo ${maxSizeMb}MB.`)
      return
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)

    try {
      // Try Supabase Storage upload
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { contentType: file.type, upsert: false })

      if (uploadError) {
        // If Supabase isn't configured, use local preview URL as fallback
        console.warn('[ImageUpload] Supabase upload failed, using local preview:', uploadError.message)
        onUpload(localUrl)
        return
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
      setPreview(urlData.publicUrl)
      onUpload(urlData.publicUrl)
    } catch (err) {
      // Supabase not configured — use local preview
      console.warn('[ImageUpload] Storage not available, using local preview')
      onUpload(localUrl)
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    setPreview(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--text)]">{label}</label>
      )}

      {preview ? (
        <div className="group relative overflow-hidden rounded-xl border border-[var(--border)]">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-white"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-[var(--destructive)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
            >
              <X size={14} />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-white/30 border-t-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-light)] py-10 text-[var(--text-muted)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          {uploading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--primary)]/30 border-t-[var(--primary)]" />
          ) : (
            <>
              <ImageIcon size={32} />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs">JPG, PNG o WebP &middot; Max {maxSizeMb}MB</span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--destructive)]">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}

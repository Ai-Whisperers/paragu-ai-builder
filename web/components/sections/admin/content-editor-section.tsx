'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Save, Eye, Edit3 } from 'lucide-react'

export interface ContentField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image'
  value: string
}

export interface ContentEditorSectionProps {
  title?: string
  subtitle?: string
  sectionId?: string
  fields?: ContentField[]
  variant?: 'inline'
  __locale?: string
}

export function ContentEditorSection({
  title = 'Editor de contenido',
  subtitle = 'Modificá el texto de tu sitio',
  fields = [],
}: ContentEditorSectionProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  )
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Heading level={2}>{title}</Heading>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPreview(!preview)} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-surface-light">
                {preview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {preview ? 'Editar' : 'Vista previa'}
              </button>
              <button onClick={handleSave} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                <Save className="h-4 w-4" /> {saved ? 'Guardado' : 'Guardar'}
              </button>
            </div>
          </div>

          {preview ? (
            <div className="rounded-xl border border-border bg-surface p-6">
              {fields.map((f) => (
                <div key={f.key} className="mb-4">
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">{f.label}</p>
                  {f.type === 'image' ? (
                    values[f.key] && <img src={values[f.key]} alt={f.label} className="h-32 rounded-lg object-cover" />
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{values[f.key] || '(vacío)'}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-sm font-medium text-foreground">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={values[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} rows={4} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
                  ) : f.type === 'image' ? (
                    <div className="flex items-center gap-3">
                      <input type="text" value={values[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} placeholder="URL de la imagen" className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
                      {values[f.key] && <img src={values[f.key]} alt="" className="h-10 w-10 rounded object-cover" />}
                    </div>
                  ) : (
                    <input type="text" value={values[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

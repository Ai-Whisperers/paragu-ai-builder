'use client'

import type { AboutContent } from '@/lib/commerce/business-content'
import { useSaveSection } from './use-save-section'
import { FieldInput, FieldTextarea, SaveButton } from './form-primitives'

export function AboutEditor({ businessId, initial }: { businessId: string; initial?: AboutContent }) {
  const { saving, feedback, save } = useSaveSection(businessId, 'about')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const f = new FormData(event.currentTarget)
    await save({
      title: String(f.get('title') ?? ''),
      body: String(f.get('body') ?? ''),
      imageUrl: String(f.get('imageUrl') ?? ''),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
      <FieldInput
        name="title"
        label="Título"
        defaultValue={initial?.title ?? ''}
        placeholder="Nuestra historia"
        maxLength={200}
      />
      <FieldTextarea
        name="body"
        label="Texto"
        hint="Contá la historia del negocio, los valores, los años de experiencia. 2-4 párrafos."
        defaultValue={initial?.body ?? ''}
        rows={8}
        maxLength={5000}
      />
      <FieldInput
        name="imageUrl"
        label="Imagen (URL)"
        hint="Foto del local, del equipo, o una imagen representativa."
        type="url"
        defaultValue={initial?.imageUrl ?? ''}
      />
      <SaveButton saving={saving} feedback={feedback} />
    </form>
  )
}

'use client'

import type { HeroContent } from '@/lib/commerce/business-content'
import { useSaveSection } from './use-save-section'
import { FieldInput, SaveButton } from './form-primitives'

export function HeroEditor({ businessId, initial }: { businessId: string; initial?: HeroContent }) {
  const { saving, feedback, save } = useSaveSection(businessId, 'hero')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const f = new FormData(event.currentTarget)
    await save({
      headline: String(f.get('headline') ?? ''),
      subheadline: String(f.get('subheadline') ?? ''),
      ctaPrimaryText: String(f.get('ctaPrimaryText') ?? ''),
      ctaPrimaryHref: String(f.get('ctaPrimaryHref') ?? ''),
      ctaSecondaryText: String(f.get('ctaSecondaryText') ?? ''),
      ctaSecondaryHref: String(f.get('ctaSecondaryHref') ?? ''),
      backgroundImageUrl: String(f.get('backgroundImageUrl') ?? ''),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-6">
      <FieldInput
        name="headline"
        label="Titular"
        hint="El texto grande arriba del todo. 1 línea, corto y contundente."
        defaultValue={initial?.headline ?? ''}
        placeholder="Tu belleza, nuestra pasión"
        maxLength={200}
      />
      <FieldInput
        name="subheadline"
        label="Subtítulo"
        hint="Frase de apoyo debajo del titular. 1-2 líneas."
        defaultValue={initial?.subheadline ?? ''}
        maxLength={400}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldInput
          name="ctaPrimaryText"
          label="Botón principal — texto"
          defaultValue={initial?.ctaPrimaryText ?? ''}
          placeholder="Reservar turno"
          maxLength={50}
        />
        <FieldInput
          name="ctaPrimaryHref"
          label="Botón principal — URL o WhatsApp"
          hint="Ej: https://wa.me/595981324569 o #reservas"
          defaultValue={initial?.ctaPrimaryHref ?? ''}
        />
        <FieldInput
          name="ctaSecondaryText"
          label="Botón secundario — texto"
          defaultValue={initial?.ctaSecondaryText ?? ''}
          placeholder="Ver servicios"
          maxLength={50}
        />
        <FieldInput
          name="ctaSecondaryHref"
          label="Botón secundario — URL"
          defaultValue={initial?.ctaSecondaryHref ?? ''}
        />
      </div>
      <FieldInput
        name="backgroundImageUrl"
        label="Imagen de fondo (URL)"
        hint="Pegá una URL https:// — formato JPG/PNG/WebP, idealmente 1920×1080 o más."
        type="url"
        defaultValue={initial?.backgroundImageUrl ?? ''}
      />
      <SaveButton saving={saving} feedback={feedback} />
    </form>
  )
}

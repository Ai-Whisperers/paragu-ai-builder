'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Save } from 'lucide-react'

export interface SettingField {
  id: string
  label: string
  type: 'text' | 'tel' | 'email' | 'textarea' | 'toggle'
  value: string
  category?: string
}

export interface TenantSettingsSectionProps {
  title?: string
  subtitle?: string
  fields?: SettingField[]
  variant?: 'form'
  __locale?: string
}

export function TenantSettingsSection({
  title = 'Configuración del sitio',
  subtitle = 'Personalizá la información de tu negocio',
  fields = [],
}: TenantSettingsSectionProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.id, f.value]))
  )
  const [saved, setSaved] = useState(false)

  const update = (id: string, val: string) => {
    setValues((prev) => ({ ...prev, [id]: val }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const categories = [...new Set(fields.map((f) => f.category || 'General'))]

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Heading level={2}>{title}</Heading>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <button onClick={handleSave} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              <Save className="h-4 w-4" /> {saved ? 'Guardado' : 'Guardar'}
            </button>
          </div>
          <div className="space-y-8">
            {categories.map((cat) => {
              const catFields = fields.filter((f) => (f.category || 'General') === cat)
              return (
                <div key={cat}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h3>
                  <div className="space-y-4">
                    {catFields.map((f) => (
                      <div key={f.id}>
                        <label className="mb-1 block text-sm font-medium text-foreground">{f.label}</label>
                        {f.type === 'textarea' ? (
                          <textarea value={values[f.id] || ''} onChange={(e) => update(f.id, e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
                        ) : (
                          <input type={f.type} value={values[f.id] || ''} onChange={(e) => update(f.id, e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}

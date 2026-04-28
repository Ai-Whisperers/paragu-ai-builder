'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Stethoscope } from 'lucide-react'

export interface SymptomOption {
  symptom: string
  specialty: string
  description?: string
}

export interface SymptomCheckerSectionProps {
  title?: string
  subtitle?: string
  symptoms?: SymptomOption[]
  locale?: string
}

const DEFAULT_SYMPTOMS: SymptomOption[] = [
  { symptom: 'Dolor de cabeza persistente', specialty: 'Neurología', description: 'Más de 3 días' },
  { symptom: 'Dolor abdominal', specialty: 'Gastroenterología', description: 'Náuseas o ardores' },
  { symptom: 'Dolor de espalda', specialty: 'Traumatología', description: 'Lumbar o cervical' },
  { symptom: 'Fiebre alta', specialty: 'Medicina General', description: '+38°C por más de 48hs' },
  { symptom: 'Dolor de garganta', specialty: 'Otorrinolaringología', description: 'Con o sin fiebre' },
  { symptom: 'Problemas de visión', specialty: 'Oftalmología', description: 'Visión borrosa o molestias' },
  { symptom: 'Dolor en articulaciones', specialty: 'Reumatología', description: 'Rodillas, manos, cadera' },
  { symptom: 'Estrés o ansiedad', specialty: 'Psicología', description: 'Problemas de sueño, irritabilidad' },
]

export function SymptomCheckerSection({
  title = '¿Qué te pasa?',
  subtitle = 'Seleccioná tu síntoma principal para orientarte',
  symptoms = DEFAULT_SYMPTOMS,
}: SymptomCheckerSectionProps) {
  const [selected, setSelected] = useState<SymptomOption | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed && selected) {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
            </div>
            <Heading level={3}>Recomendación</Heading>
            <p className="mt-2 text-lg font-semibold text-primary">{selected.specialty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
            <button
              onClick={() => { setSelected(null); setConfirmed(false) }}
              className="mt-6 text-sm text-primary hover:underline"
            >
              ← Volver a empezar
            </button>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="space-y-2">
            {symptoms.map((s) => (
              <button
                key={s.symptom}
                onClick={() => setSelected(selected?.symptom === s.symptom ? null : s)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  selected?.symptom === s.symptom
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-surface hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{s.symptom}</p>
                    {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
                  </div>
                  <span className="text-xs text-primary font-medium">{s.specialty}</span>
                </div>
              </button>
            ))}
          </div>
          {selected && (
            <button
              onClick={() => setConfirmed(true)}
              className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Ver recomendación
            </button>
          )}
        </div>
      </Container>
    </Section>
  )
}

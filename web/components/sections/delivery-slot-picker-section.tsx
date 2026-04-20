'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

/**
 * Delivery-slot picker — simple day + window chooser. Callers pass the set
 * of available windows; the section submits selection to an endpoint.
 *
 * Full Cal.com integration is a follow-up (embeddable iframe). For now this
 * handles the data model.
 */

export interface DeliverySlot {
  day: string
  label: string
  windows: Array<{ id: string; from: string; to: string; available: boolean }>
}

export interface DeliverySlotPickerProps {
  title?: string
  subtitle?: string
  slots: DeliverySlot[]
  submitEndpoint?: string
  submitLabel?: string
  onPick?: (payload: { dayId: string; windowId: string }) => void
}

export function DeliverySlotPickerSection({
  title = 'Elige tu horario de entrega',
  subtitle,
  slots,
  submitEndpoint = '/api/delivery-slot',
  submitLabel = 'Confirmar',
  onPick,
}: DeliverySlotPickerProps) {
  const [activeDay, setActiveDay] = useState(slots[0]?.day ?? '')
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const currentSlot = slots.find((s) => s.day === activeDay)

  async function onConfirm() {
    if (!activeDay || !activeWindow) return
    setSubmitting(true)
    try {
      if (onPick) {
        onPick({ dayId: activeDay, windowId: activeWindow })
      } else {
        await fetch(submitEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayId: activeDay, windowId: activeWindow }),
        })
      }
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <section className="py-12 bg-[var(--background)]">
        <Container>
          <p className="text-center text-[var(--primary)] font-medium">
            Listo — tu horario esta reservado.
          </p>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-12 bg-[var(--background)]">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {slots.map((s) => (
              <button
                key={s.day}
                onClick={() => {
                  setActiveDay(s.day)
                  setActiveWindow(null)
                }}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  activeDay === s.day
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--surface-light)] text-[var(--text)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(currentSlot?.windows || []).map((w) => {
              const selected = activeWindow === w.id
              return (
                <button
                  key={w.id}
                  disabled={!w.available}
                  onClick={() => setActiveWindow(w.id)}
                  className={`p-2 rounded text-sm border ${
                    !w.available
                      ? 'bg-[var(--surface-light)] text-[var(--text-muted)] line-through cursor-not-allowed'
                      : selected
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'border-[var(--surface-light)] bg-[var(--surface)] hover:border-[var(--primary)]'
                  }`}
                >
                  {w.from} – {w.to}
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={onConfirm} disabled={!activeWindow || submitting}>
              {submitting ? '...' : submitLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

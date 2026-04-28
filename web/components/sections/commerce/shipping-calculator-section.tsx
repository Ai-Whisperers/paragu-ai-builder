'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Truck, Package } from 'lucide-react'

export interface ShippingZone {
  id: string
  name: string
  baseFee: number
  freeThreshold: number
  estimatedDays: string
  currency?: string
}

export interface ShippingCalculatorSectionProps {
  title?: string
  subtitle?: string
  zones?: ShippingZone[]
  defaultCurrency?: string
  variant?: 'form' | 'simple'
  __locale?: string
}

const DEFAULT_ZONES: ShippingZone[] = [
  { id: 'asu', name: 'Asunción', baseFee: 0, freeThreshold: 300000, estimatedDays: '24hs', currency: 'PYG' },
  { id: 'central', name: 'Central (Fdo. Mora, San Lorenzo, Lambaré, Luque)', baseFee: 15000, freeThreshold: 500000, estimatedDays: '24-48hs' },
  { id: 'capia', name: 'Capiatá / Itauguá', baseFee: 25000, freeThreshold: 700000, estimatedDays: '48hs' },
  { id: 'interior', name: 'Interior del país', baseFee: 40000, freeThreshold: 1000000, estimatedDays: '3-5 días' },
]

function formatGs(cents: number): string {
  return `Gs. ${cents.toLocaleString('es-PY')}`
}

export function ShippingCalculatorSection({
  title = 'Calculá tu envío',
  subtitle = 'Seleccioná tu zona para ver el costo',
  zones = DEFAULT_ZONES,
  variant = 'form',
}: ShippingCalculatorSectionProps) {
  const [selectedZone, setSelectedZone] = useState('')
  const [orderAmount, setOrderAmount] = useState('')

  const zone = zones.find((z) => z.id === selectedZone)
  const amountNum = parseInt(orderAmount.replace(/[^0-9]/g, '')) || 0
  const isFree = zone && amountNum >= zone.freeThreshold
  const fee = zone ? (isFree ? 0 : zone.baseFee) : null

  if (variant === 'simple') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-md">
            <Heading level={3} className="mb-2">{title}</Heading>
            {subtitle && <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="space-y-4">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:border-secondary focus:outline-none"
              >
                <option value="">Seleccioná tu zona</option>
                {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
              {zone && (
                <div className="rounded-lg bg-surface-light p-4 text-sm">
                  <p className="font-medium text-foreground">{zone.estimatedDays}</p>
                  <p className="text-muted-foreground">{isFree ? 'Envío gratis' : formatGs(zone.baseFee)}</p>
                </div>
              )}
            </div>
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
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Zona de entrega</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none"
              >
                <option value="">Seleccioná...</option>
                {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Monto del pedido</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Gs.</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            {selectedZone && (
              <div className="rounded-lg bg-surface-light p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{zone?.name}</p>
                      <p className="text-xs text-muted-foreground">{zone?.estimatedDays}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {fee === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <Package className="h-3 w-3" /> Gratis
                      </span>
                    ) : fee ? (
                      <span className="text-sm font-semibold text-foreground">{formatGs(fee)}</span>
                    ) : null}
                  </div>
                </div>
                {zone && amountNum > 0 && !isFree && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Faltan {formatGs(zone.freeThreshold - amountNum)} para envío gratis
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

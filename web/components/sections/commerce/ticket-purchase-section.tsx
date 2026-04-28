'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Send, Plus, Minus } from 'lucide-react'

export interface TicketType {
  name: string
  price: string
  available: number
}

export interface TicketPurchaseSectionProps {
  title?: string
  eventName?: string
  eventDate?: string
  eventVenue?: string
  ticketTypes?: TicketType[]
  phone: string
  variant?: 'form'
  __locale?: string
}

export function TicketPurchaseSection({
  title = 'Compra de entradas',
  eventName,
  eventDate,
  eventVenue,
  ticketTypes = [],
  phone,
}: TicketPurchaseSectionProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [name, setName] = useState('')

  const adjust = (i: number, delta: number) => {
    setQuantities((prev) => {
      const c = prev[i] || 0
      const next = Math.max(0, c + delta)
      return { ...prev, [i]: next || 0 }
    })
  }

  const total = ticketTypes.reduce((s, _, i) => s + (quantities[i] || 0), 0)
  const isValid = total > 0 && name

  const buildUrl = () => {
    const lines = ticketTypes.filter((_, i) => (quantities[i] || 0) > 0).map((t, i) => `- ${t.name} x${quantities[ticketTypes.indexOf(t)]} (${t.price})`)
    const msg = `Hola! Quiero comprar entradas:%0AEvento: ${eventName}%0A${lines.join('%0A')}%0A%0ATotal: ${total} entrada(s)%0ANombre: ${name}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
            {eventName && <p className="mt-1 text-lg font-semibold text-foreground">{eventName}</p>}
            {eventDate && <p className="text-sm text-muted-foreground">{eventDate}{eventVenue ? ` · ${eventVenue}` : ''}</p>}
          </div>
          <div className="space-y-3">
            {ticketTypes.map((t, i) => {
              const qty = quantities[i] || 0
              return (
                <div key={t.name} className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                  <div>
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-sm text-primary">{t.price}</p>
                    <p className="text-xs text-muted-foreground">{t.available} disponibles</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 ? (
                      <>
                        <button onClick={() => adjust(i, -1)} className="flex h-8 w-8 items-center justify-center rounded border border-border"><Minus className="h-3 w-3" /></button>
                        <span className="min-w-[24px] text-center font-medium">{qty}</span>
                        <button onClick={() => adjust(i, 1)} disabled={qty >= t.available} className="flex h-8 w-8 items-center justify-center rounded border border-border disabled:opacity-30"><Plus className="h-3 w-3" /></button>
                      </>
                    ) : (
                      <button onClick={() => adjust(i, 1)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">Comprar</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {total > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-surface p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">{total} entrada(s)</p>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" className="mb-3 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Confirmar compra por WhatsApp
              </a>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

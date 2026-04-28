'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { ShoppingCart, Send, Minus, Plus } from 'lucide-react'

export interface OrderProduct {
  name: string
  price?: string
  image?: string
}

export interface WhatsAppOrderFormSectionProps {
  title?: string
  subtitle?: string
  products: OrderProduct[]
  phone: string
  messageTemplate?: string
  variant?: 'modal' | 'inline'
  __locale?: string
}

export function WhatsAppOrderFormSection({
  title = 'Pedido por WhatsApp',
  subtitle = 'Seleccioná tus productos y enviános tu pedido',
  products = [],
  phone,
  messageTemplate = 'Hola! Quiero hacer un pedido:%0A',
  variant = 'inline',
}: WhatsAppOrderFormSectionProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [name, setName] = useState('')

  const toggle = (idx: number) => {
    setQuantities((prev) => ({
      ...prev,
      [idx]: prev[idx] ? 0 : 1,
    }))
  }

  const adjust = (idx: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[idx] || 0
      const next = Math.max(0, current + delta)
      return { ...prev, [idx]: next || 0 }
    })
  }

  const selected = products.filter((_, i) => (quantities[i] || 0) > 0)
  const total = selected.reduce((sum, _, i) => sum + (quantities[i] || 0), 0)

  const buildMessage = (): string => {
    const lines = selected.map((p, i) => `- ${p.name} x${quantities[i]}${p.price ? ` (${p.price})` : ''}`)
    const msg = `${messageTemplate}${lines.join('%0A')}%0A%0ANombre: ${name}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`
  }

  if (variant === 'modal') {
    const [isOpen, setIsOpen] = useState(false)
    const overlay = isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsOpen(false)}>
        <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <Heading level={3} className="mb-1">{title}</Heading>
          {subtitle && <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>}
          {renderForm()}
        </div>
      </div>
    ) : null

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-700"
        >
          <ShoppingCart className="h-5 w-5" />
          Pedir ahora
        </button>
        {overlay}
      </>
    )
  }

  function renderForm() {
    return (
      <div className="space-y-4">
        {products.map((p, i) => {
          const qty = quantities[i] || 0
          return (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                {p.price && <p className="text-xs text-muted-foreground">{p.price}</p>}
              </div>
              <div className="flex items-center gap-2">
                {qty > 0 ? (
                  <>
                    <button onClick={() => adjust(i, -1)} className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-surface-light"><Minus className="h-3 w-3" /></button>
                    <span className="min-w-[20px] text-center text-sm font-medium text-foreground">{qty}</span>
                    <button onClick={() => adjust(i, 1)} className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-surface-light"><Plus className="h-3 w-3" /></button>
                  </>
                ) : (
                  <button onClick={() => toggle(i)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">Agregar</button>
                )}
              </div>
            </div>
          )
        })}

        {total > 0 && (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none"
            />
            <a
              href={buildMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              Enviar pedido ({total} {total === 1 ? 'producto' : 'productos'}) por WhatsApp
            </a>
          </>
        )}
      </div>
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
          {renderForm()}
        </div>
      </Container>
    </Section>
  )
}

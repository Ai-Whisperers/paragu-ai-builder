'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Send } from 'lucide-react'

export interface OrderProduct {
  name: string
  price: string
  category?: string
  image?: string
}

export interface OnlineOrderingSectionProps {
  title?: string
  subtitle?: string
  products?: OrderProduct[]
  phone: string
  categories?: string[]
  variant?: 'inline' | 'sidebar'
  __locale?: string
}

export function OnlineOrderingSection({
  title = 'Pedí online',
  subtitle = 'Agregá productos y enviános tu pedido por WhatsApp',
  products = [],
  phone,
  categories,
  variant = 'inline',
}: OnlineOrderingSectionProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [activeCat, setActiveCat] = useState<string>('all')
  const [name, setName] = useState('')

  const allCats = categories || [...new Set(products.map((p) => p.category || 'General').filter(Boolean))]
  const filtered = activeCat === 'all' ? products : products.filter((p) => (p.category || 'General') === activeCat)
  const selected = products.filter((_, i) => (quantities[i] || 0) > 0)
  const total = selected.reduce((s, _, i) => s + (quantities[i] || 0), 0)
  const totalPrice = selected.reduce((s, p, i) => {
    const match = p.price.match(/[\d.]+/)
    return s + (parseInt((match?.[0] || '0').replace(/\./g, '')) || 0) * (quantities[i] || 0)
  }, 0)

  const adjust = (idx: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[idx] || 0
      const next = Math.max(0, current + delta)
      return { ...prev, [idx]: next || 0 }
    })
  }

  const buildUrl = () => {
    const lines = selected.map((p, i) => `- ${p.name} x${quantities[i]}${p.price ? ` (${p.price})` : ''}`)
    const msg = `Hola! Quiero hacer un pedido:%0A${lines.join('%0A')}%0A%0ATotal: ${total} productos%0ANombre: ${name}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="mx-auto max-w-2xl">
          {allCats.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button onClick={() => setActiveCat('all')} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeCat === 'all' ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground'}`}>Todos</button>
              {allCats.map((c) => (
                <button key={c} onClick={() => setActiveCat(c)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeCat === c ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground'}`}>{c}</button>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {filtered.map((p, i) => {
              const origIdx = products.indexOf(p)
              const qty = quantities[origIdx] || 0
              return (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 ? (
                      <>
                        <button onClick={() => adjust(origIdx, -1)} className="flex h-7 w-7 items-center justify-center rounded border border-border"><Minus className="h-3 w-3" /></button>
                        <span className="min-w-[20px] text-center text-sm font-medium">{qty}</span>
                        <button onClick={() => adjust(origIdx, 1)} className="flex h-7 w-7 items-center justify-center rounded border border-border"><Plus className="h-3 w-3" /></button>
                      </>
                    ) : (
                      <button onClick={() => adjust(origIdx, 1)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white">Agregar</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {total > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-surface p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">{total} producto{total !== 1 ? 's' : ''}</p>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="mb-3 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-secondary focus:outline-none" />
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Enviar pedido por WhatsApp
              </a>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

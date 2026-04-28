'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Send, Building2 } from 'lucide-react'

export interface WholesaleProduct {
  name: string
  unit: string
  pricePerUnit: string
}

export interface WholesaleInquirySectionProps {
  title?: string
  subtitle?: string
  products?: WholesaleProduct[]
  phone: string
  email?: string
  variant?: 'form' | 'compact'
  __locale?: string
}

export function WholesaleInquirySection({
  title = 'Consulta mayorista',
  subtitle = 'Completá el formulario y te enviamos cotización',
  products = [],
  phone,
  variant = 'form',
}: WholesaleInquirySectionProps) {
  const [businessName, setBusinessName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')

  const isValid = businessName && contactName

  const buildUrl = () => {
    const msg = `Hola! Quiero cotización mayorista:%0A- Empresa: ${businessName}%0A- Contacto: ${contactName}%0A- Teléfono: ${contactPhone}%0A- Consulta: ${notes}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-2 flex justify-center"><Building2 className="h-8 w-8 text-primary" /></div>
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          {products.length > 0 && (
            <div className="mb-4 rounded-lg bg-surface-light p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Productos disponibles:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {products.map((p) => <p key={p.name}>· {p.name} — {p.pricePerUnit}/{p.unit}</p>)}
              </div>
            </div>
          )}
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre de la empresa</label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Razón social" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Persona de contacto</label>
                <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Nombre" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
                <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+595 981..." className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Consulta</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Productos, cantidades aproximadas..." rows={2} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            {isValid && (
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Solicitar cotización
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

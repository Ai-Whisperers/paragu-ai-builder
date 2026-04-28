'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export interface WarrantyProduct {
  name: string
  warrantyPeriod: string
  terms: string
  category?: string
}

export interface WarrantyInfoSectionProps {
  title?: string
  subtitle?: string
  products?: WarrantyProduct[]
  variant?: 'accordion' | 'cards'
  __locale?: string
}

export function WarrantyInfoSection({
  title = 'Garantía de productos',
  subtitle = 'Conocé los detalles de cobertura',
  products = [],
  variant = 'accordion',
}: WarrantyInfoSectionProps) {
  if (!products?.length) return null

  if (variant === 'cards') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mb-8 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Card key={p.name}>
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                  </div>
                  <p className="text-sm font-medium text-green-600">{p.warrantyPeriod}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.terms}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="space-y-2">
            {products.map((p, i) => (
              <WarrantyAccordion key={i} product={p} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

function WarrantyAccordion({ product }: { product: WarrantyProduct }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{product.name}</span>
          <span className="text-xs text-green-600">({product.warrantyPeriod})</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">{product.terms}</p>
        </div>
      )}
    </div>
  )
}

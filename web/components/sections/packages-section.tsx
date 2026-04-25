'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Package {
  id: string
  name: string
  description: string
  original_price: number
  sale_price: number
  services: string[]
  popular?: boolean
}

interface GiftCard {
  id: string
  amount: number
  description: string
}

interface PackagesSectionProps {
  packages: Package[]
  giftCards?: GiftCard[]
  showGiftCards?: boolean
}

export function PackagesSection({ 
  packages, 
  giftCards,
  showGiftCards = true 
}: PackagesSectionProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'giftcards'>('packages')
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  const calculateSavings = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100)
  }
  
  return (
    <section className="py-16 bg-[var(--surface)]">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <Heading level={2} className="text-3xl font-bold mb-4">Promociones Especiales</Heading>
          
          {/* Tabs */}
          {showGiftCards && giftCards && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('packages')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeTab === 'packages' 
                    ? "bg-[var(--primary)] text-white" 
                    : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                )}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Packs
              </button>
              <button
                onClick={() => setActiveTab('giftcards')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeTab === 'giftcards' 
                    ? "bg-[var(--primary)] text-white" 
                    : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                )}
              >
                <Gift className="w-4 h-4 inline mr-2" />
                Gift Cards
              </button>
            </div>
          )}
        </div>
        
        {/* Packages */}
        {activeTab === 'packages' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(packages || []).map((pkg) => (
                    {(pkg?.services || []).map((service, idx) => (
              {(giftCards || []).map((card) => (
                <Card 
                  key={card.id}
                  className="cursor-pointer hover:border-[var(--primary)] transition-colors"
                >
                  <CardContent className="p-6 text-center">
                    <Gift className="w-8 h-8 mx-auto mb-3 text-[var(--primary)]" />
                    <div className="text-2xl font-bold">{formatPrice(card.amount)}</div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 bg-[var(--muted)] rounded-lg p-6">
              <h4 className="font-semibold mb-2">¿Cómo funcionan las Gift Cards?</h4>
              <ul className="text-sm text-[var(--muted-foreground)] space-y-1">
                <li>1. Selecciona el monto</li>
                <li>2. Ingresa los datos del destinatario</li>
                <li>3. Agrega un mensaje personalizado</li>
                <li>4. La enviamos por email o WhatsApp</li>
                <li>5. Válida por 12 meses</li>
              </ul>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}

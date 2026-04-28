'use client'
import { Section } from '@/components/ui/section'

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
    <Section spacing="md" background="surface">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <Heading level={2} className="text-xl sm:text-3xl font-bold mb-4">Promociones Especiales</Heading>
          
          {/* Tabs */}
          {showGiftCards && giftCards && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('packages')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeTab === 'packages' 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80"
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
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80"
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
              <Card 
                key={pkg.id}
                className={cn(
                  "relative overflow-hidden",
                  pkg.popular && "border-2 border-primary"
                )}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">
                    Más Popular
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <Heading level={3} className="text-xl font-bold">{pkg.name}</Heading>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                
                <CardContent>
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl sm:text-3xl font-bold text-primary">
                      {formatPrice(pkg.sale_price)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(pkg.original_price)}
                    </span>
                    <Badge variant="secondary" className="ml-auto">
                      Ahorra {calculateSavings(pkg.original_price, pkg.sale_price)}%
                    </Badge>
                  </div>
                  
                  {/* Services included */}
                  <ul className="space-y-2 mb-6">
                    {(pkg?.services || []).map((service, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[var(--success)] mt-0.5" />
                        {service}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full">
                    Comprar Pack
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Gift Cards */}
        {activeTab === 'giftcards' && giftCards && (
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(giftCards || []).map((card) => (
                <Card 
                  key={card.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                >
                  <CardContent className="p-6 text-center">
                    <Gift className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold">{formatPrice(card.amount)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 bg-muted rounded-lg p-6">
              <h4 className="font-semibold mb-2">&iquest;C&oacute;mo funcionan las Gift Cards?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Selecciona el monto</li>
                <li>2. Ingresa los datos del destinatario</li>
                <li>3. Agrega un mensaje personalizado</li>
                <li>4. La enviamos por email o WhatsApp</li>
                <li>5. V&aacute;lida por 12 meses</li>
              </ul>
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}

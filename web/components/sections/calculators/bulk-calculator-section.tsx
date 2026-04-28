'use client'

import { useState } from 'react'
import { Calculator, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Heading } from '@/components/ui/heading'
import { cleanPhone } from '@/lib/format'

export function BulkCalculator({ phone, className }: { phone: string; className?: string }) {
  const [quantity, setQuantity] = useState(100)
  const unitPrice = 800
  const wholesalePrice = 600
  const savings = (unitPrice - wholesalePrice) * quantity

  return (
    <section className={cn('py-16 bg-surface', className)}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary">
            <Building2 className="w-4 h-4 mr-1" />
            Precios Mayoristas
          </Badge>
          <Heading level={2} className="text-xl sm:text-3xl font-bold mb-4">Calculadora Mayorista</Heading>
          <p className="text-muted-foreground">Calculá tu ahorro al instante</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Calculá tu pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Cantidad de huevos</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min={100}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">Mínimo 100 unidades para precio mayorista</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-muted-foreground">Precio normal</p>
                <p className="text-xl font-bold">{(unitPrice * quantity).toLocaleString()} Gs</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary">Precio mayorista</p>
                <p className="text-xl font-bold text-primary">{(wholesalePrice * quantity).toLocaleString()} Gs</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-[var(--success)]">Tu ahorro</p>
                <p className="text-xl font-bold text-[var(--success)]">{savings.toLocaleString()} Gs</p>
              </div>
            </div>

            <a href={`https://wa.me/${cleanPhone(phone)}?text=Hola! Vi su calculadora mayorista. Me interesa hacer un pedido de ${quantity} huevos.`} target="_blank" rel="noopener noreferrer">
              <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90">
                Solicitar cotización por WhatsApp
              </button>
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default BulkCalculator

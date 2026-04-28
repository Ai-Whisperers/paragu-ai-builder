'use client'
import { Section } from '@/components/ui/section'

import { useState } from 'react'
import { Calendar, Repeat, Truck, Package, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SmartWhatsAppButton } from '@/components/sections/navigation/smart-whatsapp-section'
import { Heading } from '@/components/ui/heading'

export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly'

export interface SubscriptionPlan {
  id: string
  name: string
  products: Array<{
    productId: string
    name: string
    quantity: number
    unitPrice: number
  }>
  frequency: SubscriptionFrequency
  deliveryDay: string
  totalMonthly: number
}

export interface SubscriptionFormProps {
  phone: string
  products: Array<{
    id: string
    name: string
    price: number
    unit: string
  }>
  className?: string
}

const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual'
}

const DELIVERY_DAYS = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado'
]


export interface SubscriptionSectionProps {
  phone?: string
  products?: Array<{ name: string; price: string }>
  className?: string
}

import { SubscriptionForm } from './subscription-form'

export function SubscriptionSection({ phone, products, className }: SubscriptionSectionProps) {
  return (
    <Section fullWidth spacing="md" background="surface" className={className}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary">Nuevo Servicio</Badge>
          <Heading level={2} className="text-xl sm:text-3xl font-bold text-foreground mb-4">
            Pedidos Recurrentes
          </Heading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recibe huevos frescos regularmente sin tener que hacer pedidos cada vez. 
            Ideal para familias y negocios.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <SubscriptionForm phone={phone!} products={(products || []).map((p, i) => ({ id: String(i), name: p.name, price: Number(p.price) || 0, unit: 'unidad' }))} />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Beneficios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Nunca te quedes sin huevos',
                  'Precio preferencial fijo',
                  'Delivery prioritario',
                  'Pausa o cancela cuando quieras',
                  'Facturacion mensual (B2B)'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">1</span>
                    <span className="text-foreground">Selecciona tus productos y frecuencia</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">2</span>
                    <span className="text-foreground">Te contactamos para confirmar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">3</span>
                    <span className="text-foreground">Recibe tu entrega el dia acordado</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">4</span>
                    <span className="text-foreground">Repite automaticamente!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default SubscriptionForm

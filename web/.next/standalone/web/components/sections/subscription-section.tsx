'use client'

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
import { SmartWhatsAppButton } from './smart-whatsapp-section'
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

export function SubscriptionForm({ phone, products, className }: SubscriptionFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    frequency: 'weekly' as SubscriptionFrequency,
    deliveryDay: 'Lunes',
    name: '',
    phone: '',
    address: '',
    products: [] as Array<{ productId: string; quantity: number }>
  })
  const [submitted, setSubmitted] = useState(false)

  const addProduct = (productId: string) => {
    const exists = formData.products.find(p => p.productId === productId)
    if (!exists) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { productId, quantity: 1 }]
      }))
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.productId === productId ? { ...p, quantity } : p
      )
    }))
  }

  const removeProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.productId !== productId)
    }))
  }

  const calculateTotal = () => {
    return formData.products.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  const buildWhatsAppMessage = () => {
    const productList = formData.products.map(item => {
      const product = products.find(p => p.id === item.productId)
      return `- ${product?.name}: ${item.quantity} unidades`
    }).join('\n')

    return `Hola! Me interesa el servicio de pedidos recurrentes.

*Detalles:*
Frecuencia: ${FREQUENCY_LABELS[formData.frequency]}
Dia de entrega: ${formData.deliveryDay}
Nombre: ${formData.name}
Telefono: ${formData.phone}
Direccion: ${formData.address}

*Productos:*
${productList}

*Total estimado:* ${calculateTotal().toLocaleString()} Gs por entrega`
  }

  if (submitted) {
    return (
      <Card className={cn('text-center', className)}>
        <CardContent className="pt-6 pb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <Heading level={3} className="text-xl font-semibold mb-2">Solicitud Enviada!</Heading>
          <p className="text-[var(--text-muted)] mb-4">
            Te contactaremos por WhatsApp para confirmar tu suscripcion.
          </p>
          <SmartWhatsAppButton
            phone={phone}
            context="general"
            className="w-full"
          >
            Contactar por WhatsApp
          </SmartWhatsAppButton>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-[var(--surface)] border-b border-[var(--border)]">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Repeat className="w-5 h-5 text-[var(--primary)]" />
          Pedidos Recurrentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Selecciona tus productos
              </Label>
              <div className="space-y-2">
                {products.map((product) => {
                  const selected = formData.products.find(p => p.productId === product.id)
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border transition-all',
                        selected 
                          ? 'border-[var(--primary)] bg-[var(--surface)]' 
                          : 'border-[var(--border)] hover:border-[var(--primary)]'
                      )}
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {product.price.toLocaleString()} Gs/{product.unit}
                        </p>
                      </div>
                      {selected ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(product.id, Math.max(0, selected.quantity - 1))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{selected.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(product.id, selected.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-500"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addProduct(product.id)}
                        >
                          Agregar
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {formData.products.length > 0 && (
              <div className="bg-[var(--surface)] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total por entrega:</span>
                  <span className="text-xl font-bold text-[var(--primary)]">
                    {calculateTotal().toLocaleString()} Gs
                  </span>
                </div>
              </div>
            )}

            <Button 
              className="w-full"
              disabled={formData.products.length === 0}
              onClick={() => setStep(2)}
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Frecuencia de entrega</Label>
                <RadioGroup
                  value={formData.frequency}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, frequency: value as SubscriptionFrequency }))}
                  className="grid grid-cols-3 gap-2"
                >
                  {(['weekly', 'biweekly', 'monthly'] as SubscriptionFrequency[]).map((freq) => (
                    <div key={freq}>
                      <RadioGroupItem
                        value={freq}
                        id={freq}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={freq}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-lg border-2 border-[var(--border)] bg-[var(--background)] p-4',
                          'hover:bg-[var(--surface)] hover:border-[var(--primary)] cursor-pointer',
                          'peer-data-[state=checked]:border-[var(--primary)] peer-data-[state=checked]:bg-[var(--surface)]'
                        )}
                      >
                        <Repeat className="w-5 h-5 mb-1 text-[var(--primary)]" />
                        <span className="text-sm font-medium">{FREQUENCY_LABELS[freq]}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-2 block">Dia de entrega preferido</Label>
                <Select
                  value={formData.deliveryDay}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryDay: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Atras
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2 block">Tu nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Maria Gonzalez"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2 block">Telefono de contacto</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Ej: 0981 123 456"
                />
              </div>

              <div>
                <Label htmlFor="address" className="mb-2 block">Direccion de entrega</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Ej: Calle Principal 123, Coronel Oviedo"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[var(--surface)] rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Resumen:</h4>
              <div className="text-sm space-y-1 text-[var(--text-muted)]">
                <p>Frecuencia: <span className="text-[var(--text)]">{FREQUENCY_LABELS[formData.frequency]}</span></p>
                <p>Dia: <span className="text-[var(--text)]">{formData.deliveryDay}</span></p>
                <p>Total: <span className="text-[var(--primary)] font-medium">{calculateTotal().toLocaleString()} Gs</span></p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Atras
              </Button>
              <a
                href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={() => setSubmitted(true)}
              >
                <Button className="w-full">
                  Enviar Solicitud
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export interface SubscriptionSectionProps {
  phone: string
  products: Array<{
    id: string
    name: string
    price: number
    unit: string
  }>
  className?: string
}

export function SubscriptionSection({ phone, products, className }: SubscriptionSectionProps) {
  return (
    <section className={cn('py-16 bg-[var(--surface)]', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[var(--primary)]">Nuevo Servicio</Badge>
          <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
            Pedidos Recurrentes
          </Heading>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Recibe huevos frescos regularmente sin tener que hacer pedidos cada vez. 
            Ideal para familias y negocios.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <SubscriptionForm phone={phone} products={products} />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--primary)]" />
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
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--text)]">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--primary)]" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">1</span>
                    <span className="text-[var(--text)]">Selecciona tus productos y frecuencia</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">2</span>
                    <span className="text-[var(--text)]">Te contactamos para confirmar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">3</span>
                    <span className="text-[var(--text)]">Recibe tu entrega el dia acordado</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">4</span>
                    <span className="text-[var(--text)]">Repite automaticamente!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SubscriptionForm

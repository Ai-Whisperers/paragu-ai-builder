'use client'

import { useState } from 'react'
import { MessageCircle, Truck, Building, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { cleanPhone } from '@/lib/format'

export type WhatsAppContext = 'product' | 'wholesale' | 'delivery' | 'chicken' | 'subscription' | 'general'

export interface WhatsAppTemplate {
  id: string
  label: string
  template: string
  context: WhatsAppContext
  icon: React.ReactNode
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'product_inquiry',
    label: 'Consultar Producto',
    context: 'product',
    icon: <MessageCircle className="w-4 h-4" />,
    template: 'Hola! Vi el {{productName}} a {{price}} en su web. Esta disponible? Quiero {{quantity}}.'
  },
  {
    id: 'wholesale_inquiry',
    label: 'Precios Mayoristas',
    context: 'wholesale',
    icon: <Building className="w-4 h-4" />,
    template: 'Hola! Represento a un negocio y me interesa su lista de precios mayoristas. Consumimos aprox {{weeklyVolume}} huevos/semana. Podemos coordinar?'
  },
  {
    id: 'delivery_inquiry',
    label: 'Consultar Delivery',
    context: 'delivery',
    icon: <Truck className="w-4 h-4" />,
    template: 'Hola! Necesito delivery a {{address}}. Cual es el costo de envio? Quiero {{productList}}.'
  },
  {
    id: 'subscription_inquiry',
    label: 'Pedido Recurrente',
    context: 'subscription',
    icon: <Calendar className="w-4 h-4" />,
    template: 'Hola! Me interesa el servicio de entrega semanal. Somos {{familySize}} personas. Tienen planes de suscripcion?'
  }
]

export interface SmartWhatsAppButtonProps {
  phone: string
  context?: WhatsAppContext
  productName?: string
  price?: string
  quantity?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline' | 'default'
  children?: React.ReactNode
}

export function SmartWhatsAppButton({
  phone,
  context = 'general',
  productName,
  price,
  quantity = '1',
  className,
  size = 'md',
  variant = 'default',
  children
}: SmartWhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const buildWhatsAppUrl = (): string => {
    const cleaned = cleanPhone(phone)
    
    let message = 'Hola! Vi su pagina web y me interesa hacer un pedido.'
    
    if (context === 'product' && productName && price) {
      message = `Hola! Vi el ${productName} a ${price} en su web. Esta disponible? Quiero ${quantity}.`
    }
    
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
  }

  return (
    <Button
      asChild
      size={size}
      variant={variant}
      className={cn(
        'bg-[#25D366] hover:bg-[#128C7E] text-white transition-all duration-300',
        isHovered && 'scale-105 shadow-lg',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a 
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        {children || 'Pedir por WhatsApp'}
      </a>
    </Button>
  )
}

export interface WhatsAppQuickActionsProps {
  phone: string
  productName?: string
  price?: string
  className?: string
}

export function WhatsAppQuickActions({
  phone,
  productName,
  price,
  className
}: WhatsAppQuickActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const buildActionUrl = (template: WhatsAppTemplate): string => {
    const cleaned = cleanPhone(phone)
    const ctx = template.context
    
    let message = 'Hola! Vi su pagina web y me interesa hacer un pedido.'
    
    if (ctx === 'product' && productName && price) {
      message = message
        .replace('{{productName}}', productName)
        .replace('{{price}}', price)
        .replace('{{quantity}}', '1')
    }
    if (ctx === 'subscription') {
      message = message.replace('{{weeklyVolume}}', '500')
    }
    if (ctx === 'delivery') {
      message = message
        .replace('{{address}}', '[mi direccion]')
        .replace('{{productList}}', productName || '[productos]')
    }
    if (ctx === 'chicken') {
      message = message.replace('{{familySize}}', '[numero]')
    }
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-3">
          Opciones rapidas de contacto:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {WHATSAPP_TEMPLATES.map((template) => (
            <a
              key={template.id}
              href={buildActionUrl(template)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg text-sm transition-all duration-200',
                'hover:bg-surface border border-transparent',
                selectedAction === template.id && 'border-primary bg-surface',
                'text-foreground hover:text-primary'
              )}
              onClick={() => setSelectedAction(template.id)}
            >
              <span className="text-primary">{template.icon}</span>
              <span className="font-medium">{template.label}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export interface FloatingWhatsAppProps {
  phone: string
  message?: string
}

export function FloatingWhatsApp({ 
  phone, 
  message = 'Hola! Vi su pagina web y me interesa hacer un pedido.' 
}: FloatingWhatsAppProps) {
  const cleaned = cleanPhone(phone)
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-16 bg-white text-foreground px-3 py-1.5 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Escribinos
      </span>
    </a>
  )
}

export default SmartWhatsAppButton

'use client'

import { useState } from 'react'
import { Search, MessageCircle, ChevronDown, ChevronUp, HelpCircle, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SmartWhatsAppButton } from './smart-whatsapp-section'
import { Heading } from '@/components/ui/heading'

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  isPopular?: boolean
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: '¿De dónde vienen sus huevos?',
    answer: 'Todos nuestros huevos provienen de nuestra granja ubicada en Ruta 2, Km 125-140, Coronel Oviedo. Las gallinas son criadas localmente con alimentación balanceada (maíz de cultivo local + suplemento vitamínico) y acceso a pasto verde. Recolectamos los huevos diariamente para garantizar máxima frescura.',
    category: 'Producto',
    isPopular: true
  },
  {
    id: '2',
    question: '¿Hacen delivery? ¿A qué zonas?',
    answer: 'Sí, realizamos delivery en Coronel Oviedo y zonas cercanas de Ruta 2 (Km 120-150). Los costos son: Centro de Coronel Oviedo: 5.000 Gs (gratis en compras mayores a 50.000 Gs), Ruta 2 Km 120-140: 8.000 Gs (gratis >70.000 Gs), Ruta 2 Km 140-150: 12.000 Gs (gratis >100.000 Gs). También pueden retirar directamente en nuestra granja sin costo.',
    category: 'Delivery',
    isPopular: true
  },
  {
    id: '3',
    question: '¿Tienen precios especiales para negocios?',
    answer: 'Sí, ofrecemos precios mayoristas para restaurantes, hoteles, panaderías y supermercados. Los descuentos aplican desde 100 unidades. Por ejemplo: Huevos pasan de 800 Gs a 600 Gs por unidad, Maples de 30 de 22.000 Gs a 18.000 Gs. Para más detalles, contactanos por WhatsApp y te enviamos nuestra lista de precios mayoristas.',
    category: 'Precios',
    isPopular: true
  },
  {
    id: '4',
    question: '¿Cómo puedo hacer un pedido?',
    answer: 'Podés hacer tu pedido de varias formas: 1) WhatsApp (más rápido): Escribinos al número de contacto con tu pedido y dirección, 2) Llamada telefónica: Durante horario de atención, 3) Visita a la granja: Vení a retirar directamente. Respondemos los mensajes de WhatsApp generalmente en minutos durante horario comercial.',
    category: 'Pedidos',
    isPopular: true
  },
  {
    id: '5',
    question: '¿Cuánto duran los huevos?',
    answer: 'Nuestros huevos son recolectados diariamente. Si se mantienen refrigerados, duran hasta 4-5 semanas. En temperatura ambiente, se recomienda consumirlos dentro de 2-3 semanas. Para verificar la frescura, podés hacer el "test del agua": sumergir el huevo en agua fría. Si se hunde y queda horizontal, está fresco. Si flota, ya no es fresco.',
    category: 'Producto'
  },
  {
    id: '6',
    question: '¿Venden pollos vivos o procesados?',
    answer: 'Vendemos pollos limpios y listos para cocinar, NO pollos vivos. Ofrecemos: Pollo entero (aprox. 2-2.5kg) a 35.000 Gs, Pollito tierno (aprox. 1-1.2kg) a 22.000 Gs. Los pedidos deben hacerse con 24 horas de anticipación para prepararlos frescos. Tenemos calendario de disponibilidad en nuestra web.',
    category: 'Producto'
  },
  {
    id: '7',
    question: '¿Tienen programa de suscripción?',
    answer: 'Sí, ofrecemos pedidos recurrentes semanales o quincenales. Ideal para familias y negocios que consumen huevos regularmente. Beneficios: Precio fijo garantizado, delivery prioritario, 5% de descuento adicional, nunca te quedás sin huevos. Para suscribirte, escribinos por WhatsApp indicando productos, frecuencia y dirección de entrega.',
    category: 'Servicios'
  },
  {
    id: '8',
    question: '¿Cómo se diferencian de los huevos de supermercado?',
    answer: 'Nuestros huevos son: 1) Frescos: recolectados el mismo día o anterior, no tienen semanas en transporte/supermercado, 2) Más nutritivos: yema naranja indica más betacarotenos, 3) Producción local: apoyás la economía de Coronel Oviedo, 4) Sin químicos: no usamos antibióticos ni hormonas, 5) Atención personalizada: conocés directamente a quien produce tu comida.',
    category: 'Producto'
  },
  {
    id: '9',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos: Efectivo (al retirar o contra entrega), Transferencia bancaria (te enviamos datos por WhatsApp), Giros (Western Union, etc.). Para pedidos grandes o suscripciones, podemos coordinar facturación mensual para negocios. No aceptamos tarjetas de crédito/débito en este momento.',
    category: 'Pagos'
  },
  {
    id: '10',
    question: '¿Tienen fertilizante orgánico?',
    answer: 'Sí, producimos gallinaza compostada, excelente fertilizante natural para huertas y jardines. Disponible en bolsas de 10kg a 15.000 Gs (12.000 Gs si comprás 5+ bolsas). Es rica en nitrógeno, fósforo y potasio. Ideal para: Huertas caseras, Jardines, Cultivos orgánicos, Compostaje.',
    category: 'Producto'
  },
  {
    id: '11',
    question: '¿Puedo visitar la granja?',
    answer: '¡Sí, bienvenidos! Podés visitarnos en Ruta 2, Km 125-140, Coronel Oviedo. Horario de atención: Lunes a Sábado de 7:00 a 18:00. Es recomendable avisar antes por WhatsApp para asegurar que estemos disponibles. Podés: Retirar productos, Conocer las instalaciones, Hacer pedidos personales.',
    category: 'General'
  },
  {
    id: '12',
    question: '¿Tienen garantía de satisfacción?',
    answer: 'Sí, garantizamos la frescura y calidad de nuestros productos. Si no estás satisfecho con tu compra, contactanos dentro de las 24 horas y te reponemos el producto o te reembolsamos. Nos enorgullecemos de la calidad, pero entendemos que pueden haber inconvenientes. Tu satisfacción es nuestra prioridad.',
    category: 'General'
  }
]

const CATEGORIES = ['Todas', 'Producto', 'Delivery', 'Precios', 'Pedidos', 'Servicios', 'Pagos', 'General']

export interface FAQChatbotProps {
  phone: string
  className?: string
}

export function FAQChatbot({ phone, className }: FAQChatbotProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [openItems, setOpenItems] = useState<string[]>(['1', '2', '3', '4']) // Popular ones open by default
  const [showContactForm, setShowContactForm] = useState(false)

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Todas' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularFAQs = FAQ_DATA.filter(faq => faq.isPopular)

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <section className={cn('py-16 bg-[var(--surface)]', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-[var(--primary)]">
            <HelpCircle className="w-4 h-4 mr-1" />
            Preguntas Frecuentes
          </Badge>
          <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
            ¿Tenés dudas? Tenemos respuestas
          </Heading>
          <p className="text-lg text-[var(--text-muted)]">
            Buscá en nuestras preguntas frecuentes o escribinos por WhatsApp
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <Input
            type="text"
            placeholder="¿Qué querés saber? Ej: delivery, precios, pedidos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-white text-[var(--text)] hover:bg-[var(--surface)]'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Popular Questions (when no search) */}
        {!searchQuery && selectedCategory === 'Todas' && (
          <div className="mb-8">
            <Heading level={3} className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">
              Preguntas más populares
            </Heading>
            <div className="grid md:grid-cols-2 gap-3">
              {popularFAQs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => {
                    setOpenItems([faq.id])
                    document.getElementById(`faq-${faq.id}`)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-left p-4 bg-white rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-sm transition-all"
                >
                  <p className="font-medium text-[var(--text)] text-sm">{faq.question}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">{faq.category}</Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-10">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[var(--text-muted)] mb-4">No encontramos preguntas con "{searchQuery}"</p>
              <Button onClick={() => setShowContactForm(true)} variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Preguntar por WhatsApp
              </Button>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <Card
                key={faq.id}
                id={`faq-${faq.id}`}
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openItems.includes(faq.id) ? 'border-[var(--primary)]' : 'border-[var(--border)]'
                )}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--surface)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[var(--primary)] font-bold">{faq.id}.</span>
                    <div>
                      <p className="font-semibold text-[var(--text)]">{faq.question}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </div>
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </button>
                
                {openItems.includes(faq.id) && (
                  <CardContent className="pt-0 pb-5 px-5 pl-12">
                    <p className="text-[var(--text)] leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Still have questions? */}
        <Card className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
          <CardContent className="p-8 text-center">
            <Heading level={3} className="text-2xl font-bold mb-3">¿No encontraste tu respuesta?</Heading>
            <p className="mb-6 opacity-90">
              Estamos aquí para ayudarte. Escribinos por WhatsApp y respondemos en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SmartWhatsAppButton
                phone={phone}
                context="general"
                size="lg"
                className="bg-white text-[var(--primary)] hover:bg-gray-100"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Preguntar por WhatsApp
              </SmartWhatsAppButton>
              <a href={`tel:${phone}`}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  Llamar
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default FAQChatbot

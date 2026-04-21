'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, MessageCircle, Phone, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'

interface FAQSectionProps {
  business: {
    name: string
    whatsapp: string
    phone?: string
  }
}

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQS: FAQItem[] = [
  // Producto & Calidad
  {
    question: '¿De dónde vienen sus huevos?',
    answer: 'Todos nuestros huevos provienen de nuestra granja ubicada en Coronel Oviedo, Ruta 2 Km 125-140. Las gallinas son criadas localmente con alimentación balanceada y cuidado diario. Recolectamos los huevos todos los días para garantizar máxima frescura.',
    category: 'Producto'
  },
  {
    question: '¿Por qué las yemas de sus huevos son más oscuras?',
    answer: 'El color intenso de las yemas es resultado de la alimentación natural y balanceada de nuestras gallinas. Consumen maíz, soja y otros granos que enriquecen el color natural de la yema. Esto también indica mayor contenido de nutrientes como carotenoides.',
    category: 'Producto'
  },
  {
    question: '¿Cuál es la diferencia entre huevos de granja y de supermercado?',
    answer: 'Nuestros huevos son recolectados diariamente y nunca pasan por cadenas de distribución largas. Tienen yemas más coloridas, claras más firmes y mejor sabor. Además, al comprar directo de la granja, apoyás la economía local y tenés la garantía de frescura.',
    category: 'Producto'
  },
  {
    question: '¿Usan antibióticos o hormonas?',
    answer: 'No. Nuestras gallinas crecen de manera natural sin el uso de antibióticos de crecimiento ni hormonas. Si una gallina requiere tratamiento médico, se retira de la producción durante el tiempo necesario. Priorizamos el bienestar animal y la calidad natural.',
    category: 'Producto'
  },
  {
    question: '¿Qué comen sus gallinas?',
    answer: 'Nuestras gallinas reciben una dieta balanceada compuesta principalmente de maíz, soja triturada, minerales esenciales y agua limpia. Esta alimentación les proporciona los nutrientes necesarios para producir huevos de alta calidad.',
    category: 'Producto'
  },
  {
    question: '¿Cómo puedo verificar la frescura de un huevo?',
    answer: 'Una prueba simple es sumergir el huevo en agua: los huevos frescos se hunden y quedan horizontales, mientras que los más viejos flotan o se ponen verticales. También podés revisar la yema al abrirlo: debe ser firme y mantener su forma, y la clara debe ser espesa, no aguada.',
    category: 'Producto'
  },

  // Pedidos & Entrega
  {
    question: '¿Hacen delivery? ¿A qué zonas?',
    answer: 'Sí, realizamos delivery en Coronel Oviedo centro y zonas cercanas de Ruta 2 (Km 120-150). Los costos varían según la distancia: Centro 5.000 Gs, Ruta 2 cercana 8.000 Gs, Ruta 2 lejana 12.000 Gs. Consultanos por WhatsApp para confirmar tu zona específica.',
    category: 'Pedidos'
  },
  {
    question: '¿Cuál es el mínimo de compra para delivery?',
    answer: 'El mínimo de compra depende de la zona: Centro 15.000 Gs, Ruta 2 cercana 20.000 Gs, Ruta 2 lejana 30.000 Gs. Ofrecemos envío gratis en compras mayores a 50.000 Gs (centro), 70.000 Gs (Ruta 2 cercana) o 100.000 Gs (Ruta 2 lejana).',
    category: 'Pedidos'
  },
  {
    question: '¿A qué horas realizan las entregas?',
    answer: 'Realizamos entregas de lunes a sábado, generalmente en dos franjas: mañana (8:00 - 12:00) y tarde (14:00 - 18:00). El horario específico depende de tu zona y la demanda del día. Podés solicitar una franja horaria preferida y haremos lo posible por cumplirla.',
    category: 'Pedidos'
  },
  {
    question: '¿Puedo programar entregas recurrentes?',
    answer: '¡Absolutamente! Ofrecemos suscripciones semanales con 5% de descuento. Elegís la cantidad de huevos y la frecuencia, y nosotros te los llevamos automáticamente. Podés pausar, modificar o cancelar en cualquier momento con 48 horas de anticipación.',
    category: 'Pedidos'
  },
  {
    question: '¿Qué pasa si no estoy cuando llegue el delivery?',
    answer: 'Te contactamos por WhatsApp o llamada 15 minutos antes de llegar. Si no estás, podemos dejar el pedido con un vecino de confianza (si nos autorizás), reprogramar la entrega para el mismo día si es posible, o coordinar retiro en la granja.',
    category: 'Pedidos'
  },
  {
    question: '¿Cómo puedo hacer un pedido?',
    answer: 'La forma más rápida es por WhatsApp. Escribinos con tu nombre, dirección, productos y cantidades deseadas. Respondemos en minutos y coordinamos la entrega. También podés llamarnos directamente o pasar a retirar por la granja.',
    category: 'Pedidos'
  },

  // Conservación
  {
    question: '¿Cuánto duran los huevos frescos?',
    answer: 'Nuestros huevos son recolectados diariamente. Si se mantienen refrigerados a 4°C, duran hasta 4-5 semanas en perfectas condiciones. En temperatura ambiente (menos de 25°C), se recomienda consumirlos dentro de 2-3 semanas.',
    category: 'Conservación'
  },
  {
    question: '¿Debo guardar los huevos en la heladera?',
    answer: 'Sí, para máxima frescura y duración, guardá los huevos en la heladera. La temperatura ideal es entre 2°C y 4°C. Guardalos en su caja original con la punta más gruesa hacia arriba (esto mantiene la yema centrada).',
    category: 'Conservación'
  },
  {
    question: '¿Es seguro consumir huevos crudos?',
    answer: 'Si bien nuestros huevos son frescos y de alta calidad, consumir huevos crudos siempre conlleva un riesgo mínimo de salmonella. Para recetas que requieren huevo crudo (como mayonesa o tiramisú), usá huevos muy frescos y mantené todo bien refrigerado.',
    category: 'Conservación'
  },
  {
    question: '¿Cómo debo lavar los huevos antes de usar?',
    answer: 'Si el huevo está sucio, lavalo justo antes de usar con agua tibia y jabón suave, secándolo inmediatamente. No laves los huevos antes de guardarlos, ya que esto remueve la capa protectora natural (cutícula) y reduce su vida útil.',
    category: 'Conservación'
  },
  {
    question: '¿Puedo congelar huevos?',
    answer: 'No es recomendable congelar huevos enteros con cáscara, ya que el líquido se expande y puede romperla. Sin embargo, podés batir los huevos y congelar el líquido en bolsas o moldes de hielo. Duran hasta 6 meses congelados.',
    category: 'Conservación'
  },

  // Mayoristas
  {
    question: '¿Tienen precios especiales para negocios?',
    answer: 'Sí, ofrecemos descuentos mayoristas: Bronce (100-300 huevos/semana) 10% OFF, Plata (300-600 huevos/semana) 15% OFF, Oro (600+ huevos/semana) 20% OFF. Además incluimos delivery programado, facturación y atención prioritaria.',
    category: 'Mayoristas'
  },
  {
    question: '¿Cuál es el proceso para convertirme en cliente mayorista?',
    answer: 'Escribinos por WhatsApp con la palabra "MAYORISTA". Te pedimos información básica de tu negocio (tipo, consumo estimado, ubicación). Te enviamos una cotización personalizada. Hacés un pedido de prueba sin compromiso. Si te gusta, establecemos un plan regular.',
    category: 'Mayoristas'
  },
  {
    question: '¿Emiten factura para empresas?',
    answer: 'Sí, emitimos factura con todos los datos de tu empresa. Podemos hacer facturación mensual consolidada (enviamos una factura al mes por todas las entregas) o por cada entrega, según prefieras. Aceptamos transferencia bancaria, giros y efectivo.',
    category: 'Mayoristas'
  },
  {
    question: '¿Hay contrato mínimo de tiempo?',
    answer: 'No hay contratos forzosos. Podés empezar con un pedido de prueba y luego establecer un suministro regular si te gusta la calidad. Para clientes Oro y Platinum que desean bloquear precios por 3-6 meses, sí solicitamos un compromiso mínimo de volumen.',
    category: 'Mayoristas'
  },
  {
    question: '¿Qué pasa si necesito un pedido urgente?',
    answer: 'Entendemos las emergencias. Con gusto coordinamos entregas adicionales cuando sea posible. Los clientes Plata, Oro y Platinum tienen prioridad para entregas urgentes. Escribinos con la palabra "URGENTE" y haremos lo posible por ayudarte.',
    category: 'Mayoristas'
  },

  // Sostenibilidad
  {
    question: '¿Cómo manejan el desperdicio de la granja?',
    answer: 'Implementamos un sistema de compostaje donde transformamos la gallinaza y residuos orgánicos en abono de alta calidad. Este compost lo vendemos a jardineros y agricultores locales, cerrando el ciclo de sustentabilidad.',
    category: 'Sostenibilidad'
  },
  {
    question: '¿Tienen certificación orgánica?',
    answer: 'Actualmente estamos en proceso de certificación SENACSA y evaluando la certificación orgánica a futuro. Aunque no somos 100% orgánicos certificados, trabajamos bajo estándares de calidad, usamos prácticas sostenibles y priorizamos el bienestar animal.',
    category: 'Sostenibilidad'
  },
  {
    question: '¿Es ética la forma en que tratan a las gallinas?',
    answer: 'Absolutamente. Nuestras gallinas viven en galpones espaciosos con ventilación natural, acceso a luz solar y áreas para comportamientos naturales como picotear y descansar. Reciben alimentación balanceada, agua limpia y atención veterinaria regular.',
    category: 'Sostenibilidad'
  },
  {
    question: '¿Puedo visitar la granja?',
    answer: '¡Por supuesto! Te invitamos a conocer nuestras instalaciones. Podés ver cómo trabajamos, conocer a nuestras gallinas y entender por qué nuestros huevos son diferentes. Coordinamos visitas de lunes a sábado previa cita por WhatsApp.',
    category: 'Sostenibilidad'
  },
  {
    question: '¿Tienen planes de expansión?',
    answer: 'Sí, tenemos un plan de crecimiento a 4 fases que incluye aumentar nuestra capacidad de 500 a 3,000 gallinas, agregar productos de valor agregado (huevo líquido, pasta, etc.), expandir zonas de delivery y eventualmente certificarnos para exportación.',
    category: 'Sostenibilidad'
  },

  // General
  {
    question: '¿Venden pollos vivos o procesados?',
    answer: 'Vendemos pollos limpios y listos para cocinar (procesados), no vivos. Los pollos enteros y pollitos tiernos requieren pedido con 24 horas de anticipación para garantizar frescura. También ofrecemos pollo en piezas (pechugas, piernas, alitas) por pedido.',
    category: 'General'
  },
  {
    question: '¿Aceptan tarjeta de crédito o débito?',
    answer: 'Actualmente aceptamos efectivo, transferencia bancaria y giros. Estamos trabajando en integrar MercadoPago para aceptar tarjetas y pagos digitales próximamente. Para pedidos grandes o regulares, podemos coordinar otros métodos de pago.',
    category: 'General'
  },
  {
    question: '¿Tienen programa de referidos?',
    answer: '¡Sí! Nuestro programa "Recomienda y Ganá" te permite ganar recompensas. Tu amigo obtiene 10% de descuento en su primera compra usando tu código. Vos te llevás un maple de 30 huevos GRATIS por cada referido que hace su primera compra.',
    category: 'General'
  }
]

const CATEGORIES = ['Todas', 'Producto', 'Pedidos', 'Conservación', 'Mayoristas', 'Sostenibilidad', 'General']

export function EnhancedFAQSection({ business }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'Todas' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const whatsappUrl = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Tengo una pregunta que no encontré en las FAQs...')}`

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Heading level={2} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </Heading>
          <p className="text-lg text-gray-600">
            Encontrá respuestas a las dudas más comunes sobre nuestros productos y servicios.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar preguntas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm ${selectedCategory === category ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <Card 
              key={index} 
              className={`border-gray-200 transition-all ${openIndex === index ? 'ring-2 ring-orange-200' : ''}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left"
              >
                <CardHeader className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-semibold text-gray-900">
                        {faq.question}
                      </CardTitle>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
              
              {openIndex === index && (
                <CardContent className="pt-0 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No encontramos preguntas con esos criterios.</p>
            <Button 
              variant="outline" 
              onClick={() => {setSearchQuery(''); setSelectedCategory('Todas')}}
            >
              Ver todas las preguntas
            </Button>
          </div>
        )}

        {/* Still Have Questions */}
        <Card className="mt-10 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Heading level={3} className="text-xl font-bold text-gray-900 mb-3">
                ¿No encontraste lo que buscabas?
              </Heading>
              <p className="text-gray-600 mb-6">
                Estamos para ayudarte. Escribinos por WhatsApp y te respondemos en minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Preguntar por WhatsApp
                  </Button>
                </Link>
                <Link href={`tel:${business.phone || business.whatsapp}`}>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

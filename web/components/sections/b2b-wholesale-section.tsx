'use client'

import { Phone, MessageCircle, Building2, Users, ChefHat, Store, Coffee, School, CheckCircle, Truck, Award, Clock, MapPin, Package, Calculator } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'

interface BusinessData {
  name: string
  whatsapp: string
  phone?: string
  email?: string
  address: string
  city: string
}

interface B2BPageProps {
  business: BusinessData
}

const industries = [
  {
    icon: ChefHat,
    title: 'Restaurantes',
    description: 'Huevos perfectos para desayunos y brunch. Consistencia en cada plato y presentación premium con yemas doradas.',
    testimonial: '"La calidad de los huevos se nota en cada plato. Nuestros clientes elogian los desayunos."',
    author: 'Chef Roberto Martínez, Restaurante La Tradición',
  },
  {
    icon: Store,
    title: 'Panaderías',
    description: 'Mejor estructura en masas, color dorado natural en bizcochos. Consistencia batch a batch.',
    testimonial: '"Mis facturas y bizcochos quedan más esponjosos. El color dorado de las yemas es incomparable."',
    author: 'Don José Giménez, Panadería San José',
  },
  {
    icon: Building2,
    title: 'Hoteles',
    description: 'Servicio de buffet consistente. Opciones de empaque según necesidad y facturación disponible.',
    testimonial: '"Nuestros huéspedes notan la diferencia en el desayuno. Calidad premium a precio justo."',
    author: 'María Elena Fernández, Hotel del Centro',
  },
  {
    icon: Package,
    title: 'Supermercados',
    description: 'Producto local con historia. Etiquetado personalizado disponible y suministro constante.',
    testimonial: '"Vendemos \"producto local\" y Granja Cabral tiene buena reputación entre nuestros clientes."',
    author: 'Carlos Medina, Supermercado El Pueblo',
  },
  {
    icon: Coffee,
    title: 'Cafeterías',
    description: 'Ideales para sandwiches y wraps. Entregas de 2-3 veces por semana. Calidad para platos fotografiados.',
    testimonial: '"Nuestros bowls de desayuno se ven hermosos en Instagram gracias a las yemas doradas."',
    author: 'Lucía Benítez, Café Ruta 2',
  },
  {
    icon: School,
    title: 'Instituciones',
    description: 'Escuelas, colegios, hospitales y comedores industriales. Precios especiales por volumen.',
    testimonial: '"Llevamos 6 meses comprando para el comedor escolar. Siempre puntuales y buena calidad."',
    author: 'Directora, Colegio San Roque',
  },
]

const pricingTiers = [
  {
    name: 'Bronce',
    volume: '100-300 huevos/semana',
    discount: '10% OFF',
    benefits: ['Delivery semanal incluido', 'Atención por WhatsApp', 'Sin contratos forzosos', 'Calidad garantizada'],
    recommended: false,
  },
  {
    name: 'Plata',
    volume: '300-600 huevos/semana',
    discount: '15% OFF',
    benefits: ['Delivery 2x semana', 'Prioridad en pedidos urgentes', 'Facturación mensual', 'Atención personalizada'],
    recommended: true,
  },
  {
    name: 'Oro',
    volume: '600+ huevos/semana',
    discount: '20% OFF',
    benefits: ['Delivery flexible según necesidad', 'Gerente de cuenta dedicado', 'Facturación personalizada', 'Precio bloqueado 3 meses'],
    recommended: false,
  },
  {
    name: 'Platinum',
    volume: '1000+ huevos/semana',
    discount: 'Personalizado',
    benefits: ['Todas las ventajas Oro', 'Contrato anual con beneficios', 'Visita mensual de seguimiento', 'Soporte prioritario 24/7'],
    recommended: false,
  },
]

const faqs = [
  {
    question: '¿Cuál es el mínimo de compra para obtener precios mayoristas?',
    answer: 'El descuento mayorista aplica desde 100 huevos por semana. Sin embargo, podemos cotizar cualquier volumen. Consultanos sin compromiso.',
  },
  {
    question: '¿Emiten factura para mi negocio?',
    answer: 'Sí, emitimos factura con todos los datos de tu empresa. Podemos hacer facturación mensual consolidada o por cada entrega, según prefieras.',
  },
  {
    question: '¿Puedo establecer entregas regulares sin pedir cada vez?',
    answer: 'Absolutamente. De hecho, lo recomendamos. Establecemos un día y hora fijos de entrega semanal. Podés modificar cantidades con 24-48 horas de anticipación.',
  },
  {
    question: '¿Qué pasa si necesito un pedido urgente fuera de lo programado?',
    answer: 'Entendemos las emergencias. Con gusto coordinamos entregas adicionales cuando sea posible. Los clientes Oro y Platinum tienen prioridad para entregas urgentes.',
  },
  {
    question: '¿Puedo visitar la granja antes de comprometerme?',
    answer: '¡Por supuesto! Te invitamos a conocer nuestras instalaciones. Verás cómo trabajamos y la calidad de nuestras gallinas. Coordinamos visitas de lunes a sábado previa cita.',
  },
]

export function B2BWholesaleSection({ business }: B2BPageProps) {
  const whatsappNumber = business.whatsapp?.replace(/\D/g, '') || ''
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola! Vi su página web de venta mayorista y me interesa conocer precios para mi negocio.\n\nTipo de negocio: [RESTAURANTE/PANADERÍA/HOTEL/etc]\nConsumo estimado: [CANTIDAD] huevos por semana\nZona: [CORONEL OVIEDO/RUTA 2/etc]\n\nGracias!'
  )}`

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Soluciones para Negocios
          </div>
          <Heading level={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Huevos Frescos de Calidad
            <span className="block text-orange-600">para tu Restaurante, Panadería o Hotel</span>
          </Heading>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Proveedor confiable de huevos frescos en Coronel Oviedo y zona. 
            Más de 300 negocios confían en nosotros.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: CheckCircle, text: 'Producción Local' },
              { icon: Truck, text: 'Entrega Programada' },
              { icon: Award, text: 'Calidad Consistente' },
              { icon: Clock, text: 'Facturación Disponible' },
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <badge.icon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">{badge.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Precios por WhatsApp
              </Button>
            </Link>
            <Link href={`tel:${business.phone || business.whatsapp}`}>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Negocios Nos Eligen?</Heading>
            <p className="text-lg text-gray-600">Ventajas que marcan la diferencia</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Package, title: 'Frescura Garantizada', desc: 'Recolección diaria y entrega el mismo día. Máxima frescura para tus clientes.' },
              { icon: Award, title: 'Calidad Superior', desc: 'Yemas doradas intensamente coloreadas. Perfectas para presentación.' },
              { icon: Truck, title: 'Entrega Confiable', desc: 'Rutas de entrega semanales establecidas. Nunca te quedes sin stock.' },
              { icon: Calculator, title: 'Precios Competitivos', desc: 'Descuentos por volumen desde 100 unidades. Más comprás, más ahorrás.' },
              { icon: Users, title: 'Atención Personalizada', desc: 'Hablás directamente con Laura, la dueña. Entiende tu negocio.' },
              { icon: Clock, title: 'Flexibilidad Total', desc: 'Cantidades específicas y entregas urgentes. Nos adaptamos a vos.' },
            ].map((item, index) => (
              <Card key={index} className="border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <item.icon className="w-10 h-10 text-orange-600 mb-4" />
                  <Heading level={3} className="text-lg font-semibold text-gray-900 mb-2">{item.title}</Heading>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Atendemos Diversos Negocios</Heading>
            <p className="text-lg text-gray-600">Soluciones adaptadas a tu industria</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="border-gray-200 hover:border-orange-300 transition-colors">
                <CardHeader className="pb-4">
                  <industry.icon className="w-12 h-12 text-orange-600 mb-3" />
                  <CardTitle className="text-xl">{industry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">{industry.description}</p>
                  <blockquote className="border-l-4 border-orange-400 pl-4 italic text-gray-700 text-sm bg-orange-50 p-3 rounded-r">
                    {industry.testimonial}
                    <footer className="text-xs text-gray-500 mt-2 not-italic">— {industry.author}</footer>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Descuentos por Volumen</Heading>
            <p className="text-lg text-gray-600">Planes diseñados para diferentes necesidades</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative border-2 ${tier.recommended ? 'border-orange-500 shadow-lg' : 'border-gray-200'}`}>
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MÁS POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">{tier.name}</CardTitle>
                  <p className="text-sm text-gray-500">{tier.volume}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-4">{tier.discount}</div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-blue-800">
              💡 Los precios se cotizan individualmente según frecuencia de entrega, volumen exacto, zona y términos de pago. 
              <Link href={whatsappUrl} className="font-semibold underline" target="_blank">Contactanos</Link> para una cotización personalizada.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Proceso Simple en 4 Pasos</Heading>
            <p className="text-lg text-gray-600">Empezar es fácil y rápido</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Consulta', desc: 'Nos escribís por WhatsApp. Nos contás sobre tu negocio: tipo, consumo estimado, zona y horarios.' },
              { step: '2', title: 'Cotización', desc: 'Te enviamos precios especiales según tu volumen. Sin compromiso. Sin contratos forzosos.' },
              { step: '3', title: 'Prueba', desc: 'Hacé tu primer pedido pequeño. Probá la frescura y calidad. Sin riesgo. Sin mínimos forzados.' },
              { step: '4', title: 'Suministro Regular', desc: 'Establecemos día y hora fijos de entrega. Cantidad semanal definida. Contacto directo.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <Heading level={3} className="text-lg font-semibold text-gray-900 mb-2">{item.title}</Heading>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Nuestras Promesas</Heading>
            <p className="text-lg text-gray-600">Garantías que nos comprometen</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Garantía de Frescura', desc: 'Si un huevo llega roto o en mal estado, lo reemplazamos sin costo en tu próxima entrega.' },
              { title: 'Garantía de Puntualidad', desc: 'Si llegamos tarde a una entrega programada, 10% de descuento en esa entrega.' },
              { title: 'Garantía de Calidad', desc: 'Si la calidad no cumple tus expectativas, te devolvemos el dinero. Sin preguntas.' },
              { title: 'Garantía de Consistencia', desc: 'Si notás variación en calidad entre entregas, nos ajustamos o cambiamos lo necesario.' },
            ].map((item, index) => (
              <Card key={index} className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
                  <Heading level={3} className="text-lg font-semibold text-gray-900 mb-2">{item.title}</Heading>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Preguntas Frecuentes para Negocios</Heading>
            <p className="text-lg text-gray-600">Resolvemos tus dudas</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-gray-900">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-800 font-semibold">¿NECESITÁS HUEVOS HOY?</span>
          </div>
          <p className="text-red-700 mb-4">
            Si tenés una emergencia y necesitás huevos para hoy, escribinos por WhatsApp con la palabra <strong>&ldquo;URGENTE&rdquo;</strong> y coordinamos entrega express.
          </p>
          <p className="text-xs text-red-600">
            *Sujeto a disponibilidad y zona de cobertura. Clientes regulares tienen prioridad.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={2} className="text-4xl font-bold mb-6">Empezá Ahora</Heading>
          <p className="text-xl mb-8 opacity-90">
            Unite a los más de 300 negocios que confían en Granja Cabral
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Directo
              </Button>
            </Link>
            <Link href={`tel:${business.phone || business.whatsapp}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Respuesta en menos de 2 horas
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Coronel Oviedo & Ruta 2
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Delivery disponible
            </span>
          </div>
        </div>
      </section>

      {/* Contact Info Footer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">WhatsApp Business</Heading>
              <p className="text-sm text-gray-400">Atención más rápida</p>
              <p className="text-sm text-gray-400">Palabra clave: &ldquo;MAYORISTA&rdquo;</p>
              <p className="text-green-400 font-mono mt-1">{business.whatsapp}</p>
            </div>
            <div>
              <Phone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">Teléfono</Heading>
              <p className="text-sm text-gray-400">Lunes a Sábado</p>
              <p className="text-sm text-gray-400">7:00 a 18:00</p>
              <p className="text-blue-400 font-mono mt-1">{business.phone || business.whatsapp}</p>
            </div>
            <div>
              <MapPin className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">Ubicación</Heading>
              <p className="text-sm text-gray-400">{business.address}</p>
              <p className="text-sm text-gray-400">{business.city}</p>
              <p className="text-xs text-gray-500 mt-1">Visitas con cita previa</p>
            </div>
            <div>
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">Horario Comercial</Heading>
              <p className="text-sm text-gray-400">Lunes - Sábado</p>
              <p className="text-sm text-gray-400">7:00 - 18:00</p>
              <p className="text-xs text-gray-500 mt-1">Domingo: Cerrado</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

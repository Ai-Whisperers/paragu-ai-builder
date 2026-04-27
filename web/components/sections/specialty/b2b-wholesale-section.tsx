import { BusinessData, Industry, PricingTier, FaqItem, WhyItem, ProcessStep, Guarantee, B2BPageProps, ICONS, DEFAULT_INDUSTRIES, DEFAULT_PRICING_TIERS, DEFAULT_FAQS, DEFAULT_WHY_CHOOSE_US, DEFAULT_PROCESS_STEPS, DEFAULT_GUARANTEES } from './b2b-wholesale-data'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import Link from 'next/link'
import { CheckCircle, Shield, Truck, Leaf, Award, Users, Package, Clock, HeartHandshake, Phone, MessageCircle, Building2, ChefHat, Store, Coffee, School, MapPin, Calculator, Star, ChevronRight, Check } from 'lucide-react'

export function B2BWholesaleSection({
  business,
  industries = DEFAULT_INDUSTRIES,
  pricingTiers = DEFAULT_PRICING_TIERS,
  faqs = DEFAULT_FAQS,
  whyChooseUs = DEFAULT_WHY_CHOOSE_US,
  processSteps = DEFAULT_PROCESS_STEPS,
  guarantees = DEFAULT_GUARANTEES,
  heroTitle = 'Huevos Frescos de Calidad',
  heroTitleAccent = 'para tu Restaurante, Panadería o Hotel',
  heroSubtitle,
  claimLine,
  urgentMessage,
}: B2BPageProps) {
  const whatsappNumber = business.whatsapp?.replace(/\D/g, '') || ''
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola! Vi su página web de venta mayorista y me interesa conocer precios para mi negocio.\n\nTipo de negocio: [RESTAURANTE/PANADERÍA/HOTEL/etc]\nConsumo estimado: [CANTIDAD] huevos por semana\nZona: [CORONEL OVIEDO/RUTA 2/etc]\n\nGracias!'
  )}`

  const resolvedSubtitle = heroSubtitle ?? `Proveedor confiable en ${business.city}. Negocios confían en nosotros.`
  const resolvedClaim = claimLine ?? `Unite a los negocios que confían en ${business.name}`

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Soluciones para Negocios
          </div>
          <Heading level={2} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text)] mb-6 leading-tight">
            {heroTitle}
            <span className="block text-orange-600">{heroTitleAccent}</span>
          </Heading>
          <p className="text-xl text-[var(--text-muted)] mb-8 max-w-3xl mx-auto">
            {resolvedSubtitle}
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
                <badge.icon className="w-4 h-4 text-[var(--success)]" />
                <span className="text-sm font-medium text-[var(--text)]">{badge.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[var(--success)] hover:bg-green-700 text-white px-8 py-6 text-lg">
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
            <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">¿Por Qué Negocios Nos Eligen?</Heading>
            <p className="text-lg text-[var(--text-muted)]">Ventajas que marcan la diferencia</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = (item.icon && ICONS[item.icon]) || Package
              return (
                <Card key={index} className="border-[var(--border)] hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <Icon className="w-10 h-10 text-orange-600 mb-4" />
                    <Heading level={3} className="text-lg font-semibold text-[var(--text)] mb-2">{item.title}</Heading>
                    <p className="text-[var(--text-muted)] text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--surface-light)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">Atendemos Diversos Negocios</Heading>
            <p className="text-lg text-[var(--text-muted)]">Soluciones adaptadas a tu industria</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => {
              const Icon = (industry.icon && ICONS[industry.icon]) || Building2
              return (
                <Card key={index} className="border-[var(--border)] hover:border-orange-300 transition-colors">
                  <CardHeader className="pb-4">
                    <Icon className="w-12 h-12 text-orange-600 mb-3" />
                    <CardTitle className="text-xl">{industry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--text-muted)] mb-4 text-sm">{industry.description}</p>
                    <blockquote className="border-l-4 border-orange-400 pl-4 italic text-[var(--text)] text-sm bg-orange-50 p-3 rounded-r">
                      {industry.testimonial}
                      <footer className="text-xs text-[var(--text-muted)] mt-2 not-italic">— {industry.author}</footer>
                    </blockquote>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">Descuentos por Volumen</Heading>
            <p className="text-lg text-[var(--text-muted)]">Planes diseñados para diferentes necesidades</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative border-2 ${tier.recommended ? 'border-orange-500 shadow-lg' : 'border-[var(--border)]'}`}>
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MÁS POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-[var(--text)]">{tier.name}</CardTitle>
                  <p className="text-sm text-[var(--text-muted)]">{tier.volume}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-4">{tier.discount}</div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                        <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
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
              💡 Los precios se cotizan individualmente según frecuencia de entrega, volumen exacto, zona y términos de pago.{' '}
              <Link href={whatsappUrl} className="font-semibold underline" target="_blank">Contactanos</Link> para una cotización personalizada.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">Proceso Simple en 4 Pasos</Heading>
            <p className="text-lg text-[var(--text-muted)]">Empezar es fácil y rápido</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <Heading level={3} className="text-lg font-semibold text-[var(--text)] mb-2">{item.title}</Heading>
                <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">Nuestras Promesas</Heading>
            <p className="text-lg text-[var(--text-muted)]">Garantías que nos comprometen</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item, index) => (
              <Card key={index} className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-[var(--success)] mb-3" />
                  <Heading level={3} className="text-lg font-semibold text-[var(--text)] mb-2">{item.title}</Heading>
                  <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--surface-light)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">Preguntas Frecuentes para Negocios</Heading>
            <p className="text-lg text-[var(--text-muted)]">Resolvemos tus dudas</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-[var(--border)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-[var(--text)]">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--text-muted)]">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Banner */}
      {urgentMessage && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-red-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-pulse" />
              <span className="text-[var(--primary)] font-semibold">¿NECESITÁS ATENCIÓN HOY?</span>
            </div>
            <p className="text-[var(--primary)] mb-4">{urgentMessage}</p>
            <p className="text-xs text-[var(--primary)]">
              *Sujeto a disponibilidad y zona de cobertura. Clientes regulares tienen prioridad.
            </p>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={2} className="text-4xl font-bold mb-6">Empezá Ahora</Heading>
          <p className="text-xl mb-8 opacity-90">{resolvedClaim}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-[var(--surface-light)] px-8 py-6 text-lg font-semibold">
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
              {business.city}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Delivery disponible
            </span>
          </div>
        </div>
      </section>

      {/* Contact Info Footer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">WhatsApp Business</Heading>
              <p className="text-sm text-[var(--text-muted)]">Atención más rápida</p>
              <p className="text-sm text-[var(--text-muted)]">Palabra clave: &ldquo;MAYORISTA&rdquo;</p>
              <p className="text-green-400 font-mono mt-1">{business.whatsapp}</p>
            </div>
            <div>
              <Phone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">Teléfono</Heading>
              <p className="text-sm text-[var(--text-muted)]">Lunes a Sábado</p>
              <p className="text-sm text-[var(--text-muted)]">7:00 a 18:00</p>
              <p className="text-blue-400 font-mono mt-1">{business.phone || business.whatsapp}</p>
            </div>
            <div>
              <MapPin className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">Ubicación</Heading>
              <p className="text-sm text-[var(--text-muted)]">{business.address}</p>
              <p className="text-sm text-[var(--text-muted)]">{business.city}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Visitas con cita previa</p>
            </div>
            <div>
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <Heading level={3} className="font-semibold mb-1">Horario Comercial</Heading>
              <p className="text-sm text-[var(--text-muted)]">Lunes - Sábado</p>
              <p className="text-sm text-[var(--text-muted)]">7:00 - 18:00</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Domingo: Cerrado</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

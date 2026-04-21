'use client'

import Link from 'next/link'
import { Heart, Leaf, Award, MapPin, Clock, Phone, MessageCircle, CheckCircle, Egg, Bird, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'

interface BusinessData {
  name: string
  tagline: string
  address: string
  city: string
  phone: string
  whatsapp: string
  email?: string
  instagram?: string
  hours: Record<string, string>
  story?: {
    founded: string
    mission: string
    vision: string
    values: string[]
  }
  stats?: Array<{ value: string; label: string }>
  features?: Array<{ title: string; description: string }>
  sustainability?: {
    composting: boolean
    biogas: boolean
    waterRecycling: boolean
    organicFertilizer: boolean
    description?: string
  }
}

interface OurStorySectionProps {
  business: BusinessData
}

const SUSTAINABILITY_ITEMS = [
  { 
    icon: Leaf, 
    title: 'Compostaje', 
    description: 'Transformamos desechos orgánicos en compost premium para huertas y jardines.' 
  },
  { 
    icon: Sprout, 
    title: 'Biogás', 
    description: 'Capturamos biogas de la gallinaza como fuente de energía renovable.' 
  },
  { 
    icon: Heart, 
    title: 'Bienestar Animal', 
    description: 'Gallinas en ambiente natural, espacioso y con alimentación balanceada.' 
  },
  { 
    icon: Award, 
    title: 'Producción Local', 
    description: 'Apoyamos la economía de Coronel Oviedo empleando local y vendiendo local.' 
  },
]

export function OurStorySection({ business }: OurStorySectionProps) {
  const whatsappUrl = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Quiero visitar la granja para conocer sus instalaciones.')}`

  return (
    <div className="w-full">
      {/* Hero Story */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">
                Nuestra Historia
              </Badge>
              <Heading level={1} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                De Familia a{' '}
                <span className="text-orange-600">Comunidad</span>
              </Heading>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Laura Cabral fundó Granja Cabral en {business.story?.founded || '[AÑO]'} con una visión clara: 
                producir alimentos frescos, saludables y accesibles para su comunidad en 
                Coronel Oviedo, Paraguay.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Lo que comenzó con unas pocas gallinas en el patio de su casa, hoy se ha 
                convertido en una granja que alimenta a cientos de familias, restaurantes 
                y negocios de la zona.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Agendar Visita
                  </Button>
                </Link>
                <Link href={`tel:${business.phone}`}>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar Ahora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-5xl">👩‍🌾</span>
                  </div>
                  <p className="text-orange-800 font-medium">Foto: Laura en la granja</p>
                  <p className="text-sm text-orange-600 mt-2">(Reemplazar con foto real)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {business.stats && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {business.stats.map((stat, index) => (
                <Card key={index} className="text-center border-gray-100">
                  <CardContent className="p-6">
                    <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="w-6 h-6 text-orange-600" />
                  Nuestra Misión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {business.story?.mission || 
                   'Producir alimentos frescos, saludables y accesibles para las familias de Coronel Oviedo y zona, manteniendo prácticas sostenibles y apoyando el desarrollo local.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Award className="w-6 h-6 text-green-600" />
                  Nuestra Visión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {business.story?.vision || 
                   'Ser la granja avícola de referencia en Caaguazú, reconocida por calidad, sostenibilidad y compromiso comunitario. Expandir nuestro alcance mientras mantenemos los valores familiares que nos caracterizan.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</Heading>
            <p className="text-lg text-gray-600">Los principios que guían cada decisión</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(business.story?.values || [
              'Calidad: Cada huevo es revisado antes de la venta',
              'Sostenibilidad: Compostaje, biogas y gestión responsable del agua',
              'Bienestar Animal: Gallinas en ambiente natural y saludable',
              'Comunidad: Precios justos y apoyo a la economía local',
              'Transparencia: Puertas abiertas para que conozcas nuestra granja',
            ]).map((value, index) => {
              const [title, description] = value.split(': ')
              return (
                <Card key={index} className="border-gray-100">
                  <CardContent className="p-6">
                    <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                    <Heading level={3} className="font-semibold text-gray-900 mb-2">{title}</Heading>
                    <p className="text-sm text-gray-600">{description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Nuestro Proceso</Heading>
            <p className="text-lg text-gray-600">De la granja a tu mesa</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Bird, 
                title: '1. Cuidado Diario', 
                description: 'Nuestras gallinas reciben alimentación balanceada y atención veterinaria regular.' 
              },
              { 
                icon: Egg, 
                title: '2. Recolección', 
                description: 'Cada mañana recolectamos los huevos frescos, revisando uno por uno.' 
              },
              { 
                icon: CheckCircle, 
                title: '3. Selección', 
                description: 'Solo los mejores huevos pasan nuestro control de calidad.' 
              },
              { 
                icon: MapPin, 
                title: '4. Entrega', 
                description: 'Delivery directo a tu puerta o retiro en nuestra granja.' 
              },
            ].map((step, index) => (
              <Card key={index} className="text-center border-gray-100">
                <CardContent className="p-6">
                  <step.icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <Heading level={3} className="font-semibold text-gray-900 mb-2">{step.title}</Heading>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      {business.sustainability && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800">
                Compromiso Ambiental
              </Badge>
              <Heading level={2} className="text-3xl font-bold text-gray-900 mb-4">Sostenibilidad</Heading>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Creemos en producir alimentos de manera responsable con el medio ambiente. 
                Nuestra granja implementa prácticas sostenibles que benefician a todos.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUSTAINABILITY_ITEMS.map((item, index) => (
                <Card key={index} className="border-green-200">
                  <CardContent className="p-6">
                    <item.icon className="w-10 h-10 text-green-600 mb-3" />
                    <Heading level={3} className="font-semibold text-gray-900 mb-2">{item.title}</Heading>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {business.sustainability.description && (
              <div className="mt-8 text-center">
                <p className="text-gray-600 italic">
                  &ldquo;{business.sustainability.description}&rdquo;
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Visit Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Heading level={2} className="text-3xl font-bold text-gray-900 mb-6">Visítanos</Heading>
              <p className="text-lg text-gray-600 mb-6">
                Te invitamos a conocer nuestras instalaciones y ver cómo trabajamos. 
                Podés ver a nuestras gallinas, el proceso de recolección y entender 
                por qué nuestros huevos son diferentes.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Ubicación</p>
                    <p className="text-gray-600">{business.address}</p>
                    <p className="text-gray-600">{business.city}, Paraguay</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Horario de Visitas</p>
                    <p className="text-gray-600">Lunes a Sábado</p>
                    <p className="text-gray-600">9:00 - 11:00 o 15:00 - 17:00</p>
                    <p className="text-sm text-gray-500">(Con cita previa)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Contacto</p>
                    <p className="text-gray-600">{business.whatsapp}</p>
                  </div>
                </div>
              </div>

              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Agendar Visita por WhatsApp
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Mapa de Ubicación</p>
                  <p className="text-sm text-gray-500 mt-2">(Integrar Google Maps)</p>
                  <p className="text-xs text-gray-400 mt-1">Ruta 2, Km 125-140</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={2} className="text-3xl md:text-4xl font-bold mb-4">
            ¿Querés probar la diferencia?
          </Heading>
          <p className="text-xl mb-8 opacity-90">
            Hacé tu primer pedido y descubrí por qué cientos de familias eligen 
            Granja Cabral para sus huevos frescos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8">
                <MessageCircle className="w-5 h-5 mr-2" />
                Hacer Pedido por WhatsApp
              </Button>
            </Link>
            <Link href={`tel:${business.phone}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

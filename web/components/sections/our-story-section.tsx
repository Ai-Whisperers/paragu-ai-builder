'use client'

import Link from 'next/link'
import {
  Heart,
  Leaf,
  Award,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle,
  Egg,
  Bird,
  Sprout,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'

// Icon name → component map. Tenants reference icons by string keyword
// from their content file so we don't have to expose lucide-react names.
const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  leaf: Leaf,
  award: Award,
  'map-pin': MapPin,
  clock: Clock,
  phone: Phone,
  message: MessageCircle,
  check: CheckCircle,
  egg: Egg,
  bird: Bird,
  sprout: Sprout,
}

function resolveIcon(name?: string, fallback: LucideIcon = CheckCircle): LucideIcon {
  if (!name) return fallback
  return ICONS[name.toLowerCase()] ?? fallback
}

interface BusinessData {
  name: string
  tagline?: string
  address?: string
  city?: string
  phone?: string
  whatsapp: string
  email?: string
  instagram?: string
  hours?: Record<string, string>
  story?: {
    founded?: string
    mission?: string
    vision?: string
    values?: string[]
  }
  stats?: Array<{ value: string; label: string }>
  features?: Array<{ title: string; description: string }>
  sustainability?: {
    composting?: boolean
    biogas?: boolean
    waterRecycling?: boolean
    organicFertilizer?: boolean
    description?: string
    /** Optional full override of the 4 displayed items. */
    items?: Array<{ icon?: string; title: string; description: string }>
  }
}

/**
 * Optional tenant-supplied copy overrides. Everything defaults to the
 * granja-cabral originals so the granja rendering is unchanged when no
 * overrides are passed. Tenants supply any subset of these keys to
 * customize the section to their brand/voice without asking the
 * platform team to fork the component.
 */
export interface OurStoryOverrides {
  /** Hero: badge label (default "Nuestra Historia"). */
  heroBadge?: string
  /** Hero headline. Supports a highlighted span by splitting on `|` —
   * everything after the first `|` becomes the colored accent. */
  heroHeadline?: string
  /** Hero intro paragraphs — one array entry per paragraph. */
  heroIntro?: string[]
  /** Custom WhatsApp prefilled message. Defaults to "Hola! Quiero
   * visitar la granja..." — change it for tenants that aren't a farm. */
  whatsappMessage?: string
  /** Hero illustration text (shown over a placeholder gradient). Tenants
   * can leave this alone until real photography is delivered. */
  heroImageEmoji?: string
  heroImageCaption?: string
  heroImageSubcaption?: string

  /** Mission/Vision block. Set `enabled: false` to hide entirely. */
  missionVision?: {
    enabled?: boolean
    missionTitle?: string
    visionTitle?: string
  }
  /** Values grid. Set `enabled: false` to hide. */
  values?: {
    enabled?: boolean
    title?: string
    subtitle?: string
  }
  /** "Nuestro Proceso" 4-step grid. Set `enabled: false` to hide
   * (e.g. a retail tenant with no production process). */
  process?: {
    enabled?: boolean
    title?: string
    subtitle?: string
    steps?: Array<{ icon?: string; title: string; description: string }>
  }
  /** Visit-us section. Disable for tenants without a physical location. */
  visit?: {
    enabled?: boolean
    title?: string
    description?: string
    hoursLabel?: string
    hoursLines?: string[]
    hoursNote?: string
  }
  /** Final CTA band. Disable or override copy per brand. */
  cta?: {
    enabled?: boolean
    title?: string
    subtitle?: string
    primaryLabel?: string
    secondaryLabel?: string
  }
}

interface OurStorySectionProps {
  business: BusinessData
  overrides?: OurStoryOverrides
}

const DEFAULT_SUSTAINABILITY_ITEMS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Leaf,
    title: 'Compostaje',
    description: 'Transformamos desechos orgánicos en compost premium para huertas y jardines.',
  },
  {
    icon: Sprout,
    title: 'Biogás',
    description: 'Capturamos biogas de la gallinaza como fuente de energía renovable.',
  },
  {
    icon: Heart,
    title: 'Bienestar Animal',
    description: 'Gallinas en ambiente natural, espacioso y con alimentación balanceada.',
  },
  {
    icon: Award,
    title: 'Producción Local',
    description: 'Apoyamos la economía de Coronel Oviedo empleando local y vendiendo local.',
  },
]

const DEFAULT_PROCESS_STEPS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  { icon: Bird, title: '1. Cuidado Diario', description: 'Nuestras gallinas reciben alimentación balanceada y atención veterinaria regular.' },
  { icon: Egg, title: '2. Recolección', description: 'Cada mañana recolectamos los huevos frescos, revisando uno por uno.' },
  { icon: CheckCircle, title: '3. Selección', description: 'Solo los mejores huevos pasan nuestro control de calidad.' },
  { icon: MapPin, title: '4. Entrega', description: 'Delivery directo a tu puerta o retiro en nuestra granja.' },
]

const DEFAULT_VALUES = [
  'Calidad: Cada huevo es revisado antes de la venta',
  'Sostenibilidad: Compostaje, biogas y gestión responsable del agua',
  'Bienestar Animal: Gallinas en ambiente natural y saludable',
  'Comunidad: Precios justos y apoyo a la economía local',
  'Transparencia: Puertas abiertas para que conozcas nuestra granja',
]

export function OurStorySection({ business, overrides }: OurStorySectionProps) {
  const whatsappUrl = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    overrides?.whatsappMessage ?? 'Hola! Quiero visitar la granja para conocer sus instalaciones.',
  )}`

  const heroBadge = overrides?.heroBadge ?? 'Nuestra Historia'
  const [heroHeadPrefix, heroHeadAccent] = (overrides?.heroHeadline ?? 'De Familia a|Comunidad').split('|', 2)
  const heroIntro = overrides?.heroIntro ?? [
    `Laura Cabral fundó ${business.name} en ${business.story?.founded || '[AÑO]'} con una visión clara: producir alimentos frescos, saludables y accesibles para su comunidad en Coronel Oviedo, Paraguay.`,
    'Lo que comenzó con unas pocas gallinas en el patio de su casa, hoy se ha convertido en una granja que alimenta a cientos de familias, restaurantes y negocios de la zona.',
  ]
  const heroImageEmoji = overrides?.heroImageEmoji ?? '👩‍🌾'
  const heroImageCaption = overrides?.heroImageCaption ?? 'Foto: Laura en la granja'
  const heroImageSubcaption = overrides?.heroImageSubcaption ?? '(Reemplazar con foto real)'

  const missionVisionEnabled = overrides?.missionVision?.enabled ?? true
  const valuesEnabled = overrides?.values?.enabled ?? true
  const processEnabled = overrides?.process?.enabled ?? true
  const visitEnabled = overrides?.visit?.enabled ?? true
  const ctaEnabled = overrides?.cta?.enabled ?? true

  // Resolve process steps: either tenant-supplied with icon-by-keyword or
  // the granja defaults (with their full lucide components).
  const processSteps = overrides?.process?.steps
    ? overrides.process.steps.map((s) => ({
        icon: resolveIcon(s.icon, CheckCircle),
        title: s.title,
        description: s.description,
      }))
    : DEFAULT_PROCESS_STEPS

  const sustainabilityItems = business.sustainability?.items
    ? business.sustainability.items.map((s) => ({
        icon: resolveIcon(s.icon, Leaf),
        title: s.title,
        description: s.description,
      }))
    : DEFAULT_SUSTAINABILITY_ITEMS

  const valuesList = business.story?.values ?? DEFAULT_VALUES

  return (
    <div className="w-full">
      {/* Hero Story */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">{heroBadge}</Badge>
              <Heading level={2} className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
                {heroHeadPrefix}
                {heroHeadAccent ? (
                  <>
                    {' '}
                    <span className="text-orange-600">{heroHeadAccent}</span>
                  </>
                ) : null}
              </Heading>
              {heroIntro.map((para, i) => (
                <p key={i} className="text-lg text-[var(--text-muted)] mb-6 leading-relaxed last:mb-8">
                  {para}
                </p>
              ))}
              <div className="flex flex-wrap gap-4">
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[var(--success)] hover:bg-green-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {overrides?.visit?.enabled === false ? 'Escribinos' : 'Agendar Visita'}
                  </Button>
                </Link>
                {business.phone ? (
                  <Link href={`tel:${business.phone}`}>
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar Ahora
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-5xl">{heroImageEmoji}</span>
                  </div>
                  <p className="text-orange-800 font-medium">{heroImageCaption}</p>
                  {heroImageSubcaption ? (
                    <p className="text-sm text-orange-600 mt-2">{heroImageSubcaption}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {business.stats && business.stats.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {business.stats.map((stat, index) => (
                <Card key={index} className="text-center border-[var(--border)]">
                  <CardContent className="p-6">
                    <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                    <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      {missionVisionEnabled && (business.story?.mission || business.story?.vision) ? (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--surface-light)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Heart className="w-6 h-6 text-orange-600" />
                    {overrides?.missionVision?.missionTitle ?? 'Nuestra Misión'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {business.story?.mission ??
                      'Producir alimentos frescos, saludables y accesibles para las familias de Coronel Oviedo y zona, manteniendo prácticas sostenibles y apoyando el desarrollo local.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Award className="w-6 h-6 text-[var(--success)]" />
                    {overrides?.missionVision?.visionTitle ?? 'Nuestra Visión'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {business.story?.vision ??
                      'Ser la granja avícola de referencia en Caaguazú, reconocida por calidad, sostenibilidad y compromiso comunitario. Expandir nuestro alcance mientras mantenemos los valores familiares que nos caracterizan.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      ) : null}

      {/* Values */}
      {valuesEnabled && valuesList.length > 0 ? (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
                {overrides?.values?.title ?? 'Nuestros Valores'}
              </Heading>
              <p className="text-lg text-[var(--text-muted)]">
                {overrides?.values?.subtitle ?? 'Los principios que guían cada decisión'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {valuesList.map((value, index) => {
                const [title, description] = value.split(': ')
                return (
                  <Card key={index} className="border-[var(--border)]">
                    <CardContent className="p-6">
                      <CheckCircle className="w-8 h-8 text-[var(--success)] mb-3" />
                      <Heading level={3} className="font-semibold text-[var(--text)] mb-2">
                        {title}
                      </Heading>
                      <p className="text-sm text-[var(--text-muted)]">{description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Our Process */}
      {processEnabled ? (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
                {overrides?.process?.title ?? 'Nuestro Proceso'}
              </Heading>
              <p className="text-lg text-[var(--text-muted)]">
                {overrides?.process?.subtitle ?? 'De la granja a tu mesa'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <Card key={index} className="text-center border-[var(--border)]">
                  <CardContent className="p-6">
                    <step.icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <Heading level={3} className="font-semibold text-[var(--text)] mb-2">
                      {step.title}
                    </Heading>
                    <p className="text-sm text-[var(--text-muted)]">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Sustainability */}
      {business.sustainability && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800">Compromiso Ambiental</Badge>
              <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
                Sostenibilidad
              </Heading>
              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                Creemos en producir alimentos de manera responsable con el medio ambiente. Nuestra granja implementa
                prácticas sostenibles que benefician a todos.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sustainabilityItems.map((item, index) => (
                <Card key={index} className="border-green-200">
                  <CardContent className="p-6">
                    <item.icon className="w-10 h-10 text-[var(--success)] mb-3" />
                    <Heading level={3} className="font-semibold text-[var(--text)] mb-2">
                      {item.title}
                    </Heading>
                    <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {business.sustainability.description && (
              <div className="mt-8 text-center">
                <p className="text-[var(--text-muted)] italic">&ldquo;{business.sustainability.description}&rdquo;</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Visit Us */}
      {visitEnabled && business.address ? (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-6">
                  {overrides?.visit?.title ?? 'Visítanos'}
                </Heading>
                <p className="text-lg text-[var(--text-muted)] mb-6">
                  {overrides?.visit?.description ??
                    'Te invitamos a conocer nuestras instalaciones y ver cómo trabajamos. Podés ver a nuestras gallinas, el proceso de recolección y entender por qué nuestros huevos son diferentes.'}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium text-[var(--text)]">Ubicación</p>
                      <p className="text-[var(--text-muted)]">{business.address}</p>
                      {business.city ? <p className="text-[var(--text-muted)]">{business.city}, Paraguay</p> : null}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium text-[var(--text)]">
                        {overrides?.visit?.hoursLabel ?? 'Horario de Visitas'}
                      </p>
                      {(overrides?.visit?.hoursLines ?? ['Lunes a Sábado', '9:00 - 11:00 o 15:00 - 17:00']).map(
                        (line, i) => (
                          <p key={i} className="text-[var(--text-muted)]">
                            {line}
                          </p>
                        ),
                      )}
                      {overrides?.visit?.hoursNote !== '' ? (
                        <p className="text-sm text-gray-500">
                          {overrides?.visit?.hoursNote ?? '(Con cita previa)'}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium text-[var(--text)]">Contacto</p>
                      <p className="text-[var(--text-muted)]">{business.whatsapp}</p>
                    </div>
                  </div>
                </div>

                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-[var(--success)] hover:bg-green-700">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Agendar Visita por WhatsApp
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-[var(--text-muted)] font-medium">Mapa de Ubicación</p>
                    <p className="text-sm text-gray-500 mt-2">(Integrar Google Maps)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      {ctaEnabled ? (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} className="text-3xl md:text-4xl font-bold mb-4">
              {overrides?.cta?.title ?? '¿Querés probar la diferencia?'}
            </Heading>
            <p className="text-xl mb-8 opacity-90">
              {overrides?.cta?.subtitle ??
                `Hacé tu primer pedido y descubrí por qué cientos de familias eligen ${business.name} para sus huevos frescos.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-[var(--surface-light)] px-8">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {overrides?.cta?.primaryLabel ?? 'Hacer Pedido por WhatsApp'}
                </Button>
              </Link>
              {business.phone ? (
                <Link href={`tel:${business.phone}`}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                    <Phone className="w-5 h-5 mr-2" />
                    {overrides?.cta?.secondaryLabel ?? 'Llamar Ahora'}
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

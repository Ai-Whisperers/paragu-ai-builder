/** Types and defaults for OurStorySection */
import { Shield, TreePine, Heart, Users, Leaf, Sparkles, Droplets, Recycle, CheckCircle, type LucideIcon } from 'lucide-react'


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

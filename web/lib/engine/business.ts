/**
 * Render-oriented Business DTO used by the composition engine.
 *
 * This is intentionally separate from the DB entity type `Business`
 * in `lib/types.ts`: that one models the `businesses` table row
 * (nested `contact` + `location` objects, timestamps, etc.), while this
 * shape is the flat view a section builder actually consumes.
 *
 * Use `fromBusiness()` to adapt between them.
 */

import type { Business, BusinessType } from '@/lib/types'

export interface ServiceItem {
  name: string
  description?: string
  price?: string
  priceFrom?: string
  duration?: number
  imageUrl?: string
  category?: string
}

export interface ProductItem {
  name: string
  description?: string
  price?: string
  imageUrl?: string
  category?: string
  available?: boolean
}

export interface TeamMember {
  name: string
  role?: string
  bio?: string
  imageUrl?: string
  instagram?: string
}

export interface GalleryImage {
  src: string
  alt: string
  category?: string
}

export interface Testimonial {
  quote: string
  author: string
  role?: string
  rating?: number
}

export interface BusinessData {
  name: string
  slug: string
  type: BusinessType
  tagline?: string
  city: string
  neighborhood?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
  services?: ServiceItem[]
  products?: ProductItem[]
  team?: TeamMember[]
  gallery?: GalleryImage[]
  testimonials?: Testimonial[]
  heroImage?: string
}

/**
 * Adapt a stored `Business` entity into the flat `BusinessData` the
 * renderer expects. Related collections (services, team, etc.) must be
 * fetched separately and supplied by the caller.
 */
export function fromBusiness(
  entity: Business,
  related: Partial<
    Pick<
      BusinessData,
      | 'services'
      | 'products'
      | 'team'
      | 'gallery'
      | 'testimonials'
      | 'hours'
      | 'heroImage'
    >
  > = {}
): BusinessData {
  return {
    name: entity.name,
    slug: entity.slug,
    type: entity.type,
    tagline: entity.tagline,
    city: entity.location.city,
    neighborhood: entity.location.neighborhood,
    address: entity.location.address,
    googleMapsUrl: entity.location.googleMapsUrl,
    phone: entity.contact.phone,
    email: entity.contact.email,
    whatsapp: entity.contact.whatsapp,
    instagram: entity.contact.instagram,
    facebook: entity.contact.facebook,
    ...related,
  }
}

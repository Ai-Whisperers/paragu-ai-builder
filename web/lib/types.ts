/**
 * Core type definitions for the builder.
 */

export const BUSINESS_TYPES = [
  'peluqueria',
  'gimnasio',
  'spa',
  'unas',
  'tatuajes',
  'barberia',
  'estetica',
  'maquillaje',
  'depilacion',
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]

export interface Business {
  id: string
  slug: string
  name: string
  type: BusinessType
  contact: {
    phone?: string
    email?: string
    whatsapp?: string
    instagram?: string
    facebook?: string
  }
  location: {
    address?: string
    neighborhood?: string
    city: string
    state?: string
    coordinates?: { lat: number; lng: number }
    googleMapsUrl?: string
  }
  tagline?: string
  ownerName?: string
  yearsInOperation?: number
  createdAt: string
}

export interface GeneratedSite {
  id: string
  businessId: string
  version: number
  status: 'draft' | 'generating' | 'generated' | 'deployed' | 'error'
  deployedUrl?: string
  createdAt: string
}

export interface SitePage {
  id: string
  siteId: string
  slug: string
  title: string
  sectionsJson: Record<string, unknown>
  metaJson: Record<string, unknown>
}

export interface GenerationLog {
  id: string
  siteId: string
  step: string
  status: 'started' | 'completed' | 'failed'
  durationMs?: number
  error?: string
  createdAt: string
}

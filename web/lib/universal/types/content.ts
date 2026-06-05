/**
 * Centralized content types - matches JSON schema
 */

// Site Config
export interface SiteConfig {
  site: {
    name: string
    slug: string
    url: string
    locale: string
    metaDescription?: string
  }
  business: {
    phone: string
    whatsapp: string
    email: string
    address: string
    coordinates: { lat: number; lng: number }
    instagram?: string
    currency: string
    name: string
  }
  features: Record<string, boolean>
  navigation: {
    main: Array<{ label: string; href: string; external?: boolean; feature?: string }>
    more: Array<{ label: string; href: string; feature?: string }>
  }
  openingHours: Record<string, string>
}

// Hero
export interface HeroSlide {
  headline: string
  subheadline?: string
  image?: string
  cta?: string
  cta_link?: string
}

// Stats
export interface Stat {
  value: string
  label: string
  icon?: string
}

// Service
export interface Service {
  id: string
  name: string
  description?: string
  price?: number
  duration?: string
  image?: string
}

// Testimonial
export interface Testimonial {
  id: string
  name: string
  text: string
  rating?: number
  avatar?: string
}

// Gallery Item
export interface GalleryItem {
  src: string
  alt?: string
  caption?: string
}

// Promotion
export interface Promotion {
  id: string
  title: string
  subtitle?: string
  badge?: string
  description?: string
  wa_message?: string
  is_active?: boolean
  expires_at?: string
  color?: string
  sort_order?: number
}

// FAQ
export interface FaqItem {
  question: string
  answer: string
}

// Team Member
export interface TeamMember {
  name: string
  role: string
  bio?: string
  image?: string
}

// CTA
export interface CtaItem {
  headline: string
  subheadline?: string
  button_text?: string
  button_link?: string
  image?: string
}
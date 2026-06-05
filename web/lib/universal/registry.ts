import { getSiteConfig } from '@/lib/config/config'
import type { Lang } from '@/lib/config/config'

export interface FeatureFlags {
  exitIntentPopup: boolean
  cookieConsent: boolean
  testimonialsCarousel: boolean
  promoBanner: boolean
  quickBooking: boolean
  shareButtons: boolean
  bookingForm: boolean
  gallery: boolean
  testimonials: boolean
  team: boolean
  stats: boolean
  process: boolean
  beforeAfterSlider: boolean
  ctaBanner: boolean
  blog: boolean
  loyaltyProgram: boolean
  giftCards: boolean
  promotions: boolean
  referral: boolean
  clientPortal: boolean
  whatsappAuth: boolean
  instagramLink: boolean
  instagramFeed: boolean
  newsletter: boolean
  googleMapsEmbed: boolean
  breadcrumbs: boolean
  scrollReveal: boolean
  errorBoundary: boolean
  darkMode: boolean
  ecommerce: boolean
  products: boolean
  cart: boolean
  checkout: boolean
  storeLocator: boolean
  logos: boolean
  whyUs: boolean
  whyUsCompact: boolean
  careers: boolean
  timeline: boolean
  mobileCtaDesktop: boolean
  pricing: boolean
  caseStudies: boolean
  landingPage: boolean
  support: boolean
  locations: boolean
  menu: boolean
  auth: boolean
  jobs: boolean
  partners: boolean
  [key: string]: boolean
}

export function getFeatures(lang: Lang = 'es'): FeatureFlags {
  const config = getSiteConfig(lang)
  return (config.features as FeatureFlags) || {}
}

export function isFeatureEnabled(flag: string, lang: Lang = 'es'): boolean {
  const features = getFeatures(lang)
  return features[flag] ?? false
}
import type { Locale } from '@/lib/i18n/config'

export interface SiteIntegrations {
  booking?: string
  crm?: string
  email?: string
  analytics?: string
  payments?: string
}

export interface SiteDefinition {
  slug: string
  vertical: string
  country: string
  domain: string
  defaultLocale: Locale
  locales: Locale[]
  /**
   * Path-based public URL for tenants that live at a subpath instead of
   * a subdomain (e.g. fun4me's site.json has `"path": "/fun4me"`).
   * When set, it's used as the "home" link target in the header nav so
   * clicking Inicio stays inside the tenant instead of bouncing to the
   * platform root. Falls back to `/s/{defaultLocale}/{slug}` when absent.
   */
  path?: string
  navigation: Array<{ labelKey: string; path: string }>
  integrations: SiteIntegrations
  features?: Record<string, boolean>
  contact?: {
    phone?: string
    whatsapp?: string
    email?: string
    address?: string
  }
  /**
   * Structured physical location — fed into the LocalBusiness JSON-LD
   * on every page so Google gets proper address + geo.
   */
  location?: {
    address?: string
    neighborhood?: string
    city?: string
    department?: string
    country?: string
    coordinates?: { lat: number; lng: number }
    googleMapsId?: string | null
  }
  /**
   * Opening-hours map like `{ "Lunes": "07:30 - 17:00", ... }`. Used
   * by the LocalBusiness JSON-LD's `openingHoursSpecification`.
   */
  hours?: Record<string, string>
  social?: Record<string, string>
  bookingUrl?: string
}

export interface PageSection {
  id: string
  variant?: string
  content?: string
  overrides?: Record<string, unknown>
  enabledWhen?: string
}

export interface PageDefinition {
  slug: string
  titleKey?: string
  descriptionKey?: string
  schemaType?: string
  sections: PageSection[]
  /**
   * Opt a page out of the public sitemap and mark it `noindex, nofollow`
   * at runtime. Intended for ad-landing pages that should only be reached
   * via a paid attribution click, never via Google.
   */
  hiddenFromSitemap?: boolean
}

export interface VerticalDefinition {
  id: string
  name: string
  features: Record<string, boolean>
  allowedSections?: string[]
  schema: Record<string, unknown>
  starterKits: string[]
}

export interface ResolvedPage {
  site: SiteDefinition
  locale: Locale
  page: PageDefinition
  sections: Array<{
    id: string
    variant: string
    props: Record<string, unknown>
  }>
  meta: {
    title: string
    description: string
    schemaType?: string
    path: string
  }
  theme: {
    cssString: string
    googleFontsUrl: string
    isDark: boolean
  }
}

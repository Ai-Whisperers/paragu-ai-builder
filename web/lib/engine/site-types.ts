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
  /**
   * Optional "chrome" sections that wrap every page automatically — lets
   * tenant site configs declare header/contact/whatsapp-float/footer once
   * instead of copy-pasting the same 4 sections into every page JSON.
   *
   * Semantics: `chrome.header` (if set) is prepended to the page's
   * sections unless the page already contains a section with that id.
   * Each entry in `chrome.footer` is appended under the same rule — if
   * the page already declared that id explicitly, the explicit one wins
   * and the default is skipped. Pages that want to opt out entirely set
   * `skipDefaults: ["contact", "whatsapp-float"]` etc.
   */
  chrome?: {
    header?: PageSection
    footer?: PageSection[]
  }
}

export interface SectionStyling {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'default' | 'alt' | 'accent' | 'dark' | 'image' | 'gradient' | 'transparent'
  backgroundImage?: string
  backgroundOverlay?: boolean
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full'
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-left' | 'stagger' | 'zoom'
  textAlign?: 'left' | 'center' | 'right'
  textColor?: 'default' | 'light' | 'dark' | 'accent'
  divider?: 'none' | 'top' | 'bottom' | 'both'
}

export interface SectionVisibility {
  desktop?: boolean
  mobile?: boolean
  afterDate?: string
  beforeDate?: string
  loggedIn?: boolean
}

export interface PageSection {
  id: string
  variant?: string
  content?: string
  overrides?: Record<string, unknown>
  enabledWhen?: string
  styling?: SectionStyling
  visibility?: SectionVisibility
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
  /**
   * Section ids from the site's `chrome` defaults that this page wants
   * to skip. Use for pages that genuinely shouldn't render a given
   * chrome section (e.g. `/promo-cartagena` is a paid-ad landing with
   * no footer contact block: `"skipDefaults": ["contact"]`).
   */
  skipDefaults?: string[]
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
    styling?: SectionStyling
    visibility?: SectionVisibility
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

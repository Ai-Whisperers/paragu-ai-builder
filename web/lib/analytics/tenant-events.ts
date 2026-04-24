/**
 * Tenant-site funnel events. Emitted from static (pre-commerce) tenant
 * sites where the existing `commerce-events` helpers don't quite fit —
 * nothing here touches the cart, nothing assumes SKU-normalized EcomItem
 * shape. These are the events we use to measure the Superspuma redesign:
 *
 *   pdp_view              — landed on a /producto/<slug> page
 *   whatsapp_click        — user tapped a WhatsApp CTA (catalog, PDP, hero)
 *   quiz_start / _complete — mattress quiz funnel
 *   store_locator_click   — user tapped a specific store card / pin
 *
 * All no-op when `window.gtag` isn't wired. Safe to import from any
 * client component.
 */
import { gtag } from './gtag-shared'

export function trackPdpView(params: {
  productSlug: string
  productName?: string
  siteSlug?: string
}) {
  gtag('event', 'pdp_view', {
    product_slug: params.productSlug,
    product_name: params.productName,
    site_slug: params.siteSlug,
  })
}

export function trackWhatsappClick(params: {
  /** Where the click originated: "catalog" | "pdp" | "hero" | "promo" | "combos" | "locator" | "other". */
  source: string
  productSlug?: string
  siteSlug?: string
}) {
  gtag('event', 'whatsapp_click', {
    source: params.source,
    product_slug: params.productSlug,
    site_slug: params.siteSlug,
  })
}

export function trackQuizStart(params: { siteSlug?: string }) {
  gtag('event', 'quiz_start', { site_slug: params.siteSlug })
}

export function trackQuizComplete(params: {
  siteSlug?: string
  /** Recommended model slug(s) the quiz landed on. */
  recommended?: string[]
}) {
  gtag('event', 'quiz_complete', {
    site_slug: params.siteSlug,
    recommended: params.recommended?.join(',') ?? null,
  })
}

export function trackStoreLocatorClick(params: {
  storeId: string
  storeName?: string
  siteSlug?: string
}) {
  gtag('event', 'store_locator_click', {
    store_id: params.storeId,
    store_name: params.storeName,
    site_slug: params.siteSlug,
  })
}

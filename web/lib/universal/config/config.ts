/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * ANNOTATION: Config System
 *
 * What it is: Central configuration module that exports all site content and utility functions.
 * Imports JSON from content/ directory (es/*, en/*, tokens.json) and re-exports typed values.
 *
 * Why your business needs it: Single source of truth for all business data — services,
 * promotions, team, testimonials, gallery, hours, WhatsApp number, theme colors.
 * All components import from here instead of hardcoding values.
 *
 * What AI populates from your data (via WhatsApp at onboarding):
 *   - All content JSON files (hero, services, testimonials, promotions, team, etc.)
 *   - Business info (name, phone, WhatsApp, hours, address)
 *   - Theme colors and site URL
 *   - Gift card configurations and loyalty tiers
 *
 * Your input: Send "update my hours" or "change my WhatsApp number" via WhatsApp.
 * We update the relevant JSON and redeploy automatically.
 *
 * Plan availability: All plans (data-driven, AI-updated)
 *
 * Key exports:
 *   - siteConfig, getSiteConfig(lang), getContent(lang) — branding, nav, features, business info
 *   - heroSlides, stats, testimonials, gallery, reasons — homepage sections
 *   - services, servicesIndex, servicesData(lang) — service listings
 *   - promotions, promotionsIndex, promotionsData(lang) — offers and deals
 *   - giftCards, giftCardsIndex, loyalty — customer retention
 *   - team — team section
 *   - products — product catalog
 *   - business, businessData(), siteUrl(), waLink(msg) — business utilities
 *   - formatGs(n), formatHours(hours), getColorMap(color) — formatters
 */
export type ColorName = "rose" | "violet" | "amber" | "sky"
export type Lang = "es" | "en"

import esSite from "@/content/es/site.json"
import enSite from "@/content/en/site.json"
import esHero from "@/content/es/hero.json"
import enHero from "@/content/en/hero.json"
import esStats from "@/content/es/stats.json"
import enStats from "@/content/en/stats.json"
import esTestimonials from "@/content/es/testimonials.json"
import enTestimonials from "@/content/en/testimonials.json"
import esGallery from "@/content/es/gallery.json"
import enGallery from "@/content/en/gallery.json"
import esReasons from "@/content/es/reasons.json"
import enReasons from "@/content/en/reasons.json"
import esCta from "@/content/es/cta.json"
import enCta from "@/content/en/cta.json"
import esBeforeAfter from "@/content/es/before-after.json"
import esHeroExample from "@/content/es/hero-example.json"
import enHeroExample from "@/content/en/hero-example.json"
import esStatsExample from "@/content/es/stats-example.json"
import enStatsExample from "@/content/en/stats-example.json"
import esTestimonialsExample from "@/content/es/testimonials-example.json"
import enTestimonialsExample from "@/content/en/testimonials-example.json"
import esGalleryExample from "@/content/es/gallery-example.json"
import enGalleryExample from "@/content/en/gallery-example.json"
import esCtaExample from "@/content/es/cta-example.json"
import enCtaExample from "@/content/en/cta-example.json"
import sharedTeamExample from "@/content/_shared/team-example.json"
import esFaqs from "@/content/es/faqs.json"
import esAsesoria from "@/content/es/services/categories/asesoria.json"
import esCursos from "@/content/es/services/categories/cursos.json"
import esProductos from "@/content/es/services/categories/productos.json"
import enAsesoria from "@/content/en/services/categories/asesoria.json"
import enCursos from "@/content/en/services/categories/cursos.json"
import enProductos from "@/content/en/services/categories/productos.json"
import esPromoIndex from "@/content/es/promotions/index.json"
import esPromo1 from "@/content/es/promotions/promo-1.json"
import esPromo2 from "@/content/es/promotions/promo-2.json"
import esPromo3 from "@/content/es/promotions/promo-3.json"
import enPromo1 from "@/content/en/promotions/promo-1.json"
import enPromo2 from "@/content/en/promotions/promo-2.json"
import enPromo3 from "@/content/en/promotions/promo-3.json"
import enPromoIndex from "@/content/en/promotions/index.json"
import esLoyaltyIndex from "@/content/es/loyalty/index.json"
import esTiers from "@/content/es/loyalty/tiers.json"
import esGcIndex from "@/content/es/gift-cards/index.json"
import esGcCards from "@/content/es/gift-cards/cards.json"
import esBlogIndex from "@/content/es/blog/index.json"
import enBlogIndex from "@/content/en/blog/index.json"
import sharedTeam from "@/content/_shared/team.json"
import sharedProducts from "@/content/_shared/products.json"
import esFeaturesGlobal from "@/content/es/features/global.json"
import enFeaturesGlobal from "@/content/en/features/global.json"
import esFeaturesTestimonials from "@/content/es/features/testimonials.json"
import enFeaturesTestimonials from "@/content/en/features/testimonials.json"
import esFeaturesStats from "@/content/es/features/stats.json"
import enFeaturesStats from "@/content/en/features/stats.json"
import esFeaturesTeam from "@/content/es/features/team.json"
import enFeaturesTeam from "@/content/en/features/team.json"
import esFeaturesGallery from "@/content/es/features/gallery.json"
import enFeaturesGallery from "@/content/en/features/gallery.json"
import esFeaturesPromotions from "@/content/es/features/promotions.json"
import enFeaturesPromotions from "@/content/en/features/promotions.json"
import esFeaturesGiftCards from "@/content/es/features/gift-cards.json"
import enFeaturesGiftCards from "@/content/en/features/gift-cards.json"
import enFeaturesBlog from "@/content/en/features/blog.json"
import esFeaturesServices from "@/content/es/features/services.json"
import enFeaturesServices from "@/content/en/features/services.json"
import esFeaturesEcommerce from "@/content/es/features/ecommerce.json"
import enFeaturesEcommerce from "@/content/en/features/ecommerce.json"
import type { SiteConfig, HeroSlide, StatItem, ReasonItem, CTAContent, BeforeAfterItem, FAQ, Testimonial, GalleryImage, ServiceCategory, Promotion, GiftCardType, LoyaltyTier, BlogPost, TeamMember } from "@/lib/content-types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

function asConfig(val: unknown): SiteConfig {
  return val as unknown as SiteConfig
}

export function getSiteConfig(lang: Lang): SiteConfig {
  return lang === "en" ? asConfig(enSite) : asConfig(esSite)
}

export function getSiteName(): string {
  const es = asConfig(esSite)
  const en = asConfig(enSite)
  return es.site?.name || en.site?.name || "nuestro local"
}

function isValidHeroSlide(s: unknown): s is HeroSlide {
  return typeof s === 'object' && s !== null && 'title' in s && 'image' in s
}

function isValidStatItem(s: unknown): s is StatItem {
  return typeof s === 'object' && s !== null && 'value' in s && 'label' in s
}

function isValidReasonItem(r: unknown): r is ReasonItem {
  return typeof r === 'object' && r !== null && 'title' in r && 'desc' in r
}

export const siteConfig = asConfig(esSite)

export const features = Object.fromEntries(
  Object.entries(esFeaturesGlobal as Record<string, unknown>).filter(([k]) => k !== '_annotation')
) as Record<string, boolean>

export const servicesIndex: SiteConfig = asConfig(esSite)
export const services: ServiceCategory[] = [esAsesoria as ServiceCategory, esCursos as ServiceCategory, esProductos as ServiceCategory]

export const promotionsIndex: Record<string, unknown> = esPromoIndex as Record<string, unknown>
export const promotions: Promotion[] = [esPromo1 as Promotion, esPromo2 as Promotion, esPromo3 as Promotion]

export const loyaltyIndex: Record<string, unknown> = esLoyaltyIndex as Record<string, unknown>
export const loyaltyTiers: LoyaltyTier[] = esTiers as LoyaltyTier[]
export const loyalty: Record<string, unknown> = { ...(esLoyaltyIndex as Record<string, unknown>), tiers: esTiers }

export const giftCardsIndex: Record<string, unknown> = esGcIndex as Record<string, unknown>
export const giftCards: GiftCardType[] = esGcCards as GiftCardType[]

export const blogIndex: Record<string, unknown> = esBlogIndex as Record<string, unknown>

export interface BusinessInfo {
  name?: string
  phone?: string
  whatsapp?: string
  whatsappMessage?: string
  email?: string
  address?: string
  instagram?: string
  instagramHandle?: string
  currency?: string
  ruc?: string
  hours?: Record<string, string>
  phoneFormatted?: string
}

export const business: BusinessInfo = {
  ...(asConfig(esSite).business as BusinessInfo),
  hours: asConfig(esSite).openingHours as Record<string, string>,
  phoneFormatted: asConfig(esSite).business?.phone || ""
}
export const businessData = () => asConfig(esSite).business
export const siteUrl = asConfig(esSite).site?.url || ""

export const team: TeamMember[] = ((sharedTeam as AnyRecord).team || []) as TeamMember[]
export const products: Record<string, unknown>[] = ((sharedProducts as AnyRecord).products || []) as Record<string, unknown>[]

export function servicesData(lang: Lang): ServiceCategory[] {
  return lang === "en"
    ? [enAsesoria as ServiceCategory, enCursos as ServiceCategory, enProductos as ServiceCategory]
    : [esAsesoria as ServiceCategory, esCursos as ServiceCategory, esProductos as ServiceCategory]
}

export function promotionsData(lang: Lang = "es"): Promotion[] {
  return lang === "en"
    ? [enPromo1 as Promotion, enPromo2 as Promotion, enPromo3 as Promotion]
    : [esPromo1 as Promotion, esPromo2 as Promotion, esPromo3 as Promotion]
}

export function formatGs(n: number | null | undefined): string {
  if (n == null) return "—"
  return `Gs. ${n.toLocaleString("es-PY")}`
}

export function formatHours(hours: Record<string, string> | string): string {
  if (typeof hours === "string") return hours
  const dayAbbr: Record<string, string> = {
    monday: "Lun", tuesday: "Mar", wednesday: "Mié", thursday: "Jue",
    friday: "Vie", saturday: "Sáb", sunday: "Dom",
    mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom"
  }
  return Object.entries(hours).map(([day, time]) => `${dayAbbr[day] ?? day}: ${time}`).join(" · ")
}

export function getColorMap(color: ColorName = "rose"): { bg: string; light: string; text: string } {
  const maps: Record<string, { bg: string; light: string; text: string }> = {
    rose: { bg: "bg-rose-500", light: "from-rose-50", text: "text-rose-500" },
    violet: { bg: "bg-violet-500", light: "from-violet-50", text: "text-violet-500" },
    amber: { bg: "bg-amber-500", light: "from-amber-50", text: "text-amber-500" },
    sky: { bg: "bg-sky-500", light: "from-sky-50", text: "text-sky-500" },
    blue: { bg: "bg-blue-500", light: "from-blue-50", text: "text-blue-500" },
    green: { bg: "bg-green-500", light: "from-green-50", text: "text-green-500" },
    purple: { bg: "bg-purple-500", light: "from-purple-50", text: "text-purple-500" },
  }
  return maps[color] ?? maps.rose
}

export function waLink(message: string): string {
  const es = asConfig(esSite)
  const phone = es.business?.whatsapp || "595981000000"
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function waLinkForService(service: string, message: string): string {
  return waLink(`${message} - Estoy interesado/a en: ${service}`)
}

// USD to PYG exchange rate (Gs per USD)
const rate = Number(process.env.PYG_USD_RATE)
export const PYG_USD_RATE = Number.isFinite(rate) && rate > 0 ? rate : 7600

export function getWhatsapp(): string {
  return asConfig(esSite).business?.whatsapp || "595981000000"
}

export function getWhatsappLink(message?: string): string {
  const phone = getWhatsapp()
  const msg = encodeURIComponent(message || "")
  return `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}`
}

export function getPhone(): string {
  return asConfig(esSite).business?.phone || ""
}

export function getMetaDescription(): string {
  return asConfig(esSite).site?.metaDescription || ""
}

export function getTemplateContent(lang: Lang = "es", isExample = false) {
  const isEs = lang === "es"

  return {
    hero: isExample ? (isEs ? esHeroExample : enHeroExample) : (isEs ? esHero : enHero),
    stats: isExample ? (isEs ? esStatsExample : enStatsExample) : (isEs ? esStats : enStats),
    testimonials: isExample ? (isEs ? esTestimonialsExample : enTestimonialsExample) : (isEs ? esTestimonials : enTestimonials),
    gallery: isExample ? (isEs ? esGalleryExample : enGalleryExample) : (isEs ? esGallery : enGallery),
    cta: isExample ? (isEs ? esCtaExample : enCtaExample) : (isEs ? esCta : enCta),
    team: isExample ? sharedTeamExample : sharedTeam,
    reasons: isEs ? esReasons : enReasons,
    features: isEs ? esFeaturesGlobal : enFeaturesGlobal,
  }
}

export function getHeroSlides(lang: Lang = "es", isExample = false): HeroSlide[] {
  const isEs = lang === "es"
  const heroRaw = (isExample ? (isEs ? esHeroExample : enHeroExample) : (isEs ? esHero : enHero)) as Record<string, unknown>
  const slides = heroRaw?.slides
  if (!Array.isArray(slides)) return []
  return slides.filter(isValidHeroSlide)
}

export function getStats(lang: Lang = "es", isExample = false): StatItem[] {
  const isEs = lang === "es"
  const statsRaw = isExample ? (isEs ? esStatsExample : enStatsExample) : (isEs ? esStats : enStats)
  if (!Array.isArray(statsRaw)) return []
  return statsRaw.filter(isValidStatItem) as StatItem[]
}

export function getTestimonials(lang: Lang = "es", isExample = false): Testimonial[] {
  const isEs = lang === "es"
  const testimonialsRaw = isExample ? (isEs ? esTestimonialsExample : enTestimonialsExample) : (isEs ? esTestimonials : enTestimonials)
  if (!Array.isArray(testimonialsRaw)) return []
  return testimonialsRaw as Testimonial[]
}

export function getGallery(lang: Lang = "es", isExample = false): GalleryImage[] {
  const isEs = lang === "es"
  const galleryRaw = isExample ? (isEs ? esGalleryExample : enGalleryExample) : (isEs ? esGallery : enGallery)
  if (!Array.isArray(galleryRaw)) return []
  return galleryRaw as GalleryImage[]
}

export function getReasons(lang: Lang = "es", _is_example?: boolean): ReasonItem[] {
  const reasonsRaw = lang === "es" ? esReasons : enReasons
  if (!Array.isArray(reasonsRaw)) return []
  return reasonsRaw.filter(isValidReasonItem).map(r => ({ title: r.title || '', desc: r.desc || '', icon: r.icon }))
}

export function getCTA(lang: Lang = "es", _is_example?: boolean): Record<string, unknown> {
  return lang === "en" ? (_is_example ? enCtaExample : enCta) : (_is_example ? esCtaExample : esCta) as Record<string, unknown>
}

export function getTeam(_is_example?: boolean): Record<string, unknown>[] {
  const teamRaw = _is_example ? sharedTeamExample : sharedTeam
  if (!Array.isArray(teamRaw?.team)) return []
  return teamRaw.team as Record<string, unknown>[]
}

export function getFeatures(lang: Lang = "es"): Record<string, boolean> {
  const raw = lang === "en" ? enFeaturesGlobal : esFeaturesGlobal
  const { _annotation: _annot, ...rest } = raw as Record<string, unknown>
  return rest as Record<string, boolean>
}

// Static exports for backward compatibility
export const heroSlides = getHeroSlides("es", false)
export const stats = getStats("es", false)
export const gallery = getGallery("es", false)
export const testimonials = getTestimonials("es", false)
export const reasons = getReasons("es", false)
export const statsData = (_lang?: Lang): StatItem[] => stats
export const galleryData = (_lang?: Lang): GalleryImage[] => gallery
export const beforeAfter = esBeforeAfter as BeforeAfterItem[]
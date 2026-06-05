"use server"
import 'server-only'
import JSON5 from 'json5'
import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.resolve(process.cwd(), 'content')
const contentCache: Record<string, unknown> = {}

function loadContent(relativePath: string): unknown {
  if (contentCache[relativePath]) return contentCache[relativePath]
  const fullPath = path.resolve(CONTENT_DIR, relativePath)
  const raw = fs.readFileSync(fullPath, 'utf8')
  contentCache[relativePath] = JSON5.parse(raw)
  return contentCache[relativePath]
}

export type Lang = "es" | "en"
export type ColorName = "rose" | "violet" | "amber" | "sky"

function getSite(lang: string): unknown {
  return lang === "en"
    ? loadContent('en/site.json')
    : loadContent('es/site.json')
}

function getUiData(lang: string): unknown {
  return lang === "en"
    ? loadContent('en/ui.json')
    : loadContent('es/ui.json')
}

const esSite = getSite("es") as Record<string, unknown>

export const tokens = loadContent('tokens.json')
export const siteConfig = esSite
const siteTheme = (esSite.site ?? {}) as Record<string, unknown>
export const theme: Record<string, unknown> = siteTheme?.theme as Record<string, unknown> || {}

export const heroSlides: unknown[] = (loadContent('es/hero.json') as Record<string, unknown>).slides as unknown[] || []
export const stats: unknown[] = loadContent('es/stats.json') as unknown[]
export const testimonials: unknown[] = loadContent('es/testimonials.json') as unknown[]
export const gallery: unknown[] = loadContent('es/gallery.json') as unknown[]
export const reasons: unknown[] = loadContent('es/reasons.json') as unknown[]
export const cta: unknown = loadContent('es/cta.json')
export const beforeAfter: unknown = loadContent('es/before-after.json')
export const faqs: unknown[] = loadContent('es/faqs.json') as unknown[]

export const servicesIndex: unknown = loadContent('es/services/index.json')
export const serviceCategories: unknown[] = [
  loadContent('es/services/categories/asesoria.json'),
  loadContent('es/services/categories/cursos.json'),
  loadContent('es/services/categories/productos.json'),
]
export const services: unknown[] = serviceCategories

export const promotionsIndex: unknown = loadContent('es/promotions/index.json')
export const promotions: unknown[] = [
  loadContent('es/promotions/promo-1.json'),
  loadContent('es/promotions/promo-2.json'),
  loadContent('es/promotions/promo-3.json'),
]

export const loyaltyIndex: unknown = loadContent('es/loyalty/index.json')
export const loyaltyTiers: unknown = loadContent('es/loyalty/tiers.json')
export const loyalty: unknown = { ...(loyaltyIndex as Record<string, unknown>), tiers: loyaltyTiers }

export const giftCardsIndex: unknown = loadContent('es/gift-cards/index.json')
export const giftCards: unknown[] = loadContent('es/gift-cards/cards.json') as unknown[]

export const blogIndex: unknown = loadContent('es/blog/index.json')

export const business: unknown = { ...(esSite.business as Record<string, unknown> | null ?? {}), hours: esSite.openingHours, phoneFormatted: (esSite.business as Record<string, unknown>)?.phone || "" }
export const siteUrl = ((esSite as Record<string, unknown>).site as Record<string, unknown>)?.url as string || ""

export const team: unknown[] = (loadContent('_shared/team.json') as Record<string, unknown>).team as unknown[] || []

export function getSiteConfig(lang: Lang) {
  return getSite(lang)
}

export function getUi(lang: Lang) {
  return getUiData(lang)
}

export function getSharedProducts() {
  return loadContent('_shared/products.json')
}

export function getSharedTeam() {
  return loadContent('_shared/team.json')
}

export function getContent(lang: Lang) {
  return getSite(lang)
}

export function servicesData(lang: Lang): unknown[] {
  return lang === "en"
    ? [
        loadContent('en/services/categories/asesoria.json'),
        loadContent('en/services/categories/cursos.json'),
        loadContent('en/services/categories/productos.json'),
      ]
    : serviceCategories
}

export function promotionsData(lang: Lang = "es"): unknown[] {
  return lang === "en"
    ? [
        loadContent('en/promotions/promo-1.json'),
        loadContent('en/promotions/promo-2.json'),
        loadContent('en/promotions/promo-3.json'),
      ]
    : promotions
}

export function businessData() {
  return (esSite as Record<string, unknown>).business
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

export function waLink(message: string): string {
  const phone = ((esSite as Record<string, unknown>).business as Record<string, unknown> | null)?.whatsapp || "595981000000"
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function getColorMap(color: ColorName = "rose"): { bg: string; light: string; text: string } {
  const maps: Record<ColorName, { bg: string; light: string; text: string }> = {
    rose: { bg: "bg-rose-500", light: "from-rose-50", text: "text-rose-500" },
    violet: { bg: "bg-violet-500", light: "from-violet-50", text: "text-violet-500" },
    amber: { bg: "bg-amber-500", light: "from-amber-50", text: "text-amber-500" },
    sky: { bg: "bg-sky-500", light: "from-sky-50", text: "text-sky-500" },
  }
  return maps[color] ?? maps.rose
}

export function waLinkForService(service: string, message: string): string {
  return waLink(`${message} - Estoy interesado/a en: ${service}`)
}

export function galleryData() {
  return gallery
}

export function statsData() {
  return stats
}

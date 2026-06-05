import esSite from "@/content/es/site.json"
import enSite from "@/content/en/site.json"
import esUi from "@/content/es/ui.json"
import enUi from "@/content/en/ui.json"

type AnyRecord = Record<string, unknown>

const es = esSite as AnyRecord
const en = enSite as AnyRecord

export function getSiteName() {
  return es.site?.name || en.site?.name || "nuestro local"
}

export function business() {
  return {
    what: es.business?.whatsapp || en.business?.whatsapp || "595981000000",
    message: es.business?.whatsappMessage || en.business?.whatsappMessage || "Hola! Quiero más información",
    address: es.business?.address || en.business?.address || "",
    phone: es.business?.phone || en.business?.phone || "",
    instagram: es.business?.instagram || en.business?.instagram || "",
    instagramHandle: es.business?.instagramHandle || en.business?.instagramHandle || "",
    ruc: es.business?.ruc || en.business?.ruc || "",
    email: es.business?.email || en.business?.email || "",
    currency: es.business?.currency || en.business?.currency || "PYG",
  }
}

export function formatHours(hours: AnyRecord | undefined) {
  if (!hours || typeof hours !== "object") return "Lun-Sáb: 9:00 - 20:00"
  const map: Record<string, string> = {
    mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom",
    monday: "Lun", tuesday: "Mar", wednesday: "Mié", thursday: "Jue", friday: "Vie", saturday: "Sáb", sunday: "Dom",
  }
  return Object.entries(hours)
    .map(([day, time]) => `${map[day] ?? day}: ${time}`)
    .join(" · ")
}

export function waLink(msg: string, phoneOverride?: string) {
  const { what } = business()
  const phone = phoneOverride || what
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

export function ui<T>(lang: string, path: string, fallback?: T): T {
  const src = lang === "en" ? enUi : esUi
  const keys = path.split(".")
  let cur: unknown = src
  for (const k of keys) {
    if (cur && typeof cur === "object" && k in (cur as AnyRecord)) cur = (cur as AnyRecord)[k]
    else return fallback as T
  }
  return cur as T
}

export function text(lang: string, key: string, fallback = "") {
  const parts = key.split(".")
  const src = lang === "en" ? enUi : esUi
  let cur: unknown = src
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as AnyRecord)) cur = (cur as AnyRecord)[p]
    else return fallback
  }
  return String(cur)
}

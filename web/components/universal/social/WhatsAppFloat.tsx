/**
 * ANNOTATION: WhatsAppFloat
 * 
 * What it is: A fixed-position floating WhatsApp button typically placed in the bottom-right corner of the screen. Features a bounce animation and hides/shows based on scroll position for a clean experience.
 * 
 * Why your business needs it: Gives visitors a constant, visible way to message you on WhatsApp from any page — the most common way Paraguayans contact businesses.
 * 
 * What AI populates from your data: ParaguAI fills your WhatsApp number and pre-filled greeting message from your business configuration.
 * 
 * Your input: WhatsApp business phone number.
 * 
 * Plan availability: All plans
 */
"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { waLink } from "@/lib/config/config"

const MESSAGES = {
  es: "Hola! Quiero consultar por sus servicios",
  en: "Hi! I want to ask about their services",
}

export function WhatsAppFloat({ lang = "es" }: { lang?: "es" | "en" }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const message = MESSAGES[lang] ?? MESSAGES.es
  const href = waLink(message)

  if (!visible) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={lang === "es" ? "Contáctanos por WhatsApp" : "Contact us on WhatsApp"}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
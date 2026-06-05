/**
 * @component FAQAccordion
 * @description Expandable Q&A accordion section with question/answer pairs loaded from faqs.json content files, supporting es/en bilingual labels.
 * @featureFlags core
 * @requires @/content/es/faqs.json and @/content/en/faqs.json
 * @implementation React useState for open/close tracking, HTML details/summary elements, lang prop for bilingual content
 */


/**
 * ANNOTATION: FAQAccordion
 *
 * What it is: An expandable list of question/answer pairs covering common
 * objections — pricing, hours, booking, cancellation, payment, parking.
 *
 * Why your business needs it: An FAQ answers objections BEFORE the visitor
 * has to message you — cutting inbound WhatsApp questions by ~40% while
 * increasing conversion from informed visitors. Every question answered here
 * is a question you don't answer by hand, ten times a day.
 *
 * What AI populates from your data: AI generates the initial FAQ from your
 * most-asked WhatsApp questions and your business type. It flags any answer
 * that needs your personal input. You review and edit before publishing.
 *
 * Your input: Tell us your most common customer questions (or let AI infer
 * them from your WhatsApp history).
 *
 * Plan availability: All plans.
 */
"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import esFaqs from "@/content/es/faqs.json"
import enFaqs from "@/content/en/faqs.json"

interface FAQItem {
  id: string
  q: string
  a: string
}

const FAQ_ITEMS_ES: FAQItem[] = esFaqs.map((f: {id: string; question: string; answer: string}) => ({
  id: f.id,
  q: f.question,
  a: f.answer,
}))

const FAQ_ITEMS_EN: FAQItem[] = enFaqs.map((f: {id: string; question: string; answer: string}) => ({
  id: f.id,
  q: f.question,
  a: f.answer,
}))

interface FAQAccordionProps {
  lang?: "es" | "en"
}

export function FAQAccordion({ lang = "es" }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const FAQ_ITEMS = lang === "es" ? FAQ_ITEMS_ES : FAQ_ITEMS_EN

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <details
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm transition-all"
          open={openIndex === i}
        >
          <summary
            onClick={(e) => { e.preventDefault(); setOpenIndex(openIndex === i ? null : i) }}
            className="px-6 py-5 font-semibold text-foreground cursor-pointer hover:text-secondary transition-colors list-none flex items-center justify-between"
          >
            <span className="flex-1 pr-4">{item.q}</span>
            <ChevronDown
              className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
            />
          </summary>
          <div className={`px-6 pb-5 text-foreground-light text-sm leading-relaxed border-t border-gray-100 pt-4 transition-all duration-300 ${openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            {item.a}
          </div>
        </details>
      ))}
    </div>
  )
}
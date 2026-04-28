'use client'

import { useEffect } from 'react'

interface DemoPersonalizerProps {
  businessName?: string
  businessCity?: string
}

export function DemoPersonalizer({ businessName, businessCity }: DemoPersonalizerProps) {
  useEffect(() => {
    if (!businessName && !businessCity) return

    const replacements: Record<string, string> = {}
    if (businessName) {
      replacements['Mi Negocio'] = businessName
      replacements['mi negocio'] = businessName
    }
    if (businessCity) {
      replacements['Asunción'] = businessCity
      replacements['Asuncion'] = businessCity
    }

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent || ''
        let changed = false
        for (const [from, to] of Object.entries(replacements)) {
          if (text.includes(from)) {
            text = text.replaceAll(from, to)
            changed = true
          }
        }
        if (changed) {
          node.textContent = text
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return
        for (const child of Array.from(el.childNodes)) {
          walk(child)
        }
      }
    }

    const observer = new MutationObserver(() => {
      for (const child of Array.from(document.body.childNodes)) {
        walk(child)
      }
    })

    walk(document.body)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [businessName, businessCity])

  return null
}

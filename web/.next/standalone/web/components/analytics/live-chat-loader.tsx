'use client'

import { useEffect } from 'react'

/**
 * Crisp live chat loader.
 *
 * Env-gated: loads only when NEXT_PUBLIC_CRISP_WEBSITE_ID is set. That way
 * the component can be dropped into any tenant layout — no tenant-specific
 * branches needed — and each tenant decides whether to flip chat on by
 * setting the env var on their deploy.
 *
 * We deliberately do NOT load the script inline server-side: waiting for
 * a client mount keeps the critical rendering path free of a third-party
 * blocking script, and makes it safe to conditionally mount or unmount
 * based on user consent (just wire it to the same cookie-banner state
 * when you need it).
 *
 * For providers other than Crisp: the component is thin enough that
 * swapping to Tawk / Intercom / etc is a 5-line edit in the effect.
 */

declare global {
  interface Window {
    $crisp?: unknown[]
    CRISP_WEBSITE_ID?: string
  }
}

export function LiveChatLoader({ websiteId }: { websiteId?: string }) {
  useEffect(() => {
    if (!websiteId) return
    if (document.getElementById('crisp-chat-loader')) return
    window.$crisp = []
    window.CRISP_WEBSITE_ID = websiteId
    const script = document.createElement('script')
    script.id = 'crisp-chat-loader'
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)
    return () => {
      // Intentionally don't remove the script on unmount — Crisp keeps
      // window-global state and reinjecting creates duplicate widgets.
      // The guard above prevents double-mount on route changes.
    }
  }, [websiteId])
  return null
}

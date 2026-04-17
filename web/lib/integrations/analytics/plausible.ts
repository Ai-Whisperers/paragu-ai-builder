import type { AnalyticsAdapter } from './types'

export const plausibleAdapter: AnalyticsAdapter = {
  name: 'plausible',
  scriptTags(config, consent) {
    if (!config.domain) return ''
    if (!consent) return ''
    return `<script defer data-domain="${config.domain}" src="https://plausible.io/js/script.js"></script>`
  },
  trackEventSnippet(event, params) {
    const p = JSON.stringify(params || {})
    return `if (window.plausible) window.plausible('${event}', { props: ${p} });`
  },
}

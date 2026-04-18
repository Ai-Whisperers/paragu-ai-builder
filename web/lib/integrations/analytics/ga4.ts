import type { AnalyticsAdapter } from './types'

export const ga4Adapter: AnalyticsAdapter = {
  name: 'ga4',
  scriptTags(config, consent) {
    if (!config.measurementId) return ''
    if (!consent) return ''
    const id = config.measurementId
    const anonymize = config.anonymizeIp ? 'true' : 'false'
    return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: ${anonymize} });
</script>`
  },
  trackEventSnippet(event, params) {
    const p = JSON.stringify(params || {})
    return `if (window.gtag) window.gtag('event', '${event}', ${p});`
  },
}

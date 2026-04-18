export interface AnalyticsConfig {
  measurementId?: string
  domain?: string
  anonymizeIp?: boolean
}

export interface AnalyticsAdapter {
  name: string
  scriptTags(config: AnalyticsConfig, consent: boolean): string
  trackEventSnippet(event: string, params?: Record<string, unknown>): string
}

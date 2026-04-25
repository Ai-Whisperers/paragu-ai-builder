import type { AnalyticsAdapter } from './types'
import { ga4Adapter } from './ga4'
import { plausibleAdapter } from './plausible'

const ADAPTERS: Record<string, AnalyticsAdapter> = {
  ga4: ga4Adapter,
  plausible: plausibleAdapter,
}

export function getAnalyticsAdapter(name: string | undefined): AnalyticsAdapter | null {
  if (!name) return null
  return ADAPTERS[name.toLowerCase()] || null
}

export type { AnalyticsAdapter, AnalyticsConfig } from './types'

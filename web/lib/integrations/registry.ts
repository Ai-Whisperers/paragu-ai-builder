import { getBookingAdapter } from './booking'
import { getCrmAdapter } from './crm'
import { getEmailAdapter } from './email'
import { getAnalyticsAdapter } from './analytics'
import type { SiteIntegrations } from '@/lib/engine/site-types'

export function resolveAdapters(integrations: SiteIntegrations) {
  return {
    booking: getBookingAdapter(integrations.booking),
    crm: getCrmAdapter(integrations.crm),
    email: getEmailAdapter(integrations.email),
    analytics: getAnalyticsAdapter(integrations.analytics),
  }
}

import type { BusinessContent } from '@/lib/commerce/business-content'

export function getBusinessContent(business: { data_json: unknown }): Record<string, unknown> {
  if (business.data_json && typeof business.data_json === 'object') {
    return business.data_json as Record<string, unknown>
  }
  return {}
}

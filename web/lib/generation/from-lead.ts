/**
 * Stub for the lead → preview-site config mapper. The real implementation
 * was supposed to land alongside `app/api/leads/[id]/generate-preview`
 * (commit 34a5313, PR #150) but the module file was never committed,
 * leaving Main with a broken typecheck.
 *
 * This stub exposes the types the route needs and a throwing implementation
 * so the codebase compiles. The route itself is admin-only, so until a real
 * mapper lands the only effect is a 500 to an admin who tries to trigger it
 * — preferable to keeping Main red for everyone else.
 */

export interface BusinessSchema {
  businessName: string
  contact: {
    email?: string
    phone?: string
    whatsapp?: string
  }
  location?: Record<string, unknown>
  hours?: Record<string, unknown>
  seo?: Record<string, unknown>
}

export interface PreviewConfig {
  siteSlug: string
  verticalId: string
  businessType: 'gimnasio' | 'peluqueria' | string
  schema: BusinessSchema
  source: string
}

export function mapLeadToPreviewConfig(_lead: Record<string, unknown>): PreviewConfig {
  throw new Error('not_implemented: mapLeadToPreviewConfig is a stub awaiting the real mapper')
}

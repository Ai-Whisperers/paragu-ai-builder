/**
 * Shared footer + WhatsApp float + compliance disclaimer for commerce
 * sub-routes (tienda, producto, carrito, checkout, favoritos).
 *
 * The tenant catch-all route ([[...page]]) renders footer + whatsapp-float +
 * compliance-disclaimer via page.json section composition — so those pages
 * get chrome automatically. Commerce sub-routes render their own JSX tree
 * though, and were shipping without any of it (no footer, no support
 * number, no 18+ disclaimer). This mounts the same three elements driven by
 * the tenant's content JSON, so every surface reads like the same shop.
 */
import { loadSiteContent, loadSite } from '@/lib/engine/site-loader'
import type { Locale } from '@/lib/i18n/config'
import { FooterSection } from '@/components/sections/footer-section'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'
import { ComplianceDisclaimerFooterSection } from '@/components/sections/compliance-disclaimer-footer-section'

interface Props {
  siteSlug: string
  locale: Locale
}

export async function CommerceChrome({ siteSlug, locale }: Props) {
  let content: Record<string, unknown> = {}
  let site: Record<string, unknown> = {}
  try {
    content = loadSiteContent(siteSlug, locale) as Record<string, unknown>
    site = loadSite(siteSlug) as unknown as Record<string, unknown>
  } catch {
    return null
  }

  const footerProps = (content.footer as Record<string, unknown> | undefined) ?? {}
  const whatsappProps = (content.whatsapp as Record<string, unknown> | undefined) ?? {}
  const complianceProps =
    (content.compliance as Record<string, unknown> | undefined) ??
    (content.complianceDisclaimer as Record<string, unknown> | undefined) ??
    {}

  const features = (site.features as Record<string, boolean> | undefined) ?? {}

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <FooterSection {...(footerProps as any)} />
      {Object.keys(complianceProps).length > 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ComplianceDisclaimerFooterSection {...(complianceProps as any)} />
      ) : null}
      {features.whatsappFloat !== false && whatsappProps.phone ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <WhatsAppFloat {...(whatsappProps as any)} />
      ) : null}
    </>
  )
}

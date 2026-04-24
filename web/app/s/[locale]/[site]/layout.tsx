import { ExitIntentMount } from './exit-intent-mount'
import { SiteSearch } from '@/components/search/site-search'
import { LiveChatLoader } from '@/components/analytics/live-chat-loader'
import { TabAudioPlayer } from '@/components/audio/tab-audio-player'
import { loadSite } from '@/lib/engine/site-loader'
import { resolveSiteTokens } from '@/lib/engine/resolve-site-tokens'
import { logger } from '@/lib/logger'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string; site: string }>
}

/**
 * Tenant-wide layout. Hoists theme CSS vars + Google Fonts to EVERY route
 * under `/s/<locale>/<site>/*` so storefront / PDP / cart / checkout /
 * sub-pages get the brand palette, not just `[[...page]]`-composed pages.
 *
 * Before this, `/s/es/fun4me` rendered in the Fun4Me magenta/pink palette
 * but `/s/es/fun4me/tienda` rendered in the grayscale fallback (#111)
 * because theme injection lived in the page.tsx of the catch-all route
 * only. See PR A (Tier 0) of the fun4me storefront audit.
 */
export default async function TenantLayout({ children, params }: Props) {
  const { locale, site } = await params

  let cssString = ''
  let googleFontsUrl = ''
  try {
    const siteDef = loadSite(site)
    const tokens = resolveSiteTokens(siteDef.vertical, site)
    cssString = tokens.cssString
    googleFontsUrl = tokens.googleFontsUrl
  } catch (error) {
    // Unknown slug (e.g. /s/es/doesnt-exist) — don't crash the layout.
    // The inner page will 404; we just skip theme injection.
    logger.warn('TenantLayout: resolveSiteTokens failed — rendering without theme', {
      action: 'tenantLayout',
      site,
      locale,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return (
    <>
      {cssString ? (
        <style dangerouslySetInnerHTML={{ __html: cssString }} />
      ) : null}
      {googleFontsUrl ? (
        <link rel="stylesheet" href={googleFontsUrl} precedence="default" />
      ) : null}
      {children}
      {/* Exit-intent modal copy is relocation-vertical specific ("Paraguay
          guide for European investors") and points at hola@nexaparaguay.com.
          Mounting it on Superspuma / Dayah / etc. leaks another tenant's
          brand into the storefront. Gate to Nexa until per-tenant copy
          exists. See docs/audit/visual-critique-2026-04-24.md §"critic pass". */}
      {site === 'nexa-paraguay' && <ExitIntentMount locale={locale} site={site} />}
      {/* Dayah ambient track — paused when the tab loses focus, resumed
          when it regains focus. Modern browsers block sound-autoplay
          until the user interacts, so first-load renders a paused
          floating button; after a tap we save consent to localStorage
          and subsequent tabs can start playing automatically. */}
      {site === 'dayah-litworks' && (
        <TabAudioPlayer
          src="/audio/chispa-asuncion.mp3"
          title="Chispa Asunción"
          storageKey="dayah:tab-audio:v1"
        />
      )}
      <LiveChatLoader websiteId={process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID} />
      <SiteSearch siteSlug={site} locale={locale} />
    </>
  )
}

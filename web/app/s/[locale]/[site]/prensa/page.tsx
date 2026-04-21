/**
 * Per-tenant press kit page.
 *
 * Lists downloadable brand and press assets from the tenant's images
 * manifest (`brand.*` + `press.*`). Copy is locale-aware via the
 * static table below (keeping this page independent of the main
 * tenant-content machinery — press kits rarely need per-tenant copy).
 */
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { resolveSiteTokens } from '@/lib/engine/resolve-site-tokens'
import { loadSite, loadSiteContent } from '@/lib/engine/site-loader'
import { loadImagesManifest, resolveImage, type ImageAsset } from '@/lib/engine/images-loader'
import { isLocale, type Locale } from '@/lib/i18n/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ locale: string; site: string }>
}

const COPY: Record<string, { title: string; subtitle: string; brand: string; press: string; download: string; empty: string }> = {
  en: {
    title: 'Press & brand assets',
    subtitle: 'Logos, brand book, factsheet and country-data infographics for press coverage.',
    brand: 'Brand assets',
    press: 'Press kit',
    download: 'Download',
    empty: 'Press assets are not available yet.',
  },
  es: {
    title: 'Prensa y activos de marca',
    subtitle: 'Logos, brand book, ficha y gráficos de Paraguay para uso editorial y de prensa.',
    brand: 'Activos de marca',
    press: 'Kit de prensa',
    download: 'Descargar',
    empty: 'Los activos de prensa aún no están disponibles.',
  },
  nl: {
    title: 'Pers en merkmateriaal',
    subtitle: 'Logo, brand book, factsheet en Paraguay-infographics voor pers en redactie.',
    brand: 'Merkmateriaal',
    press: 'Perskit',
    download: 'Download',
    empty: 'Persmateriaal is nog niet beschikbaar.',
  },
  de: {
    title: 'Presse und Markenmaterial',
    subtitle: 'Logos, Brand Book, Factsheet und Paraguay-Infografiken für Presse und Redaktion.',
    brand: 'Markenmaterial',
    press: 'Pressekit',
    download: 'Herunterladen',
    empty: 'Pressematerial ist noch nicht verfügbar.',
  },
}

const BRAND_KEYS: Array<[string, string]> = [
  ['brand.logo', 'Logo'],
  ['brand.logoDark', 'Logo (dark)'],
  ['brand.logoIcon', 'Icon mark'],
  ['brand.ogDefault', 'Open Graph card'],
  ['brand.twitterCard', 'Twitter card'],
]

const PRESS_KEYS: Array<[string, string]> = [
  ['press.brandBookCover', 'Brand book cover'],
  ['press.factsheetInfographic', 'Factsheet infographic'],
  ['press.countryDataInfographic', 'Paraguay country-data infographic'],
]

interface AssetEntry {
  label: string
  asset: ImageAsset
}

function collectAssets(
  manifest: ReturnType<typeof loadImagesManifest>,
  keys: Array<[string, string]>,
): AssetEntry[] {
  const out: AssetEntry[] = []
  for (const [key, label] of keys) {
    const asset = resolveImage(manifest, key)
    if (asset) out.push({ label, asset })
  }
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, site: siteSlug } = await params
  if (!isLocale(locale)) return { title: 'Not found' }
  let title = 'Press'
  try {
    const site = loadSite(siteSlug)
    const content = loadSiteContent(siteSlug, locale as Locale) as { siteName?: string }
    const name = content.siteName || site.slug
    const copy = COPY[locale] ?? COPY.en
    title = `${copy.title} — ${name}`
  } catch {
    // fall through
  }
  return { title }
}

export default async function PressPage({ params }: Props) {
  const { locale, site: siteSlug } = await params
  if (!isLocale(locale)) notFound()
  let site
  try {
    site = loadSite(siteSlug)
  } catch {
    notFound()
  }
  const tokens = resolveSiteTokens(site!.vertical, siteSlug)
  const manifest = loadImagesManifest(siteSlug)
  const copy = COPY[locale] ?? COPY.en
  const brandAssets = collectAssets(manifest, BRAND_KEYS)
  const pressAssets = collectAssets(manifest, PRESS_KEYS)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tokens.cssString }} />
      {tokens.googleFontsUrl && <link rel="stylesheet" href={tokens.googleFontsUrl} />}

      <main
        className="min-h-screen py-16 sm:py-24"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        <Container>
          <Heading level={1} className="mb-4 text-[var(--primary)]">
            {copy.title}
          </Heading>
          <p className="max-w-3xl text-lg text-[var(--text-muted)]">{copy.subtitle}</p>

          {brandAssets.length === 0 && pressAssets.length === 0 && (
            <p className="mt-12 text-[var(--text-muted)]">{copy.empty}</p>
          )}

          {brandAssets.length > 0 && (
            <AssetSection title={copy.brand} downloadLabel={copy.download} assets={brandAssets} />
          )}
          {pressAssets.length > 0 && (
            <AssetSection title={copy.press} downloadLabel={copy.download} assets={pressAssets} />
          )}
        </Container>
      </main>
    </>
  )
}

function AssetSection({
  title,
  downloadLabel,
  assets,
}: {
  title: string
  downloadLabel: string
  assets: AssetEntry[]
}) {
  return (
    <section className="mt-16">
      <Heading level={2} className="mb-6 text-2xl font-semibold text-[var(--primary)]">
        {title}
      </Heading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map(({ label, asset }) => (
          <div
            key={asset.src}
            className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-card"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-[var(--surface-light)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.src}
                alt={asset.alt || label}
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <p className="text-sm font-medium text-[var(--text)]">{label}</p>
              <a
                href={asset.src}
                download
                className="mt-auto inline-flex items-center justify-center rounded-md bg-[var(--secondary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                {downloadLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

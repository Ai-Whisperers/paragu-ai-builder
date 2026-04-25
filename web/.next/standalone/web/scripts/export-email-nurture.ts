#!/usr/bin/env node
/**
 * Email nurture MJML exporter.
 *
 * Reads `sites/<slug>/email-nurture.json` + `sites/<slug>/images.json`
 * and writes one `.mjml` file per (locale, step) under
 *   `sites/<slug>/dist/email/<locale>/NN-<name>.mjml`
 *
 * The header image for each step is picked from the tenant's `email.*`
 * bucket by position (1→welcome, 2→paraguayDifferent, ... 7→nextStep).
 * Callers can import the output folder into Mailchimp / Customer.io /
 * Postmark directly — MJML is the authoring layer, not the final HTML.
 *
 * Usage:
 *   tsx scripts/export-email-nurture.ts <slug>     # e.g. nexa-paraguay
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '../..')

interface NurtureStep {
  dayOffset: number
  locales: Record<
    string,
    {
      subject: string
      body: string
    }
  >
}

interface NurtureFile {
  description?: string
  sequence: NurtureStep[]
}

interface ImageAsset {
  src: string
  alt?: string
}

interface ImagesManifest {
  basePath?: string
  images: Record<string, Record<string, ImageAsset>>
}

/** Positional mapping step index → images.email.<key>. */
const EMAIL_IMAGE_ORDER: string[] = [
  'welcome',
  'paraguayDifferent',
  'process',
  'oneTrip',
  'banking',
  'whichProgram',
  'nextStep',
]

const STEP_NAMES: string[] = [
  'welcome',
  'paraguay-different',
  'process',
  'one-trip',
  'banking',
  'which-program',
  'next-step',
]

/**
 * Inline CTA URL per locale — we can't infer this from the nurture JSON
 * alone so we hard-code the tenant's booking page. Non-Nexa tenants that
 * adopt this script should pass their own URL via a CLI flag.
 */
const BOOKING_URL: Record<string, string> = {
  nl: '/s/nl/nexa-paraguay/contacto',
  en: '/s/en/nexa-paraguay/contacto',
  de: '/s/de/nexa-paraguay/contacto',
  es: '/s/es/nexa-paraguay/contacto',
}

const CTA_LABEL: Record<string, string> = {
  nl: 'Plan uw gratis consult',
  en: 'Book a free consultation',
  de: 'Kostenloses Beratungsgespräch buchen',
  es: 'Agendar consulta gratuita',
}

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
}

function toAbsoluteUrl(src: string, origin: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${origin}${src}`
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildMjml({
  subject,
  headerImage,
  headerAlt,
  body,
  ctaLabel,
  ctaUrl,
}: {
  subject: string
  headerImage: string | null
  headerAlt: string
  body: string
  ctaLabel: string
  ctaUrl: string
}): string {
  const escapedBody = esc(body).replace(/\n\n/g, '</p><p>')
  return `<mjml>
  <mj-head>
    <mj-title>${esc(subject)}</mj-title>
    <mj-preview>${esc(body.slice(0, 120))}</mj-preview>
    <mj-attributes>
      <mj-all font-family="Georgia, 'Times New Roman', serif" />
      <mj-text color="#0f1e32" font-size="16px" line-height="1.6" />
      <mj-button background-color="#B8860B" color="#ffffff" font-weight="600" border-radius="6px" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#faf7f2">
    ${headerImage ? `
    <mj-section padding="0">
      <mj-column>
        <mj-image src="${headerImage}" alt="${esc(headerAlt)}" padding="0" />
      </mj-column>
    </mj-section>` : ''}
    <mj-section background-color="#ffffff" padding="32px">
      <mj-column>
        <mj-text font-size="24px" font-weight="700" color="#0f1e32" padding-bottom="16px">
          ${esc(subject)}
        </mj-text>
        <mj-text>
          <p>${escapedBody}</p>
        </mj-text>
        <mj-button href="${ctaUrl}" padding-top="24px">${esc(ctaLabel)}</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#faf7f2" padding="24px">
      <mj-column>
        <mj-text align="center" font-size="12px" color="#64748b">
          Nexa Paraguay — Asunción, Paraguay<br/>
          Para dejar de recibir este correo, responda "baja".
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

function main() {
  const slug = process.argv[2]
  if (!slug) {
    console.error('Usage: tsx scripts/export-email-nurture.ts <slug>')
    process.exit(2)
  }

  const siteDir = path.join(PROJECT_ROOT, 'sites', slug)
  const nurturePath = path.join(siteDir, 'email-nurture.json')
  const imagesPath = path.join(siteDir, 'images.json')
  if (!fs.existsSync(nurturePath)) {
    console.error(`[export-email-nurture] no email-nurture.json for ${slug}`)
    process.exit(2)
  }

  const nurture = readJson<NurtureFile>(nurturePath)
  const manifest = fs.existsSync(imagesPath) ? readJson<ImagesManifest>(imagesPath) : null
  const origin = (process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.com').replace(/\/$/, '')

  const distRoot = path.join(siteDir, 'dist', 'email')
  fs.mkdirSync(distRoot, { recursive: true })

  let count = 0
  for (let i = 0; i < nurture.sequence.length; i++) {
    const step = nurture.sequence[i]
    const imageKey = EMAIL_IMAGE_ORDER[i]
    const asset = imageKey ? manifest?.images?.email?.[imageKey] : undefined
    const headerImage = asset?.src ? toAbsoluteUrl(asset.src, origin) : null
    const headerAlt = asset?.alt ?? ''
    const stepName = STEP_NAMES[i] ?? `step-${i + 1}`
    const stepNumber = String(i + 1).padStart(2, '0')

    for (const [locale, copy] of Object.entries(step.locales)) {
      const outDir = path.join(distRoot, locale)
      fs.mkdirSync(outDir, { recursive: true })
      const outPath = path.join(outDir, `${stepNumber}-${stepName}.mjml`)
      const mjml = buildMjml({
        subject: copy.subject,
        headerImage,
        headerAlt,
        body: copy.body,
        ctaLabel: CTA_LABEL[locale] ?? CTA_LABEL.en,
        ctaUrl: BOOKING_URL[locale] ?? BOOKING_URL.en,
      })
      fs.writeFileSync(outPath, mjml, 'utf-8')
      count++
    }
  }

  console.log(`[export-email-nurture] wrote ${count} MJML files to ${distRoot}`)
}

main()

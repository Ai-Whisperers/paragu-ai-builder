import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const PRODUCTION_SITES = [
  'nexa-paraguay',
  'nexa-propiedades',
  'dayah-litworks',
  'de-abasto-a-casa',
  'superspuma',
  'fun4me'
]

const USAGE = `
Usage: npx tsx scripts/wire-integrations.ts [--credentials=<path>]

Examples:
  npx tsx scripts/wire-integrations.ts --dry

  npx tsx scripts/wire-integrations.ts --credentials=real-credentials.json

credential json format:
{
  "nexa-paraguay": {
    "hubspot": { "portalId": "...", "formId": "..." },
    "mailchimp": { "audienceId": "..." },
    "ga4": { "measurementId": "...", "streamName": "..." }
  }
}
`

function log(message) {
  console.log(`  ${message}`)
}

function success(message) {
  console.log(`  ✅ ${message}`)
}

function warn(message) {
  console.log(`  ⚠️  ${message}`)
}

function error(message) {
  console.log(`  ❌ ${message}`)
}

function parseArgs() {
  const args = process.argv.slice(2)
  const dry = args.includes('--dry')
  const credsArg = args.find(a => a.startsWith('--credentials='))
  const credsPath = credsArg ? credsArg.split('=')[1] : null
  return { dry, credsPath }
}

function main() {
  const { dry, credsPath } = parseArgs()

  const creds = credsPath && existsSync(resolve(credsPath))
    ? JSON.parse(readFileSync(resolve(credsPath), 'utf-8'))
    : null

  if (!creds) {
    warn('No credentials file provided — showing current placeholder state')
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         PARAGU-AI INTEGRATION WIRING                        ║
║                                                              ║
║  Wire real Hubspot, Mailchimp, and GA4 credentials to        ║
║  6 production sites.                                         ║
╚══════════════════════════════════════════════════════════════╝
`)

  if (dry) {
    warn('DRY RUN — no files will be modified')
    console.log('')
  }

  for (const siteSlug of PRODUCTION_SITES) {
    const configPath = resolve(__dirname, `../../sites/${siteSlug}/site.json`)

    if (!existsSync(configPath)) {
      error(`${siteSlug}: site.json not found — skipping`)
      continue
    }

    const config = JSON.parse(readFileSync(configPath, 'utf-8'))

    const siteCreds = creds?.[siteSlug]

    console.log(`\n  ${siteSlug}:`)

    // Collect current integration info
    const hubspotPortalId = config.integrations?.hubspot?.portalId
    const hubspotFormId = config.integrations?.hubspot?.formId
    const mailchimpAudienceId = config.integrations?.mailchimp?.audienceId
    const ga4MeasurementId = config.integrations?.analytics?.ga4?.measurementId
    const ga4StreamName = config.integrations?.analytics?.ga4?.streamName

    // Check Hubspot
    const hubspotIsPlaceholder = hubspotPortalId === 'HS-PORTAL-PARAGUAI' || !hubspotPortalId
    log(`Hubspot: ${hubspotIsPlaceholder ? '⚠️ placeholder' : '✅ configured'} (portal: ${hubspotPortalId || 'none'})`)

    // Check Mailchimp
    const mailchimpIsPlaceholder = mailchimpAudienceId === 'audience-paragu-ai-newsletter' || !mailchimpAudienceId
    log(`Mailchimp: ${mailchimpIsPlaceholder ? '⚠️ placeholder' : '✅ configured'} (audience: ${mailchimpAudienceId || 'none'})`)

    // Check GA4
    const ga4IsPlaceholder = ga4MeasurementId === 'G-XXXXXXXXXXX' || ga4MeasurementId === 'R-XXXXXXXXXX' || !ga4MeasurementId
    log(`GA4: ${ga4IsPlaceholder ? '⚠️ placeholder' : '✅ configured'} (measurement: ${ga4MeasurementId || 'none'})`)

    // Apply real credentials if available
    if (siteCreds) {
      if (!config.integrations) {
        config.integrations = {}
      }

      if (siteCreds.hubspot) {
        config.integrations.hubspot = {
          ...config.integrations.hubspot,
          ...siteCreds.hubspot
        }
        success(`Hubspot updated: ${siteCreds.hubspot.portalId}`)
      }

      if (siteCreds.mailchimp) {
        config.integrations.mailchimp = {
          ...config.integrations.mailchimp,
          ...siteCreds.mailchimp
        }
        success(`Mailchimp updated: ${siteCreds.mailchimp.audienceId}`)
      }

      if (siteCreds.ga4) {
        config.integrations.analytics = {
          ...config.integrations.analytics,
          ga4: {
            ...config.integrations.analytics?.ga4,
            ...siteCreds.ga4
          }
        }
        success(`GA4 updated: ${siteCreds.ga4.measurementId}`)
      }

      if (!dry) {
        writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')
        success(`Saved ${siteSlug}/site.json`)
      } else {
        log(`Would save ${siteSlug}/site.json`)
      }
    }
  }

  console.log('')

  if (!creds) {
    console.log('\n  NEXT STEPS:')
    console.log('  1. Create a credentials JSON file with real IDs')
    console.log('  2. Run: npx tsx scripts/wire-integrations.ts --credentials=real-creds.json')
    console.log('')
    console.log('  See INTEGRATION_WIRING.md for full instructions')
    console.log('')
  }

  console.log(USAGE)
  process.exit(0)
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

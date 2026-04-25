#!/usr/bin/env node
/**
 * Production Status Report
 *
 * Generates comprehensive status report for all production sites
 *
 * Usage: npm run production:status
 */

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

function log(step, message) {
  console.log(`\n${step}. ${message}`)
}

function success(message) {
  console.log(`   ✅ ${message}`)
}

function error(message) {
  console.log(`   ❌ ${message}`)
}

function warn(message) {
  console.log(`   ⚠️  ${message}`)
}

function info(message) {
  console.log(`   ℹ️  ${message}`)
}

function getSiteStatus(siteSlug) {
  const configPath = resolve(__dirname, `../../sites/${siteSlug}/site.json`)

  if (!existsSync(configPath)) {
    return { site: siteSlug, status: 'ERROR', message: 'site.json not found' }
  }

  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))

    const status = {
      site: siteSlug,
      isLive: config.isLiveProduction === true,
      isDemo: config.is_demo === true,
      hasDomain: !!(config.domain || config.path),
      hasIntegrations: !!config.integrations,
      hasPlaceholders: config.placeholderFields && Object.keys(config.placeholderFields).length > 0,
      domain: config.domain || config.path,
      integrations: config.integrations || {},
      placeholderFields: config.placeholderFields || {}
    }

    // Determine overall status
    if (status.isDemo) {
      status.status = 'DEMO'
      status.message = 'Site is in demo mode - not production ready'
    } else if (!status.isLive) {
      status.status = 'NOT_PRODUCTION'
      status.message = 'isLiveProduction flag not set'
    } else if (!status.hasDomain) {
      status.status = 'NO_DOMAIN'
      status.message = 'No domain or path configured'
    } else if (status.hasPlaceholders) {
      status.status = 'HAS_PLACEHOLDERS'
      status.message = `${Object.keys(status.placeholderFields).length} placeholder fields remaining`
    } else if (!status.hasIntegrations) {
      status.status = 'NO_INTEGRATIONS'
      status.message = 'No integrations configured'
    } else {
      status.status = 'READY'
      status.message = 'Ready for production deployment'
    }

    return status
  } catch (e) {
    return { site: siteSlug, status: 'ERROR', message: `Invalid JSON: ${e.message}` }
  }
}

function generateReport() {
  const statuses = PRODUCTION_SITES.map(getSiteStatus)

  const summary = {
    total: PRODUCTION_SITES.length,
    ready: 0,
    demo: 0,
    notProduction: 0,
    noDomain: 0,
    hasPlaceholders: 0,
    noIntegrations: 0,
    errors: 0
  }

  // Count by status
  for (const status of statuses) {
    switch (status.status) {
      case 'READY':
        summary.ready++
        break
      case 'DEMO':
        summary.demo++
        break
      case 'NOT_PRODUCTION':
        summary.notProduction++
        break
      case 'NO_DOMAIN':
        summary.noDomain++
        break
      case 'HAS_PLACEHOLDERS':
        summary.hasPlaceholders++
        break
      case 'NO_INTEGRATIONS':
        summary.noIntegrations++
        break
      case 'ERROR':
        summary.errors++
        break
    }
  }

  return {
    summary,
    statuses,
    generatedAt: new Date().toISOString()
  }
}

function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         PARAGU-AI PRODUCTION STATUS REPORT                 ║
║                                                            ║
║  Comprehensive status for 6 production sites               ║
╚══════════════════════════════════════════════════════════════╝
`)

  const report = generateReport()
  const { summary, statuses, generatedAt } = report

  // Print summary
  log(1, 'Summary')
  console.log('')
  console.log(`   Total Sites: ${summary.total}`)
  console.log(`   Ready: ${summary.ready}`)
  console.log(`   Demo Mode: ${summary.demo}`)
  console.log(`   Not Production: ${summary.notProduction}`)
  console.log(`   No Domain: ${summary.noDomain}`)
  console.log(`   Has Placeholders: ${summary.hasPlaceholders}`)
  console.log(`   No Integrations: ${summary.noIntegrations}`)
  console.log(`   Errors: ${summary.errors}`)
  console.log('')

  const readyPercent = ((summary.ready / summary.total) * 100).toFixed(1)
  console.log(`   Readiness Score: ${readyPercent}%`)
  console.log('')

  if (summary.ready === summary.total) {
    success('All sites are ready for production deployment!')
  } else if (summary.ready > 0) {
    info(`${summary.ready} site(s) ready, ${summary.total - summary.ready} need attention`)
  } else {
    warn('No sites are ready for production')
  }

  console.log('')

  // Detailed status for each site
  log(2, 'Site Details')
  console.log('')

  for (const status of statuses) {
    console.log(`\n   ${status.site}`)
    console.log(`   Status: ${status.status}`)
    console.log(`   Message: ${status.message}`)

    if (status.domain) {
      info(`Domain/Path: ${status.domain}`)
    }

    if (status.integrations && Object.keys(status.integrations).length > 0) {
      console.log('   Integrations:')
      if (status.integrations.hubspot) {
        info(`  • Hubspot: ${status.integrations.hubspot.portalId || 'not configured'}`)
      }
      if (status.integrations.mailchimp) {
        info(`  • Mailchimp: ${status.integrations.mailchimp.audienceId || 'not configured'}`)
      }
      if (status.integrations.analytics?.ga4) {
        info(`  • GA4: ${status.integrations.analytics.ga4.measurementId || 'not configured'}`)
      }
    } else {
      console.log('   Integrations: None')
    }

    if (status.placeholderFields && Object.keys(status.placeholderFields).length > 0) {
      console.log('   Placeholders:')
      for (const [field, value] of Object.entries(status.placeholderFields)) {
        console.log(`     • ${field}: ${value}`)
      }
    }
  }

  console.log('')

  // Integration status
  log(3, 'Integration Status')
  console.log('')

  const hubspotCount = statuses.filter(s => s.integrations?.hubspot?.portalId).length
  const mailchimpCount = statuses.filter(s => s.integrations?.mailchimp?.audienceId).length
  const ga4Count = statuses.filter(s => s.integrations?.analytics?.ga4?.measurementId).length

  console.log(`   Hubspot: ${hubspotCount}/${summary.total} sites`)
  console.log(`   Mailchimp: ${mailchimpCount}/${summary.total} sites`)
  console.log(`   GA4: ${ga4Count}/${summary.total} sites`)
  console.log('')

  if (hubspotCount === summary.total && mailchimpCount === summary.total && ga4Count === summary.total) {
    success('All integrations configured')
  } else {
    warn('Some sites missing integrations')
  }

  console.log('')

  // Write report to file
  const reportPath = resolve(__dirname, '../../PRODUCTION_STATUS.md')
  const reportContent = `# Production Status Report

Generated: ${generatedAt}

## Summary

- Total Sites: ${summary.total}
- Ready: ${summary.ready}
- Demo Mode: ${summary.demo}
- Not Production: ${summary.notProduction}
- No Domain: ${summary.noDomain}
- Has Placeholders: ${summary.hasPlaceholders}
- No Integrations: ${summary.noIntegrations}
- Errors: ${summary.errors}
- Readiness Score: ${readyPercent}%

## Site Details

${statuses.map(s => `### ${s.site}

**Status:** ${s.status}
**Message:** ${s.message}
${s.domain ? `**Domain/Path:** ${s.domain}\n` : ''}${s.integrations && Object.keys(s.integrations).length > 0 ? `**Integrations:**
- Hubspot: ${s.integrations.hubspot?.portalId || 'not configured'}
- Mailchimp: ${s.integrations.mailchimp?.audienceId || 'not configured'}
- GA4: ${s.integrations.analytics?.ga4?.measurementId || 'not configured'}
` : ''}${s.placeholderFields && Object.keys(s.placeholderFields).length > 0 ? `**Placeholders:**
${Object.entries(s.placeholderFields).map(([f, v]) => `- ${f}: ${v}`).join('\n')}
` : ''}`).join('\n')}

## Integration Status

- Hubspot: ${hubspotCount}/${summary.total} sites
- Mailchimp: ${mailchimpCount}/${summary.total} sites
- GA4: ${ga4Count}/${summary.total} sites

## Next Actions

${summary.errors > 0 ? '1. Fix configuration errors' : ''}${summary.demo > 0 ? '1. Remove demo mode from sites' : ''}${summary.noDomain > 0 ? '1. Configure domains' : ''}${summary.hasPlaceholders > 0 ? '1. Resolve placeholder fields' : ''}${summary.noIntegrations > 0 ? '1. Configure integrations' : ''}
`

  writeFileSync(reportPath, reportContent)
  success(`Report saved to ${reportPath}`)

  console.log('')

  // Exit with appropriate code
  if (summary.ready === summary.total) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

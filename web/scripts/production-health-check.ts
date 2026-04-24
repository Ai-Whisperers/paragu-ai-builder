#!/usr/bin/env node
/**
 * Production Health Check
 *
 * Verifies all production sites are healthy and accessible
 *
 * Usage: npm run health:check
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const PRODUCTION_SITES = [
  'nexa-paraguay',
  'nexa-propiedades',
  'dayah-litworks',
  'de-abasto-a-casa',
  'superspuma',
  'fun4me'
]

const BASE_URL = 'https://paragu-ai.com'

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

function checkSite(siteSlug) {
  const url = `${BASE_URL}/s/es/${siteSlug}`

  try {
    // Check HTTP status
    const start = Date.now()
    const result = execSync(
      `curl -sL -o /dev/null -w "%{http_code}" "${url}"`,
      { timeout: 10000, encoding: 'utf-8' }
    ).trim()

    const duration = Date.now() - start

    if (result === '200') {
      success(`${siteSlug}: ${url} (${duration}ms)`)
      return { site: siteSlug, url, status: 200, duration, healthy: true }
    } else if (result === '404') {
      error(`${siteSlug}: ${url} - NOT FOUND (404)`)
      return { site: siteSlug, url, status: 404, duration, healthy: false }
    } else if (result === '500') {
      error(`${siteSlug}: ${url} - SERVER ERROR (500)`)
      return { site: siteSlug, url, status: 500, duration, healthy: false }
    } else {
      warn(`${siteSlug}: ${url} - Unexpected status ${result}`)
      return { site: siteSlug, url, status: parseInt(result), duration, healthy: false }
    }
  } catch (e) {
    error(`${siteSlug}: ${url} - Failed to check (${e.message})`)
    return { site: siteSlug, url, status: -1, duration: 0, healthy: false }
  }
}

function checkSiteConfig(siteSlug) {
  const configPath = resolve(__dirname, `../../sites/${siteSlug}/site.json`)

  if (!existsSync(configPath)) {
    error(`${siteSlug}: site.json not found`)
    return { site: siteSlug, hasConfig: false }
  }

  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))

    const checks = []

    // Check isLiveProduction flag
    if (config.isLiveProduction === true) {
      checks.push('isLiveProduction: ✅')
    } else {
      checks.push('isLiveProduction: ❌ (should be true)')
    }

    // Check demoMode flag (should not exist or be false)
    if (!config.is_demo || config.is_demo === false) {
      checks.push('demoMode: ✅ (disabled)')
    } else {
      checks.push('demoMode: ⚠️ (still enabled)')
    }

    // Check domain/path configuration
    if (config.path || config.domain) {
      checks.push(`domain/path: ✅ (${config.path || config.domain})`)
    } else {
      checks.push('domain/path: ❌ (missing)')
    }

    // Check integrations
    if (config.integrations) {
      const hasHubspot = !!config.integrations.hubspot?.portalId
      const hasMailchimp = !!config.integrations.mailchimp?.audienceId
      const hasGA4 = !!config.integrations.analytics?.ga4?.measurementId

      if (hasHubspot && hasMailchimp && hasGA4) {
        checks.push('integrations: ✅ (all configured)')
      } else {
        checks.push(`integrations: ⚠️ (Hubspot:${hasHubspot}, Mailchimp:${hasMailchimp}, GA4:${hasGA4})`)
      }
    } else {
      checks.push('integrations: ❌ (not configured)')
    }

    // Check placeholder fields
    if (config.placeholderFields && Object.keys(config.placeholderFields).length > 0) {
      checks.push('placeholders: ✅ (none)')
    } else if (config.placeholderFields) {
      const placeholderCount = Object.keys(config.placeholderFields).length
      checks.push(`placeholders: ⚠️ (${placeholderCount} remaining)`)
    } else {
      checks.push('placeholders: ✅ (not set)')
    }

    return {
      site: siteSlug,
      hasConfig: true,
      checks,
      config
    }
  } catch (e) {
    error(`${siteSlug}: Invalid site.json (${e.message})`)
    return { site: siteSlug, hasConfig: false, error: e.message }
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         PARAGU-AI PRODUCTION HEALTH CHECK                    ║
║                                                            ║
║  Checking 6 production sites for health status              ║
╚════════════════════════════════════════════════════════════╝
`)

  const results = {
    sites: [],
    configs: [],
    summary: {
      total: PRODUCTION_SITES.length,
      healthy: 0,
      unhealthy: 0,
      configErrors: 0
    }
  }

  // Check all sites
  log(1, 'Checking site accessibility')
  console.log('')

  for (const siteSlug of PRODUCTION_SITES) {
    const siteResult = checkSite(siteSlug)
    results.sites.push(siteResult)

    if (siteResult.healthy) {
      results.summary.healthy++
    } else {
      results.summary.unhealthy++
    }

    // Small delay between checks
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('')

  // Check site configs
  log(2, 'Checking site configurations')
  console.log('')

  for (const siteSlug of PRODUCTION_SITES) {
    const configResult = checkSiteConfig(siteSlug)
    results.configs.push(configResult)

    if (!configResult.hasConfig) {
      results.summary.configErrors++
    }
  }

  console.log('')

  // Print summary
  log(3, 'Summary')
  console.log('')

  console.log(`   Total Sites: ${results.summary.total}`)
  console.log(`   Healthy: ${results.summary.healthy}`)
  console.log(`   Unhealthy: ${results.summary.unhealthy}`)
  console.log(`   Config Errors: ${results.summary.configErrors}`)
  console.log('')

  const healthPercent = ((results.summary.healthy / results.summary.total) * 100).toFixed(1)
  console.log(`   Health Score: ${healthPercent}%`)
  console.log('')

  if (results.summary.healthy === results.summary.total && results.summary.configErrors === 0) {
    success('All production sites are healthy and properly configured!')
  } else if (results.summary.unhealthy > 0) {
    warn(`${results.summary.unhealthy} site(s) are not accessible`)
  }

  if (results.summary.configErrors > 0) {
    warn(`${results.summary.configErrors} site(s) have configuration errors`)
  }

  console.log('')

  // Detailed results
  log(4, 'Detailed Results')
  console.log('')

  console.log('   CONFIGURATION STATUS:')
  for (const configResult of results.configs) {
    if (!configResult.hasConfig) continue

    console.log(`\n   ${configResult.site}:`)
    for (const check of configResult.checks) {
      console.log(`     ${check}`)
    }
  }

  console.log('')
  console.log('   ACCESSIBILITY STATUS:')
  for (const siteResult of results.sites) {
    if (siteResult.healthy) {
      success(`${siteResult.site}: ${siteResult.url} (${siteResult.duration}ms)`)
    } else {
      error(`${siteResult.site}: ${siteResult.url} - STATUS ${siteResult.status}`)
    }
  }

  console.log('')

  // Exit with appropriate code
  if (results.summary.healthy === results.summary.total && results.summary.configErrors === 0) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

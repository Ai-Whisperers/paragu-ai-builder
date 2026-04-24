#!/usr/bin/env -3

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const PURPOSES = {
  '/api/health': 'Health check endpoint',
  '/api/diagnostics': 'Application diagnostics',
  '/api/admin/billing': 'Billing management',
  '/api/admin/commerce': 'Commerce admin operations',
  '/api/admin/leads': 'Lead management',
  '/api/admin/tenants': 'Tenant configuration',
  '/api/storefront': 'Storefront API',
  '/api/subscriptions': 'Subscription management',
  '/api/webhooks': 'Payment webhook handlers',
  '/api/cron': 'Scheduled jobs'
}

function getRouteInfo(filePath, apiDir) {
  const content = readFileSync(filePath, 'utf-8')
  
  let method = 'GET'
  if (content.includes('export const POST')) method = 'POST'
  else if (content.includes('export async POST')) method = 'POST'
  else if (content.includes('export const GET')) method = 'GET'
  else if (content.includes('export const PUT')) method = 'PUT'
  else if (content.includes('export const DELETE')) method = 'DELETE'
  else if (content.includes('export const PATCH')) method = 'PATCH'
  
  const relativePath = filePath.replace(apiDir + '/', '')
  const pathParts = relativePath.split('/')
  
  let purpose = ''
  for (const [pathKey, pathPurpose] of Object.entries(PURPOSES)) {
    if (relativePath.startsWith(pathKey) || relativePath.includes(pathKey)) {
      purpose = pathPurpose
      break
    }
  }
  
  const filename = filePath.split('/').pop()
  
  return {
    path: relativePath,
    method,
    file: filename,
    description: purpose || 'See endpoint'
  }
}

function groupRoutesByDomain(routes) {
  const grouped = {
    'Health & Diagnostics': [],
    'Admin - Billing': [],
    'Admin - Commerce': [],
    'Admin - Leads': [],
    'Admin - Tenants': [],
    'Storefront': [],
    'Cron Jobs': [],
    'Webhooks': [],
    'Integration': [],
    'Booking': [],
    'Subscriptions': [],
  }
  
  for (const route of routes) {
    const path = route.path.toLowerCase()
    
    if (path.includes('health') || path.includes('diagnostics')) {
      grouped['Health & Diagnostics'].push(route)
    } else if (path.includes('billing')) {
      grouped['Admin - Billing'].push(route)
    } else if (path.includes('commerce')) {
      grouped['Admin - Commerce'].push(route)
    } else if (path.includes('leads')) {
      if (path.includes('admin')) {
        grouped['Admin - Leads'].push(route)
      } else {
        grouped['Storefront'].push(route)
      }
    } else if (path.includes('tenants')) {
      grouped['Admin - Tenants'].push(route)
    } else if (path.includes('storefront')) {
      grouped['Storefront'].push(route)
    } else if (path.includes('subscriptions')) {
      grouped['Subscriptions'].push(route)
    } else if (path.includes('webhooks')) {
      grouped['Webhooks'].push(route)
    } else if (path.includes('cron')) {
      grouped['Cron Jobs'].push(route)
    } else if (path.includes('booking') || path.includes('calendar')) {
      grouped['Booking'].push(route)
    } else if (path.includes('mailchimp') || path.includes('newsletter') || path.includes('outreach') || path.includes('reminders')) {
      grouped['Integration'].push(route)
    } else if (path.includes('properties')) {
      grouped['Property'].push(route)
    } else {
      grouped['Integration'].push(route)
    }
  }
  
  return grouped
}

function main() {
  const apiDir = join(process.cwd(), 'web', 'app', 'api')
  const files = require('fs').readdirSync(apiDir, { recursive: true })
    .filter(f => f.endsWith('route.ts'))
  
  const routes = []
  for (const file of files) {
    const routeInfo = getRouteInfo(apiDir + '/' + file, apiDir)
    routes.push(routeInfo)
  }

  const groupedRoutes = groupRoutesByDomain(routes)
  let markdown = '# API Reference\n\n'
  markdown += 'Every REST API endpoint in `web/app/api/` is documented here. Routes follow Next.js App Router patterns with TypeScript.\n\n'
  markdown += '\n**Total: ' + Object.values(groupedRoutes).flat().length + ' endpoints** across functional domains.\n\n'
  markdown += '\nSee [ARCHITECTURE.md § request lifecycle](../../ARCHITECTURE.md#3-request-lifecycle) for where APIs fit in the pipeline.\n\n'
  markdown += '---\n\n'

  const sortedCategories = Object.keys(groupedRoutes).sort()
  
  for (const category of sortedCategories) {
    const categoryRoutes = groupedRoutes[category].sort((a, b) => a.path.localeCompare(b.path))
    if (categoryRoutes.length === 0) continue

    markdown += '## ' + category + '\n\n'
    markdown += '| Path | Method | File | Purpose |\n'
    markdown += '|---|---|---|\n'

    for (const route of categoryRoutes) {
      markdown += '|' + route.path + '|' + route.method + '|' + route.file + '|' + route.description + '\n'
    }
    markdown += '\n'
  }

  markdown += '---\n\n'
  markdown += '## Conventions\n\n'
  markdown += '- **Route path**: Matches `web/app/api/` directory structure.\n'
  markdown += '- **HTTP method**: Exported as `export const POST = async (req)` or similar.\n'
  markdown += '- **File**: `web/app/api/<domain>/[resource]/route.ts` following Next.js App Router.\n'
  markdown += '- **TypeScript**: All routes are strongly typed with request/response interfaces.\n'
  markdown += '- **Authentication**: Admin routes require `requireAdminUser`, public routes vary by domain.\n'
  markdown += '- **Error handling**: Routes use standardized error responses with proper HTTP status codes.\n'

  markdown += '---\n\n'
  markdown += '_Last generated: ' + new Date().toISOString() + ' — Auto-generated from actual route files._\n'

  const outputPath = join(process.cwd(), 'docs', 'reference', 'API.md')
  writeFileSync(outputPath, markdown, 'utf-8')

  console.log('Generated ' + routes.length + ' route entries to ' + outputPath)
}

main()

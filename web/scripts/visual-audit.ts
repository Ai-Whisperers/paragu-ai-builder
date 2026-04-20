#!/usr/bin/env npx tsx
/**
 * Visual audit — boots Playwright, navigates key routes at desktop + mobile
 * viewports, captures screenshots + basic diagnostics (page errors, failed
 * requests, redirect chain), and writes everything to `/tmp/visual-audit/`.
 *
 * Assumes `npm run dev` is already running on http://localhost:3000.
 *
 * Usage:
 *   npx tsx scripts/visual-audit.ts
 *   BASE_URL=https://paragu-ai.com npx tsx scripts/visual-audit.ts
 */
import { chromium, type Browser, type Page } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const OUT_DIR = '/tmp/visual-audit'
mkdirSync(OUT_DIR, { recursive: true })

interface RouteSpec {
  name: string
  path: string
  note?: string
  /** Skip waiting for networkidle (heavy routes may never settle). */
  fast?: boolean
}

const ROUTES: RouteSpec[] = [
  { name: 'home', path: '/', note: 'Marketing homepage — above fold + scroll sections' },
  { name: 'login', path: '/login', note: 'Login form' },
  {
    name: 'admin-leads-redirect',
    path: '/admin/leads',
    note: 'Should redirect to /login (middleware auth guard)',
    fast: true,
  },
  {
    name: 'health',
    path: '/api/health?deep=1',
    note: 'Observability readiness probe',
    fast: true,
  },
  {
    name: 'business-salon-maria',
    path: '/salon-maria',
    note: 'Flat-pattern tenant — peluqueria demo',
  },
  {
    name: 'business-gymfit',
    path: '/gymfit-py',
    note: 'Flat-pattern tenant — gimnasio demo',
  },
  {
    name: 'nexa-paraguay-es',
    path: '/s/es/nexa-paraguay',
    note: 'Vertical tenant — relocacion, es locale',
  },
  {
    name: 'nexa-paraguay-en',
    path: '/s/en/nexa-paraguay',
    note: 'Vertical tenant — relocacion, en locale',
  },
  {
    name: 'nexa-paraguay-programs',
    path: '/s/es/nexa-paraguay/programas',
    note: 'Vertical tenant — inner page',
  },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

interface RouteResult {
  name: string
  path: string
  viewport: string
  status: number | null
  finalUrl: string
  redirects: string[]
  pageErrors: string[]
  failedRequests: Array<{ url: string; status?: number; failure?: string }>
  consoleWarnings: string[]
  consoleErrors: string[]
  title: string
  screenshot: string
  durationMs: number
  note?: string
}

async function capture(browser: Browser, route: RouteSpec, viewport: typeof VIEWPORTS[number]): Promise<RouteResult> {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    userAgent:
      viewport.name === 'mobile'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined,
  })
  const page = await context.newPage()

  const pageErrors: string[] = []
  const failedRequests: RouteResult['failedRequests'] = []
  const consoleWarnings: string[] = []
  const consoleErrors: string[] = []
  const redirects: string[] = []

  page.on('pageerror', (err) => pageErrors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'warning') consoleWarnings.push(msg.text().slice(0, 200))
    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200))
  })
  page.on('requestfailed', (req) =>
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText }),
  )
  page.on('response', (resp) => {
    if (resp.status() >= 400) {
      failedRequests.push({ url: resp.url(), status: resp.status() })
    }
    // Capture redirect chain
    const req = resp.request()
    for (const r of req.redirectedFrom() ? [req.redirectedFrom()!] : []) {
      redirects.push(`${r.url()} → ${req.url()}`)
    }
  })

  const started = Date.now()
  let status: number | null = null
  try {
    const resp = await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: route.fast ? 'domcontentloaded' : 'load',
      timeout: 30_000,
    })
    status = resp?.status() ?? null
  } catch (err) {
    pageErrors.push(`goto failed: ${err instanceof Error ? err.message : String(err)}`)
  }

  // Settle a little to let CSS + async renders finish
  if (!route.fast) {
    await page.waitForTimeout(1200)
  }

  const screenshotPath = resolve(OUT_DIR, `${route.name}.${viewport.name}.png`)
  try {
    await page.screenshot({ path: screenshotPath, fullPage: true })
  } catch (err) {
    pageErrors.push(`screenshot failed: ${err instanceof Error ? err.message : String(err)}`)
  }

  const title = await page.title().catch(() => '')
  const finalUrl = page.url()
  await context.close()

  return {
    name: route.name,
    path: route.path,
    viewport: viewport.name,
    status,
    finalUrl,
    redirects,
    pageErrors,
    failedRequests,
    consoleWarnings,
    consoleErrors,
    title,
    screenshot: screenshotPath,
    durationMs: Date.now() - started,
    note: route.note,
  }
}

async function main() {
  console.log(`Visual audit of ${BASE_URL} → ${OUT_DIR}`)

  const browser = await chromium.launch({ headless: true })
  const results: RouteResult[] = []

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const r = await capture(browser, route, viewport)
      results.push(r)
      const statusIcon = r.pageErrors.length === 0 && (r.status ?? 0) < 400 ? '✓' : '✗'
      console.log(
        `  ${statusIcon} ${route.name} ${viewport.name.padEnd(7)} status=${r.status} ${r.pageErrors.length}err ${r.consoleErrors.length}cerr ${r.durationMs}ms`,
      )
    }
  }

  await browser.close()

  const summaryPath = resolve(OUT_DIR, 'summary.json')
  writeFileSync(summaryPath, JSON.stringify(results, null, 2))
  console.log(`\nSummary written to ${summaryPath}`)
  console.log(`Screenshots in ${OUT_DIR}/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * Copy each tenant's sites/<slug>/images/ into web/public/sites/<slug>/images/
 * so Next.js serves them as static assets at /sites/<slug>/images/...
 *
 * The images.json manifests emit URLs like
 * `/sites/nexa-paraguay/images/brand/og-default.webp`. Next.js only
 * serves static files out of web/public/, so without this copy step
 * those URLs 404. This has been broken for every tenant with a
 * manifest since day one.
 *
 * Runs as part of `prebuild`. Idempotent — re-syncs on every build.
 * Target dir is gitignored (web/public/sites/); source of truth stays
 * at sites/<slug>/images/.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const sitesRoot = path.join(repoRoot, 'sites')
const publicSitesRoot = path.resolve(__dirname, '../public/sites')

if (!fs.existsSync(sitesRoot)) {
  console.log('[copy-tenant-images] no sites/ dir — skipping')
  process.exit(0)
}

let totalFiles = 0
let totalTenants = 0

for (const tenantSlug of fs.readdirSync(sitesRoot)) {
  const tenantDir = path.join(sitesRoot, tenantSlug)
  if (!fs.statSync(tenantDir).isDirectory()) continue
  const imagesSrc = path.join(tenantDir, 'images')
  if (!fs.existsSync(imagesSrc)) continue

  const imagesDst = path.join(publicSitesRoot, tenantSlug, 'images')
  // Clean rebuild so renamed/deleted source files don't linger.
  fs.rmSync(imagesDst, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(imagesDst), { recursive: true })
  fs.cpSync(imagesSrc, imagesDst, { recursive: true })

  const n = countFiles(imagesDst)
  totalFiles += n
  totalTenants += 1
  console.log(`[copy-tenant-images] ${tenantSlug}: ${n} files`)
}

console.log(`[copy-tenant-images] done — ${totalTenants} tenants, ${totalFiles} files`)

function countFiles(dir) {
  let n = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(path.join(dir, entry.name))
    else n += 1
  }
  return n
}

#!/usr/bin/env node
/**
 * Validate every src/registry/*.type.json against
 * src/schemas/type-registry.schema.json and confirm:
 *  1. JSON Schema shape (required fields present, patterns match).
 *  2. verticalId is a known vertical (per src/verticals/catalog.json).
 *  3. extends target exists in the registry.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import Ajv2020 from 'ajv/dist/2020'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const REGISTRY_DIR = path.join(ROOT, 'src/registry')
const SCHEMA_PATH = path.join(ROOT, 'src/schemas/type-registry.schema.json')
const CATALOG_PATH = path.join(ROOT, 'src/verticals/catalog.json')

const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'))
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8')) as {
  verticals: Record<string, unknown>
}
const validVerticals = new Set(Object.keys(catalog.verticals))

const ajv = new Ajv2020({ allErrors: true, strict: false })
const validate = ajv.compile(schema)

const typeFiles = fs
  .readdirSync(REGISTRY_DIR)
  .filter((f) => f.endsWith('.type.json'))
  .sort()

const typeIds = new Set(typeFiles.map((f) => f.replace(/\.type\.json$/, '')))

let errors = 0
let warnings = 0

for (const file of typeFiles) {
  const filePath = path.join(REGISTRY_DIR, file)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as {
    id?: string
    verticalId?: string
    extends?: string
  }
  const issues: string[] = []

  if (!validate(data)) {
    for (const err of validate.errors || []) {
      issues.push(`schema: ${err.instancePath} ${err.message}`)
    }
  }

  if (data.verticalId && !validVerticals.has(data.verticalId)) {
    issues.push(`verticalId "${data.verticalId}" not in src/verticals/catalog.json`)
  }

  if (data.extends && !typeIds.has(data.extends)) {
    issues.push(`extends "${data.extends}" does not exist in registry`)
  }

  if (data.id && file.replace(/\.type\.json$/, '') !== data.id) {
    issues.push(`filename ${file} does not match id "${data.id}"`)
  }

  if (issues.length) {
    errors++
    console.error(`✗ ${file}`)
    for (const i of issues) console.error(`    ${i}`)
  }
}

console.log(`\n=== Registry validation ===`)
console.log(`  Types checked: ${typeFiles.length}`)
console.log(`  Errors: ${errors}`)
console.log(`  Warnings: ${warnings}`)
if (errors > 0) process.exit(1)
console.log('  ✓ all valid')

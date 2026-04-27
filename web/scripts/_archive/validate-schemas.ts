#!/usr/bin/env npx tsx
/**
 * Validate all business type JSON schemas against the base schema.
 * Ensures every type file properly extends the base and has required fields.
 */

import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

const SCHEMAS_DIR = resolve(__dirname, '../../src/schemas')

function loadJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function main() {
  const files = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.schema.json'))
  let errors = 0

  console.log(`Validating ${files.length} schema files...\n`)

  // Validate base schema exists
  const basePath = resolve(SCHEMAS_DIR, 'base-business.schema.json')
  const base = loadJson(basePath)
  console.log(`✓ base-business.schema.json (${Object.keys(base.properties || {}).length} properties)`)

  // Validate each type schema
  for (const file of files) {
    if (file === 'base-business.schema.json') continue

    const path = resolve(SCHEMAS_DIR, file)
    try {
      const schema = loadJson(path)

      // Check required fields
      if (!schema.$id) {
        console.error(`✗ ${file}: missing $id`)
        errors++
        continue
      }
      if (!schema.allOf || !schema.allOf.some((ref: { $ref?: string }) => ref.$ref === 'base-business')) {
        console.error(`✗ ${file}: does not extend base-business`)
        errors++
        continue
      }

      console.log(`✓ ${file} (type: ${schema.$id})`)
    } catch (e) {
      console.error(`✗ ${file}: ${e instanceof Error ? e.message : 'parse error'}`)
      errors++
    }
  }

  console.log(`\n${files.length} schemas checked, ${errors} errors`)
  process.exit(errors > 0 ? 1 : 0)
}

main()

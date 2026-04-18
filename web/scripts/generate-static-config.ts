#!/usr/bin/env node
/**
 * Generate static-config.ts with embedded JSON content
 * Run this script at build time to regenerate the static config
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Get current file directory (ESM compatible)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the business types to include
const BUSINESS_TYPES = [
  'salon_belleza',
  'peluqueria',
  'gimnasio',
  'spa',
  'barberia',
  'unas',
  'tatuajes',
  'estetica',
  'diseno_grafico',
  'pestanas',
  'depilacion',
  'meal_prep',
  'relocation',
]

// Paths
// From web/scripts/, we go up 2 levels to reach project root (paragu-ai-builder/)
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const REGISTRY_DIR = path.join(PROJECT_ROOT, 'src/registry')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src/content')
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'web/lib/engine/static-config.ts')

/**
 * Read and parse a JSON file
 */
function readJsonFile(filePath: string): unknown {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * Format JSON as a TypeScript object literal with proper indentation
 */
function formatAsTsObject(obj: unknown): string {
  return JSON.stringify(obj, null, 2)
    .replace(/"/g, "'") // Use single quotes
    .replace(/\n/g, '\n  ') // Add indentation
}

/**
 * Generate the TypeScript file content
 */
function generateStaticConfig(): string {
  // Build registry entries
  const registryEntries: string[] = []
  const contentEntries: string[] = []

  for (const type of BUSINESS_TYPES) {
    // Read registry file
    const registryPath = path.join(REGISTRY_DIR, `${type}.type.json`)
    if (fs.existsSync(registryPath)) {
      const registryData = readJsonFile(registryPath)
      registryEntries.push(`  '${type}': ${formatAsTsObject(registryData)}`)
    } else {
      console.warn(`Warning: Registry file not found for ${type}: ${registryPath}`)
    }

    // Read content file
    const contentPath = path.join(CONTENT_DIR, `${type}.content.json`)
    if (fs.existsSync(contentPath)) {
      const contentData = readJsonFile(contentPath)
      contentEntries.push(`  '${type}': ${formatAsTsObject(contentData)}`)
    } else {
      console.warn(`Warning: Content file not found for ${type}: ${contentPath}`)
    }
  }

  const generatedAt = new Date().toISOString()

  return `/**
 * Static config with embedded JSON content
 * Generated at build time - DO NOT EDIT MANUALLY
 * 
 * Generated: ${generatedAt}
 */

export const REGISTRY_MAP: Record<string, unknown> = {
${registryEntries.join(',\n')}
}

export const CONTENT_MAP: Record<string, unknown> = {
${contentEntries.join(',\n')}
}

export function getRegistry(type: string): unknown | null {
  return REGISTRY_MAP[type] || null
}

export function getContent(type: string): unknown | null {
  return CONTENT_MAP[type] || null
}
`
}

/**
 * Main execution
 */
function main(): void {
  console.log('Generating static config...')
  console.log(`Registry dir: ${REGISTRY_DIR}`)
  console.log(`Content dir: ${CONTENT_DIR}`)
  console.log(`Output file: ${OUTPUT_FILE}`)

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Generate and write the file
  const content = generateStaticConfig()
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8')

  console.log(`✓ Generated static-config.ts with ${BUSINESS_TYPES.length} business types`)
  console.log(`  Included: ${BUSINESS_TYPES.join(', ')}`)
}

main()

#!/usr/bin/env node
/**
 * Copy static HTML files from Next.js output to OpenNext assets
 * This ensures tenant pages are served as static files
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = path.join(__dirname, '../.next/server/app')
const DEST_DIR = path.join(__dirname, '../.open-next/assets')

// Business slugs to copy
const BUSINESS_SLUGS = [
  'salon-maria',
  'gymfit-py',
  'spa-serenidad',
  'dayah-litworks',
  'barberia-clasica',
  'tinta-viva',
  'belleza-integral',
  'studio-belleza',
  'pestanas-flore',
  'depilacion-perfecta',
  'unas-y-mas',
  'de-abasto-a-casa',
  'sakura-sushi',
  'kaiten-express',
  'la-trattoria'
]

function copyFile(src, dest) {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    console.log(`✓ Copied: ${path.basename(src)}`)
  } catch (err) {
    console.error(`✗ Failed to copy ${src}:`, err.message)
  }
}

function main() {
  console.log('Copying static HTML files to assets...')
  
  for (const slug of BUSINESS_SLUGS) {
    const htmlFile = path.join(SOURCE_DIR, `${slug}.html`)
    const destFile = path.join(DEST_DIR, `${slug}.html`)
    
    if (fs.existsSync(htmlFile)) {
      copyFile(htmlFile, destFile)
    } else {
      console.warn(`⚠ HTML file not found: ${htmlFile}`)
    }
  }
  
  console.log('Done!')
}

main()
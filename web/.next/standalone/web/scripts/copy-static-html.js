#!/usr/bin/env node
/**
 * Copy static HTML files and images from Next.js output to OpenNext assets
 * This ensures tenant pages and images are served as static files
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = path.join(__dirname, '../.next/server/app')
const PUBLIC_DIR = path.join(__dirname, '../public')
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

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return
  
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath)
    } else {
      copyFile(srcPath, destPath)
    }
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
  
  // Copy images directory
  console.log('\nCopying images to assets...')
  const imagesSource = path.join(PUBLIC_DIR, 'images')
  const imagesDest = path.join(DEST_DIR, 'images')
  
  if (fs.existsSync(imagesSource)) {
    copyDirectory(imagesSource, imagesDest)
    console.log('✓ Images copied successfully')
  } else {
    console.warn('⚠ Images directory not found')
  }
  
  console.log('\nDone!')
}

main()
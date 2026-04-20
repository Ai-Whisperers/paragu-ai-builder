#!/usr/bin/env node
/**
 * One-time migration: add `verticalId` to every src/registry/<id>.type.json.
 * Re-runnable: skips files that already declare `verticalId`.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REGISTRY_DIR = path.resolve(__dirname, '../../src/registry')

const TYPE_TO_VERTICAL: Record<string, string> = {
  // beauty-personal-care
  peluqueria: 'beauty-personal-care',
  barberia: 'beauty-personal-care',
  salon_belleza: 'beauty-personal-care',
  unas: 'beauty-personal-care',
  pestanas: 'beauty-personal-care',
  maquillaje: 'beauty-personal-care',
  depilacion: 'beauty-personal-care',
  estetica: 'beauty-personal-care',
  spa: 'beauty-personal-care',
  tatuajes: 'beauty-personal-care',
  // service-booking
  gimnasio: 'service-booking',
  // food-beverage
  restaurant: 'food-beverage',
  sushi_bar: 'food-beverage',
  kaiten_zushi: 'food-beverage',
  meal_prep: 'food-beverage',
  // portfolio-professional
  diseno_grafico: 'portfolio-professional',
  // health-wellness
  salud: 'health-wellness',
  // education-training
  educacion: 'education-training',
  // b2b-professional
  legal: 'b2b-professional',
  consultoria: 'b2b-professional',
  inversiones: 'b2b-professional',
  // real-estate-relocation
  inmobiliaria: 'real-estate-relocation',
  relocation: 'real-estate-relocation',
}

let changed = 0
let skipped = 0

for (const [typeId, verticalId] of Object.entries(TYPE_TO_VERTICAL)) {
  const filePath = path.join(REGISTRY_DIR, `${typeId}.type.json`)
  if (!fs.existsSync(filePath)) {
    console.warn(`! missing: ${typeId}`)
    continue
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw) as Record<string, unknown>
  if (data.verticalId === verticalId) {
    skipped++
    continue
  }
  // Insert verticalId after `id`, `nameEs`, `nameEn` for readability.
  const reordered: Record<string, unknown> = {}
  for (const key of ['id', 'nameEs', 'nameEn']) {
    if (key in data) reordered[key] = data[key]
  }
  reordered.verticalId = verticalId
  for (const key of Object.keys(data)) {
    if (!(key in reordered)) reordered[key] = data[key]
  }
  fs.writeFileSync(filePath, JSON.stringify(reordered, null, 2) + '\n', 'utf-8')
  changed++
  console.log(`+ tagged ${typeId} → ${verticalId}`)
}

console.log(`\nDone. ${changed} updated, ${skipped} already tagged.`)

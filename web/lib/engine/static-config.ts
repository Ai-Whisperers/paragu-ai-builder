/**
 * Static imports of all registry and content files
 * This ensures they are bundled by the build process
 */

import salonBellezaRegistry from '../../../src/registry/salon_belleza.type.json'
import salonBellezaContent from '../../../src/content/salon_belleza.content.json'

import peluqueriaRegistry from '../../../src/registry/peluqueria.type.json'
import peluqueriaContent from '../../../src/content/peluqueria.content.json'

import gimnasioRegistry from '../../../src/registry/gimnasio.type.json'
import gimnasioContent from '../../../src/content/gimnasio.content.json'

import spaRegistry from '../../../src/registry/spa.type.json'
import spaContent from '../../../src/content/spa.content.json'

import barberiaRegistry from '../../../src/registry/barberia.type.json'
import barberiaContent from '../../../src/content/barberia.content.json'

import unasRegistry from '../../../src/registry/unas.type.json'
import unasContent from '../../../src/content/unas.content.json'

import tatuajesRegistry from '../../../src/registry/tatuajes.type.json'
import tatuajesContent from '../../../src/content/tatuajes.content.json'

import esteticaRegistry from '../../../src/registry/estetica.type.json'
import esteticaContent from '../../../src/content/estetica.content.json'

import disenoGraficoRegistry from '../../../src/registry/diseno_grafico.type.json'
import disenoGraficoContent from '../../../src/content/diseno_grafico.content.json'

import pestanasRegistry from '../../../src/registry/pestanas.type.json'
import pestanasContent from '../../../src/content/pestanas.content.json'

import depilacionRegistry from '../../../src/registry/depilacion.type.json'
import depilacionContent from '../../../src/content/depilacion.content.json'

import mealPrepRegistry from '../../../src/registry/meal_prep.type.json'
import mealPrepContent from '../../../src/content/meal_prep.content.json'

// Registry map
export const REGISTRY_MAP: Record<string, unknown> = {
  'salon_belleza': salonBellezaRegistry,
  'peluqueria': peluqueriaRegistry,
  'gimnasio': gimnasioRegistry,
  'spa': spaRegistry,
  'barberia': barberiaRegistry,
  'unas': unasRegistry,
  'tatuajes': tatuajesRegistry,
  'estetica': esteticaRegistry,
  'diseno_grafico': disenoGraficoRegistry,
  'pestanas': pestanasRegistry,
  'depilacion': depilacionRegistry,
  'meal_prep': mealPrepRegistry,
}

// Content map
export const CONTENT_MAP: Record<string, unknown> = {
  'salon_belleza': salonBellezaContent,
  'peluqueria': peluqueriaContent,
  'gimnasio': gimnasioContent,
  'spa': spaContent,
  'barberia': barberiaContent,
  'unas': unasContent,
  'tatuajes': tatuajesContent,
  'estetica': esteticaContent,
  'diseno_grafico': disenoGraficoContent,
  'pestanas': pestanasContent,
  'depilacion': depilacionContent,
  'meal_prep': mealPrepContent,
}

export function getRegistry(type: string): unknown | null {
  return REGISTRY_MAP[type] || null
}

export function getContent(type: string): unknown | null {
  return CONTENT_MAP[type] || null
}
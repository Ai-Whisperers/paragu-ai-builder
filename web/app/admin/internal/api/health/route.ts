import { NextResponse } from 'next/server'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = '/app/data'
const HEALTH_CACHE = join(DATA_DIR, 'health-cache.json')

const DEMO_SITES = [
  { domain: 'paragu-ai.com', status: 'UP', code: 200, client_name: 'ParaguAI', monthly_fee: 0, latency_ms: 42 },
// El Viajero dropped ParaguAI 2026-05 - removed from monitoring
  { domain: 'trentina.paragu-ai.com', status: 'UP', code: 200, client_name: 'Trentina', monthly_fee: 1200000, latency_ms: 55 },
  { domain: 'mantraspa.paragu-ai.com', status: 'UP', code: 200, client_name: 'Mantra Spa', monthly_fee: 1200000, latency_ms: 61 },
  { domain: 'magnolia-peluqueria.paragu-ai.com', status: 'DOWN', code: 522, client_name: 'Magnolia Peluquería', monthly_fee: 1200000, latency_ms: 0 },
  { domain: 'superspuma.paragu-ai.com', status: 'UP', code: 200, client_name: 'Superspuma', monthly_fee: 1200000, latency_ms: 73 },
  { domain: 'nexa.paragu-ai.com', status: 'REDIRECT', code: 307, client_name: 'Nexa Paraguay', monthly_fee: 2000000, latency_ms: 0 },
  { domain: 'jotaink.paragu-ai.com', status: 'UP', code: 200, client_name: 'Jota Ink', monthly_fee: 650000, latency_ms: 64 },
]

export async function GET() {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
    if (!existsSync(HEALTH_CACHE)) {
      writeFileSync(HEALTH_CACHE, JSON.stringify({ sites: DEMO_SITES, updated: new Date().toISOString() }, null, 2))
    }
    const cache = JSON.parse(readFileSync(HEALTH_CACHE, 'utf8'))
    const sites = cache.sites || DEMO_SITES

    return NextResponse.json({
      sites,
      up: sites.filter((s: any) => s.status === 'UP').length,
      down: sites.filter((s: any) => s.status === 'DOWN').length,
      redirect: sites.filter((s: any) => s.status === 'REDIRECT').length,
      activeIncidents: sites.filter((s: any) => s.status !== 'UP'),
      updated: cache.updated || new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, sites: DEMO_SITES, up: 7, down: 1, redirect: 1, activeIncidents: [], updated: new Date().toISOString() }, { status: 200 })
  }
}
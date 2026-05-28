import { NextResponse } from 'next/server'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = '/app/data'
const CLIENTS_FILE = join(DATA_DIR, 'clients.json')

const seed = {
  clients: [
    { id: 1, name: 'Magnolia Peluquería', domain: 'magnolia-peluqueria.paragu-ai.com', plan: 'Profesional', status: 'active', monthly_fee: 1200000, billing_cycle_day: 1, notes: 'Peor estado visual, necesita revisión completa' },
    { id: 2, name: 'Mantra Spa', domain: 'mantraspa.paragu-ai.com', plan: 'Profesional', status: 'active', monthly_fee: 1200000, billing_cycle_day: 1, notes: '' },
    { id: 3, name: 'Nexa Paraguay', domain: 'nexa.paragu-ai.com', plan: 'Empresa', status: 'active', monthly_fee: 2000000, billing_cycle_day: 1, notes: '' },
    { id: 4, name: 'Superspuma', domain: 'superspuma.paragu-ai.com', plan: 'Profesional', status: 'trial', monthly_fee: 1200000, billing_cycle_day: 1, trial_end_date: '2026-06-01', notes: 'prioridad alta' },
    { id: 5, name: 'Trentina', domain: 'trentina.paragu-ai.com', plan: 'Profesional', status: 'active', monthly_fee: 1200000, billing_cycle_day: 10, notes: 'Cervecería artesanal Santa Rita' },
    { id: 6, name: 'Reina de Copas', domain: 'reina-de-copas.paragu-ai.com', plan: 'Autónomo', status: 'active', monthly_fee: 650000, billing_cycle_day: 1, notes: 'Salud femenina, copas menstruales' },
    { id: 7, name: 'El Gato Siamés', domain: 'elgatosiames.paragu-ai.com', plan: 'Autónomo', status: 'active', monthly_fee: 650000, billing_cycle_day: 1, notes: 'Stand up comedy, entretenimiento' },
  ]
}

function loadJson(path: string, fallback: any) {
  try { if (existsSync(path)) return JSON.parse(readFileSync(path, 'utf8')) } catch {}
  return fallback
}

function loadData() {
  if (!existsSync(DATA_DIR)) {
    try { require('fs').mkdirSync(DATA_DIR, { recursive: true }) } catch {}
  }
  if (!existsSync(CLIENTS_FILE)) writeFileSync(CLIENTS_FILE, JSON.stringify(seed, null, 2))
  return JSON.parse(readFileSync(CLIENTS_FILE, 'utf8'))
}

function saveData(data: any) { writeFileSync(CLIENTS_FILE, JSON.stringify(data, null, 2)) }

export async function GET() {
  try {
    const raw = loadData()
    const healthCache = loadJson(join(DATA_DIR, 'health-cache.json'), { sites: [] })

    const today = new Date()
    const enriched = raw.clients.map((c: any) => {
      const mrr = Number(c.monthly_fee || 0)
      const isActive = c.status === 'active'
      const isTrial = c.status === 'trial'
      const billDay = parseInt(c.billing_cycle_day || '1', 10)
      const dueDate = new Date(today.getFullYear(), today.getMonth() - (today.getDate() <= billDay ? 1 : 0), billDay)
      const daysSinceDue = Math.floor((today.getTime() - dueDate.getTime()) / 86400000)
      const overdue = isActive && daysSinceDue > 0
      const hEntry = (healthCache.sites || []).find((s: any) => s.domain === c.domain)
      return {
        ...c,
        daysSinceDue: overdue ? daysSinceDue : 0,
        siteStatus: hEntry?.status || 'UP',
      }
    })

    return NextResponse.json({
      clients: enriched,
      total: enriched.length,
      active: enriched.filter((c: any) => c.status === 'active').length,
      trial: enriched.filter((c: any) => c.status === 'trial').length,
      trialEndingSoon: enriched.filter((c: any) => c.status === 'trial' && c.trial_end_date && (Math.ceil((new Date(c.trial_end_date).getTime() - today.getTime()) / 86400000)) <= 7).length,
      overdue: enriched.filter((c: any) => c.daysSinceDue > 0).length,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = loadData()
    const newClient = {
      id: Date.now(),
      name: body.name || '',
      domain: body.domain || '',
      plan: body.plan || 'Profesional',
      status: body.status || 'trial',
      monthly_fee: Number(body.monthly_fee) || 0,
      billing_cycle_day: Number(body.billing_cycle_day) || 1,
      next_billing: body.next_billing || '',
      trial_end_date: body.trial_end_date || '',
      notes: body.notes || '',
    }
    raw.clients.push(newClient)
    saveData(raw)
    return NextResponse.json({ success: true, client: newClient })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = '/app/data'
const INCIDENTS_FILE = join(DATA_DIR, 'incidents.json')

const seed = [
  { id: 'inc-1', domain: 'magnolia-peluqueria.paragu-ai.com', severity: 'P1', status: 'active', started_at: '2026-05-27T10:00:00Z', acknowledged_at: null, resolved_at: null },
  { id: 'inc-2', domain: 'nexa.paragu-ai.com', severity: 'P2', status: 'active', started_at: '2026-05-26T14:00:00Z', acknowledged_at: '2026-05-26T15:30:00Z', resolved_at: null },
]

function loadIncidents() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(INCIDENTS_FILE)) writeFileSync(INCIDENTS_FILE, JSON.stringify({ incidents: seed }, null, 2))
  return JSON.parse(readFileSync(INCIDENTS_FILE, 'utf8'))
}
function saveIncidents(data: any) { writeFileSync(INCIDENTS_FILE, JSON.stringify(data, null, 2)) }

export async function GET() {
  try {
    const data = loadIncidents()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ incidents: [] })
  }
}
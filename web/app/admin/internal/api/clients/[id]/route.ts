import { NextResponse } from 'next/server'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = '/app/data'
const CLIENTS_FILE = join(DATA_DIR, 'clients.json')

function loadData() {
  return JSON.parse(readFileSync(CLIENTS_FILE, 'utf8'))
}
function saveData(data: any) { writeFileSync(CLIENTS_FILE, JSON.stringify(data, null, 2)) }

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const raw = loadData()
  const client = raw.clients.find((c: any) => c.id == params.id)
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ client })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const raw = loadData()
    const idx = raw.clients.findIndex((c: any) => c.id == params.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    raw.clients[idx] = { ...raw.clients[idx], ...body }
    saveData(raw)
    return NextResponse.json({ success: true, client: raw.clients[idx] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const raw = loadData()
    const idx = raw.clients.findIndex((c: any) => c.id == params.id)
    if (idx !== -1) {
      raw.clients[idx].status = 'deleted'
      saveData(raw)
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
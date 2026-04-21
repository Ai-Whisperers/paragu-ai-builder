/**
 * Lead Notes API
 *
 * CRUD operations for lead notes:
 * - GET: Retrieve all notes for a lead
 * - POST: Add a new note
 * - PATCH: Update a note
 * - DELETE: Remove a note
 *
 * All mutations require an authenticated admin (env-allowlist via
 * `lib/auth/admin.ts#checkAdmin`). GET is admin-only too — notes can
 * contain customer-private intel.
 *
 * Storage is currently an in-memory Map keyed by leadId. This survives
 * within a single container lifetime; restart loses notes. A real
 * `lead_notes` table is the next iteration.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { checkAdmin } from '@/lib/auth/admin'

export const runtime = 'nodejs'

const NoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000, 'Note too long'),
  type: z.enum(['general', 'call', 'meeting', 'email', 'whatsapp', 'internal']).default('general'),
  isPrivate: z.boolean().default(false),
})

const UpdateNoteSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  type: z.enum(['general', 'call', 'meeting', 'email', 'whatsapp', 'internal']).optional(),
  isPrivate: z.boolean().optional(),
})

interface LeadNote {
  id: string
  leadId: string
  content: string
  type: string
  isPrivate: boolean
  createdBy: string
  createdAt: string
  updatedAt?: string
}

const notesStore = new Map<string, LeadNote[]>()

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export const GET = withRequestLog<{ id: string }>(async (_request, _ctx, { id: leadId }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }
  if (!leadId) {
    return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
  }
  const notes = (notesStore.get(leadId) || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return NextResponse.json({ success: true, data: notes, count: notes.length })
})

export const POST = withRequestLog<{ id: string }>(async (request, { log }, { id: leadId }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }
  if (!leadId) {
    return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const validated = NoteSchema.safeParse(body)
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const note: LeadNote = {
    id: generateId(),
    leadId,
    ...validated.data,
    createdBy: auth.user.email ?? auth.user.id,
    createdAt: new Date().toISOString(),
  }
  const existing = notesStore.get(leadId) || []
  existing.push(note)
  notesStore.set(leadId, existing)
  log.info('leads.notes.created', { leadId, noteId: note.id, type: note.type })
  return NextResponse.json({ success: true, data: note }, { status: 201 })
})

export const PATCH = withRequestLog<{ id: string }>(async (request, { log }, { id: leadId }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }
  const body = await request.json().catch(() => ({}))
  const { noteId, ...updates } = body as { noteId?: string } & Record<string, unknown>
  if (!leadId || !noteId) {
    return NextResponse.json({ error: 'Lead ID and Note ID are required' }, { status: 400 })
  }
  const validated = UpdateNoteSchema.safeParse(updates)
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
      { status: 400 },
    )
  }
  const notes = notesStore.get(leadId) || []
  const idx = notes.findIndex((n) => n.id === noteId)
  if (idx === -1) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }
  notes[idx] = { ...notes[idx], ...validated.data, updatedAt: new Date().toISOString() }
  log.info('leads.notes.updated', { leadId, noteId })
  return NextResponse.json({ success: true, data: notes[idx] })
})

export const DELETE = withRequestLog<{ id: string }>(async (request, { log }, { id: leadId }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }
  const noteId = new URL(request.url).searchParams.get('noteId')
  if (!leadId || !noteId) {
    return NextResponse.json({ error: 'Lead ID and Note ID are required' }, { status: 400 })
  }
  const notes = notesStore.get(leadId) || []
  const filtered = notes.filter((n) => n.id !== noteId)
  if (filtered.length === notes.length) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }
  notesStore.set(leadId, filtered)
  log.info('leads.notes.deleted', { leadId, noteId })
  return NextResponse.json({ success: true })
})

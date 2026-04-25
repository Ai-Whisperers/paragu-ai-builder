/**
 * Reminders API
 *
 * Manage follow-up reminders:
 * - GET: List reminders (optionally filtered by lead or status)
 * - POST: Create a new reminder
 * - PATCH: Update reminder status
 * - DELETE: Remove a reminder
 *
 * All methods admin-only via `checkAdmin()` — these are internal CRM data.
 *
 * Storage is currently in-memory `Map`s (one keyed by leadId, one by
 * reminderId). Survives within a container lifetime; restart loses data.
 * A real `reminders` table is the next iteration.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { checkAdmin } from '@/lib/auth/admin'

export const runtime = 'nodejs'

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/

const CreateReminderSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  type: z.enum(['follow_up', 'meeting', 'payment', 'onboarding', 'custom']),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().regex(isoDateRegex, 'Invalid date format'),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  metadata: z.object({}).passthrough().optional(),
})

const UpdateReminderSchema = z.object({
  status: z.enum(['pending', 'completed', 'snoozed', 'cancelled']).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().regex(isoDateRegex, 'Invalid date format').optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  snoozeDays: z.number().int().min(1).max(30).optional(),
})

interface Reminder {
  id: string
  leadId: string
  type: string
  title: string
  description?: string
  dueDate: string
  status: string
  priority: string
  createdAt: string
  completedAt?: string
  snoozedUntil?: string
  metadata?: Record<string, unknown>
}

const remindersByLead = new Map<string, Reminder[]>()
const reminderById = new Map<string, Reminder>()

function generateId(): string {
  return `rem-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export const GET = withRequestLog(async (request) => {
  const auth = await checkAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status })

  const { searchParams } = new URL(request.url)
  const leadId = searchParams.get('leadId')
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const type = searchParams.get('type')
  const overdue = searchParams.get('overdue') === 'true'
  const upcoming = searchParams.get('upcoming')

  let reminders = Array.from(reminderById.values())
  if (leadId) reminders = reminders.filter((r) => r.leadId === leadId)
  if (status) reminders = reminders.filter((r) => r.status === status)
  if (priority) reminders = reminders.filter((r) => r.priority === priority)
  if (type) reminders = reminders.filter((r) => r.type === type)

  if (overdue) {
    const now = new Date().toISOString()
    reminders = reminders.filter((r) => r.status === 'pending' && r.dueDate < now)
  }

  if (upcoming) {
    const days = parseInt(upcoming, 10) || 7
    const now = new Date()
    const cutoff = new Date(now)
    cutoff.setDate(cutoff.getDate() + days)
    reminders = reminders.filter((r) => {
      const due = new Date(r.dueDate)
      return r.status === 'pending' && due >= now && due <= cutoff
    })
  }

  reminders.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  const now = new Date().toISOString()
  const stats = {
    total: reminders.length,
    pending: reminders.filter((r) => r.status === 'pending').length,
    completed: reminders.filter((r) => r.status === 'completed').length,
    overdue: reminders.filter((r) => r.status === 'pending' && r.dueDate < now).length,
    highPriority: reminders.filter((r) => r.priority === 'high' && r.status === 'pending').length,
  }

  return NextResponse.json({ success: true, data: reminders, stats, count: reminders.length })
})

export const POST = withRequestLog(async (request, { log }) => {
  const auth = await checkAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status })

  const body = await request.json().catch(() => null)
  const validated = CreateReminderSchema.safeParse(body)
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const reminder: Reminder = {
    id: generateId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...validated.data,
  }

  const leadReminders = remindersByLead.get(reminder.leadId) || []
  leadReminders.push(reminder)
  remindersByLead.set(reminder.leadId, leadReminders)
  reminderById.set(reminder.id, reminder)

  log.info('reminders.created', { reminderId: reminder.id, leadId: reminder.leadId, type: reminder.type })
  return NextResponse.json({ success: true, data: reminder }, { status: 201 })
})

export const PATCH = withRequestLog(async (request, { log }) => {
  const auth = await checkAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status })

  const reminderId = new URL(request.url).searchParams.get('id')
  if (!reminderId) {
    return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))
  const validated = UpdateReminderSchema.safeParse(body)
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const reminder = reminderById.get(reminderId)
  if (!reminder) {
    return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
  }
  const updates = validated.data

  if (updates.status === 'snoozed' && updates.snoozeDays) {
    const snoozedUntil = new Date()
    snoozedUntil.setDate(snoozedUntil.getDate() + updates.snoozeDays)
    reminder.snoozedUntil = snoozedUntil.toISOString()
  }
  if (updates.status === 'completed') {
    reminder.completedAt = new Date().toISOString()
  }
  if (updates.title) reminder.title = updates.title
  if (updates.description !== undefined) reminder.description = updates.description
  if (updates.dueDate) reminder.dueDate = updates.dueDate
  if (updates.priority) reminder.priority = updates.priority
  if (updates.status) reminder.status = updates.status

  // Mirror into the per-lead bucket.
  const leadReminders = remindersByLead.get(reminder.leadId) || []
  const idx = leadReminders.findIndex((r) => r.id === reminderId)
  if (idx !== -1) {
    leadReminders[idx] = { ...reminder }
    remindersByLead.set(reminder.leadId, leadReminders)
  }
  reminderById.set(reminderId, reminder)

  log.info('reminders.updated', { reminderId, status: reminder.status })
  return NextResponse.json({ success: true, data: reminder })
})

export const DELETE = withRequestLog(async (request, { log }) => {
  const auth = await checkAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status })

  const reminderId = new URL(request.url).searchParams.get('id')
  if (!reminderId) {
    return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 })
  }

  const reminder = reminderById.get(reminderId)
  if (!reminder) {
    return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
  }

  reminderById.delete(reminderId)
  const leadReminders = remindersByLead.get(reminder.leadId) || []
  const filtered = leadReminders.filter((r) => r.id !== reminderId)
  if (filtered.length === 0) {
    remindersByLead.delete(reminder.leadId)
  } else {
    remindersByLead.set(reminder.leadId, filtered)
  }

  log.info('reminders.deleted', { reminderId, leadId: reminder.leadId })
  return NextResponse.json({ success: true })
})

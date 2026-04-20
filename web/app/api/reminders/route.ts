/**
 * Reminders API
 * 
 * Manage follow-up reminders:
 * - GET: List reminders (optionally filtered by lead or status)
 * - POST: Create a new reminder
 * - PATCH: Update reminder status
 * - DELETE: Remove a reminder
 */
import { logger } from '@/lib/logger'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ReminderScheduler, DEFAULT_REMINDER_SCHEDULES } from '@/lib/reminders/scheduler'

export const runtime = 'nodejs'

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/

const CreateReminderSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  type: z.enum(['follow_up', 'meeting', 'payment', 'onboarding', 'custom']),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().regex(isoDateRegex, 'Invalid date format'),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  metadata: z.object({}).passthrough().optional()
})

const UpdateReminderSchema = z.object({
  status: z.enum(['pending', 'completed', 'snoozed', 'cancelled']).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().regex(isoDateRegex, 'Invalid date format').optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  snoozeDays: z.number().int().min(1).max(30).optional()
})

// In-memory storage for demo (replace with database in production)
const remindersStore = new Map<string, Array<{
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
}>>()

// Global reminder index for quick lookup
const allReminders = new Map<string, {
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
}>()

function generateId(): string {
  return `rem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const scheduler = new ReminderScheduler(DEFAULT_REMINDER_SCHEDULES)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const type = searchParams.get('type')
    const overdue = searchParams.get('overdue') === 'true'
    const upcoming = searchParams.get('upcoming')
    
    let reminders = Array.from(allReminders.values())
    
    // Apply filters
    if (leadId) {
      reminders = reminders.filter(r => r.leadId === leadId)
    }
    
    if (status) {
      reminders = reminders.filter(r => r.status === status)
    }
    
    if (priority) {
      reminders = reminders.filter(r => r.priority === priority)
    }
    
    if (type) {
      reminders = reminders.filter(r => r.type === type)
    }
    
    if (overdue) {
      const now = new Date().toISOString()
      reminders = reminders.filter(r => 
        r.status === 'pending' && r.dueDate < now
      )
    }
    
    if (upcoming) {
      const days = parseInt(upcoming, 10) || 7
      const now = new Date()
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() + days)
      
      reminders = reminders.filter(r => {
        const dueDate = new Date(r.dueDate)
        return r.status === 'pending' && 
               dueDate >= now && 
               dueDate <= cutoff
      })
    }
    
    // Sort by due date, pending first
    reminders.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    // Calculate stats
    const now = new Date().toISOString()
    const stats = {
      total: reminders.length,
      pending: reminders.filter(r => r.status === 'pending').length,
      completed: reminders.filter(r => r.status === 'completed').length,
      overdue: reminders.filter(r => r.status === 'pending' && r.dueDate < now).length,
      highPriority: reminders.filter(r => r.priority === 'high' && r.status === 'pending').length
    }

    return NextResponse.json({
      success: true,
      data: reminders,
      stats,
      count: reminders.length
    })
  } catch (error) {
    logger.error('Failed to fetch reminders', { action: 'reminders.list', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = CreateReminderSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validated.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const { leadId, type, title, description, dueDate, priority, metadata } = validated.data

    const reminder = {
      id: generateId(),
      leadId,
      type,
      title,
      description,
      dueDate,
      status: 'pending',
      priority,
      createdAt: new Date().toISOString(),
      metadata
    }

    // Store in lead-specific array
    const leadReminders = remindersStore.get(leadId) || []
    leadReminders.push(reminder)
    remindersStore.set(leadId, leadReminders)
    
    // Store in global index
    allReminders.set(reminder.id, reminder)

    return NextResponse.json({
      success: true,
      data: reminder,
      message: 'Reminder created successfully'
    }, { status: 201 })
  } catch (error) {
    logger.error('Failed to create reminder', { action: 'reminders.create', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reminderId = searchParams.get('id')
    
    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validated = UpdateReminderSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validated.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const reminder = allReminders.get(reminderId)
    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      )
    }

    const updates = validated.data
    
    // Handle snooze
    if (updates.status === 'snoozed' && updates.snoozeDays) {
      const snoozedUntil = new Date()
      snoozedUntil.setDate(snoozedUntil.getDate() + updates.snoozeDays)
      reminder.snoozedUntil = snoozedUntil.toISOString()
    }
    
    // Handle completion
    if (updates.status === 'completed') {
      reminder.completedAt = new Date().toISOString()
    }
    
    // Update fields
    if (updates.title) reminder.title = updates.title
    if (updates.description !== undefined) reminder.description = updates.description
    if (updates.dueDate) reminder.dueDate = updates.dueDate
    if (updates.priority) reminder.priority = updates.priority
    if (updates.status) reminder.status = updates.status

    // Update in lead-specific array too
    const leadReminders = remindersStore.get(reminder.leadId) || []
    const index = leadReminders.findIndex(r => r.id === reminderId)
    if (index !== -1) {
      leadReminders[index] = { ...reminder }
      remindersStore.set(reminder.leadId, leadReminders)
    }
    
    allReminders.set(reminderId, reminder)

    return NextResponse.json({
      success: true,
      data: reminder,
      message: 'Reminder updated successfully'
    })
  } catch (error) {
    logger.error('Failed to update reminder', { action: 'reminders.update', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reminderId = searchParams.get('id')
    
    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      )
    }

    const reminder = allReminders.get(reminderId)
    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      )
    }

    // Remove from global index
    allReminders.delete(reminderId)
    
    // Remove from lead-specific array
    const leadReminders = remindersStore.get(reminder.leadId) || []
    const filtered = leadReminders.filter(r => r.id !== reminderId)
    if (filtered.length === 0) {
      remindersStore.delete(reminder.leadId)
    } else {
      remindersStore.set(reminder.leadId, filtered)
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted successfully'
    })
  } catch (error) {
    logger.error('Failed to delete reminder', { action: 'reminders.delete', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    )
  }
}

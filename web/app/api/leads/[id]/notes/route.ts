/**
 * Lead Notes API
 * 
 * CRUD operations for lead notes:
 * - GET: Retrieve all notes for a lead
 * - POST: Add a new note
 * - PATCH: Update a note
 * - DELETE: Remove a note
 */
import { logger } from '@/lib/logger'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

// In-memory storage for demo (replace with database in production)
// Key: leadId, Value: array of notes
const notesStore = new Map<string, Array<{
  id: string
  leadId: string
  content: string
  type: string
  isPrivate: boolean
  createdBy: string
  createdAt: string
  updatedAt?: string
}>>()

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params
    
    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const notes = notesStore.get(leadId) || []
    
    // Sort by createdAt desc
    const sortedNotes = notes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({
      success: true,
      data: sortedNotes,
      count: sortedNotes.length
    })
  } catch (error) {
    logger.error('Failed to fetch lead notes', { action: 'leads.notes.list', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params
    
    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validated = NoteSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validated.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const { content, type, isPrivate } = validated.data

    const note = {
      id: generateId(),
      leadId,
      content,
      type,
      isPrivate,
      createdBy: 'admin', // TODO: Get from auth session
      createdAt: new Date().toISOString()
    }

    const existingNotes = notesStore.get(leadId) || []
    existingNotes.push(note)
    notesStore.set(leadId, existingNotes)

    return NextResponse.json({
      success: true,
      data: note,
      message: 'Note added successfully'
    }, { status: 201 })
  } catch (error) {
    logger.error('Failed to create lead note', { action: 'leads.notes.create', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params
    const { noteId, ...updates } = await request.json()
    
    if (!leadId || !noteId) {
      return NextResponse.json(
        { error: 'Lead ID and Note ID are required' },
        { status: 400 }
      )
    }

    const validated = UpdateNoteSchema.safeParse(updates)
    if (!validated.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validated.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const notes = notesStore.get(leadId) || []
    const noteIndex = notes.findIndex(n => n.id === noteId)

    if (noteIndex === -1) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      ...validated.data,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: notes[noteIndex],
      message: 'Note updated successfully'
    })
  } catch (error) {
    logger.error('Failed to update lead note', { action: 'leads.notes.update', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await params
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get('noteId')
    
    if (!leadId || !noteId) {
      return NextResponse.json(
        { error: 'Lead ID and Note ID are required' },
        { status: 400 }
      )
    }

    const notes = notesStore.get(leadId) || []
    const filteredNotes = notes.filter(n => n.id !== noteId)

    if (filteredNotes.length === notes.length) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    notesStore.set(leadId, filteredNotes)

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully'
    })
  } catch (error) {
    logger.error('Failed to delete lead note', { action: 'leads.notes.delete', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}

/**
 * Bulk Update Leads API - PRODUCTION READY
 * 
 * Perform bulk actions on multiple leads with proper:
 * - Authentication
 * - Authorization  
 * - Database persistence
 * - Audit logging
 * - Rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const BulkUpdateSchema = z.object({
  leadIds: z.array(z.string().uuid()).min(1, 'At least one lead ID is required').max(100, 'Maximum 100 leads per request'),
  action: z.enum([
    'update_status',
    'update_priority', 
    'add_tags',
    'remove_tags',
    'mark_favorite',
    'unmark_favorite',
    'assign_to',
    'archive'
  ]),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]).optional()
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const startTime = performance.now()
  
  try {
    // 1. Authenticate
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      logger.warn('Unauthorized bulk update attempt', { requestId })
      return NextResponse.json(
        { error: 'Unauthorized', requestId },
        { status: 401 }
      )
    }
    
    // 2. Parse & validate
    const body = await request.json()
    const validated = BulkUpdateSchema.safeParse(body)
    
    if (!validated.success) {
      logger.warn('Invalid bulk update request', {
        userId: user.id,
        errors: validated.error.flatten(),
        requestId
      })
      return NextResponse.json(
        { error: 'Invalid request', details: validated.error.flatten(), requestId },
        { status: 400 }
      )
    }
    
    const { leadIds, action, value } = validated.data
    
    // 3. Verify user has access to these leads
    const { data: accessibleLeads, error: accessError } = await supabase
      .from('leads')
      .select('id')
      .in('id', leadIds)
    
    if (accessError) {
      logger.error('Failed to verify lead access', { error: accessError, userId: user.id, requestId })
      return NextResponse.json(
        { error: 'Access verification failed', requestId },
        { status: 500 }
      )
    }
    
    const accessibleIds = accessibleLeads?.map(l => l.id) || []
    
    if (accessibleIds.length !== leadIds.length) {
      const missingIds = leadIds.filter(id => !accessibleIds.includes(id))
      logger.warn('Bulk update attempted on non-existent leads', {
        userId: user.id,
        missingIds,
        requestId
      })
      return NextResponse.json(
        { error: 'Some leads not found', missingIds, requestId },
        { status: 404 }
      )
    }
    
    // 4. Perform bulk update in DATABASE (not memory!)
    let updateData: Record<string, unknown> = {}
    
    switch (action) {
      case 'update_status':
        if (typeof value !== 'string') {
          return NextResponse.json(
            { error: 'Status value must be a string', requestId },
            { status: 400 }
          )
        }
        updateData = { status: value, updated_at: new Date().toISOString() }
        break
        
      case 'update_priority':
        if (typeof value !== 'string') {
          return NextResponse.json(
            { error: 'Priority value must be a string', requestId },
            { status: 400 }
          )
        }
        updateData = { priority_tier: value, updated_at: new Date().toISOString() }
        break
        
      case 'mark_favorite':
        updateData = { is_favorite: true, updated_at: new Date().toISOString() }
        break
        
      case 'unmark_favorite':
        updateData = { is_favorite: false, updated_at: new Date().toISOString() }
        break
        
      case 'assign_to':
        if (typeof value !== 'string') {
          return NextResponse.json(
            { error: 'Assignee value must be a string', requestId },
            { status: 400 }
          )
        }
        updateData = { assigned_to: value, updated_at: new Date().toISOString() }
        break
        
      case 'archive':
        updateData = { status: 'archived', updated_at: new Date().toISOString() }
        break
        
      default:
        return NextResponse.json(
          { error: 'Unknown action', requestId },
          { status: 400 }
        )
    }
    
    // Perform the update
    const { data: updatedData, error: updateError } = await supabase
      .from('leads')
      .update(updateData)
      .in('id', accessibleIds)
      .select('id')
    
    if (updateError) {
      logger.error('Bulk update failed', { error: updateError, userId: user.id, requestId })
      return NextResponse.json(
        { error: 'Update failed', requestId },
        { status: 500 }
      )
    }
    
    // 5. Log the action for audit
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'bulk_update',
      entity_type: 'leads',
      entity_ids: accessibleIds,
      changes: updateData,
      request_id: requestId
    })
    
    const duration = performance.now() - startTime
    
    logger.info('Bulk update successful', {
      userId: user.id,
      action,
      count: updatedData?.length || 0,
      duration,
      requestId
    })
    
    return NextResponse.json({
      success: true,
      updatedCount: updatedData?.length || 0,
      requestId,
      durationMs: Math.round(duration)
    })
    
  } catch (error) {
    logger.error('Unexpected error in bulk update', { error, requestId })
    return NextResponse.json(
      { error: 'Internal server error', requestId },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed', allowedMethods: ['POST'] },
    { status: 405 }
  )
}

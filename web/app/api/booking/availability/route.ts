import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const staffId = searchParams.get('staffId')
    const duration = parseInt(searchParams.get('duration') || '30')
    
    if (!date || !staffId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Call the database function to get available slots
    const { data: slots, error } = await supabase.rpc('get_available_slots', {
      p_date: date,
      p_staff_member_id: staffId,
      p_duration_minutes: duration,
    })
    
    if (error) {
      logger.error('booking/availability: rpc failed', { error: String(error) })
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: 500 }
      )
    }

    return NextResponse.json({ slots })
  } catch (error) {
    logger.error('booking/availability: unexpected', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

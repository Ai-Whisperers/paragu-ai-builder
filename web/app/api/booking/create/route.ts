import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      business_slug,
      service_id,
      staff_member_id,
      booking_date,
      booking_time,
      customer_name,
      customer_phone,
      customer_email,
      customer_notes,
      duration_minutes,
    } = body
    
    // Validate required fields
    if (!business_slug || !service_id || !staff_member_id || !booking_date || !booking_time || !customer_name || !customer_phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Get business ID from slug
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', business_slug)
      .single()
    
    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }
    
    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        business_id: business.id,
        service_id,
        staff_member_id,
        booking_date,
        booking_time,
        customer_name,
        customer_phone,
        customer_email,
        customer_notes,
        duration_minutes,
        status: 'pending',
      })
      .select()
      .single()
    
    if (error) {
      // Check for unique constraint violation (double booking)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Este horario ya no está disponible. Por favor selecciona otro.' },
          { status: 409 }
        )
      }
      
      logger.error('Error creating booking:', error)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }
    
    // TODO: Send confirmation WhatsApp/email
    
    logger.info('Booking created', { booking_id: booking.id, business_id: business.id })
    
    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Reserva creada exitosamente'
    })
  } catch (error) {
    logger.error('Error in create booking API', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

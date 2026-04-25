import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { resendAdapter } from '@/lib/integrations/email/resend'
import { bookingConfirmationEmail } from '@/lib/commerce/email-templates'
import { sendText, notifyNewBooking } from '@/lib/integrations/whatsapp/evolution'

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

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, phone, whatsapp, whatsapp_instance')
      .eq('slug', business_slug)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('name')
      .eq('id', service_id)
      .single()

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
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

    // Notify business owner via WhatsApp (Evolution API)
    const ownerPhone = business.phone || business.whatsapp
    const waInstance = (business as Record<string, unknown>).whatsapp_instance as string | undefined
    if (waInstance && ownerPhone) {
      notifyNewBooking(waInstance, ownerPhone, {
        customerName: customer_name,
        customerPhone: customer_phone,
        service: service?.name || 'No especificado',
        date: booking_date,
        time: booking_time,
      }).then(r => {
        if (r.error) logger.warn('Evolution API notification failed', { error: r.error })
      })
    } else if (ownerPhone) {
      const waUrl = `https://wa.me/${ownerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`🆕 Nueva reserva en ${business.name}! 👤 ${customer_name} 📅 ${booking_date} ⏰ ${booking_time}`)}`
      logger.info('Booking fallback WhatsApp link', { action: 'booking.notify_wa', business_id: business.id })
    }

    if (process.env.EMAIL_TRANSACTIONAL_KEY && process.env.EMAIL_FROM_ADDRESS && customer_email) {
      const emailConfig = {
        transactionalApiKey: process.env.EMAIL_TRANSACTIONAL_KEY,
        fromAddress: process.env.EMAIL_FROM_ADDRESS,
        fromName: business.name,
      }
      const emailTemplate = bookingConfirmationEmail({
        customerName: customer_name,
        customerEmail: customer_email,
        businessName: business.name,
        serviceName: service.name,
        bookingDate: booking_date,
        bookingTime: booking_time,
        bookingId: booking.id,
      })
      const emailResult = await resendAdapter.sendTransactional(
        customer_email,
        emailTemplate.subject,
        emailTemplate.html,
        emailConfig,
      )
      if (!emailResult.ok) {
        logger.warn('Booking confirmation email failed', { error: emailResult.error, booking_id: booking.id })
      }
    } else {
      logger.warn('Booking confirmation email not sent: EMAIL_TRANSACTIONAL_KEY or EMAIL_FROM_ADDRESS not configured or no customer email')
    }

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

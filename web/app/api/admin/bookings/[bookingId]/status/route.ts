import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { requireAdminUser } from '@/lib/commerce/admin-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const user = await requireAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bookingId } = await params
  const formData = await request.formData()
  const status = formData.get('status') as string

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const updateData: Record<string, string | null> = { status }
  if (status === 'confirmed') updateData.confirmed_at = new Date().toISOString()
  if (status === 'cancelled') updateData.cancelled_at = new Date().toISOString()

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)

  if (error) {
    logger.error('Failed to update booking status', { booking_id: bookingId, error: String(error) })
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }

  // Redirect back to the bookings page
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('businessId')
  const referer = request.headers.get('referer') || `/admin/bookings/${businessId || ''}`
  return NextResponse.redirect(new URL(referer, request.url))
}

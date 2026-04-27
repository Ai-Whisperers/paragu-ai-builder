import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { sendBusinessMessage } from '@/lib/reports/digest'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    const { message, businessId } = await request.json()
    if (!message) {
      return NextResponse.json({ error: 'message required' }, { status: 400 })
    }

    const { sent } = await sendBusinessMessage(message, businessId)
    logger.info('Business message sent', { sent, hasFilter: !!businessId })
    return NextResponse.json({ ok: true, sent })
  } catch (error) {
    logger.error('Business message failed', { error: String(error) })
    return NextResponse.json({ ok: false, reason: 'failed' }, { status: 200 })
  }
}

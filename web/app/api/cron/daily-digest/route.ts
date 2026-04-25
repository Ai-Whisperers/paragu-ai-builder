import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { sendDailyDigest } from '@/lib/reports/digest'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    const { sent, skipped } = await sendDailyDigest()
    logger.info('Daily digest sent', { sent, skipped })
    return NextResponse.json({ ok: true, sent, skipped })
  } catch (error) {
    logger.error('Daily digest failed', { error: String(error) })
    return NextResponse.json({ ok: false, reason: 'failed' }, { status: 200 })
  }
}

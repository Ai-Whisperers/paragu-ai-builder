import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { sendWeeklyReport } from '@/lib/reports/digest'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    const { sent, skipped } = await sendWeeklyReport()
    logger.info('Weekly report sent', { sent, skipped })
    return NextResponse.json({ ok: true, sent, skipped })
  } catch (error) {
    logger.error('Weekly report failed', { error: String(error) })
    return NextResponse.json({ ok: false, reason: 'failed' }, { status: 200 })
  }
}

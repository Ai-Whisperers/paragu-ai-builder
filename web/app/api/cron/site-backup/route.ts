import { NextResponse } from 'next/server'
import { runDatabaseBackup } from '@/lib/portal/backup'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: Request) {
  if (CRON_SECRET && request.headers.get('x-cron-secret') !== CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    const result = await runDatabaseBackup()
    if (result.ok) {
      logger.info('[cron:site-backup] completed', { tablesCount: result.tablesCount })
      return NextResponse.json({ ok: true, tablesCount: result.tablesCount })
    }
    logger.error('[cron:site-backup] failed', { error: result.error })
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  } catch (err) {
    logger.error('[cron:site-backup] exception', { error: String(err) })
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

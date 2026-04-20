import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { resendAdapter } from '@/lib/integrations/email/resend'

export const runtime = 'nodejs'

/**
 * Cron-driven outbox flusher. Reads up to 50 pending emails and sends via
 * Resend. Failures bump `attempts` and write `last_error`; after 5 attempts
 * rows are marked `failed` so they stop consuming cron cycles.
 *
 * Protected by CRON_SECRET header (set in hosting provider cron config).
 */
export const POST = withRequestLog(async (request, { log }) => {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.COMMERCE_EMAIL_FROM
  if (!resendKey || !fromAddress) {
    log.warn('commerce.cron.email_flush.not_configured')
    return NextResponse.json({ skipped: true })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('commerce_email_outbox')
    .select('*')
    .eq('status', 'pending')
    .lt('attempts', 5)
    .order('created_at', { ascending: true })
    .limit(50)

  if (error) {
    log.error('commerce.cron.email_flush.read_failed', new Error(error.message))
    return NextResponse.json({ error: 'read_failed' }, { status: 500 })
  }

  const rows = Array.isArray(data) ? data : []
  let sent = 0
  let failed = 0

  if (!resendAdapter.sendTransactional) {
    log.warn('commerce.cron.email_flush.adapter_missing')
    return NextResponse.json({ skipped: true, reason: 'adapter_missing' })
  }

  for (const row of rows) {
    const result = await resendAdapter.sendTransactional(
      row.recipient_email,
      row.subject,
      row.html_body,
      { transactionalApiKey: resendKey, fromAddress, fromName: 'Tu Tienda' },
    )
    const attempts = (row.attempts as number) + 1
    if (result.ok) {
      await supabase
        .from('commerce_email_outbox')
        .update({ status: 'sent', sent_at: new Date().toISOString(), attempts })
        .eq('id', row.id)
      sent++
    } else {
      const status = attempts >= 5 ? 'failed' : 'pending'
      await supabase
        .from('commerce_email_outbox')
        .update({ status, attempts, last_error: result.error ?? 'unknown' })
        .eq('id', row.id)
      failed++
    }
  }

  log.info('commerce.cron.email_flush.done', { sent, failed, processed: rows.length })
  return NextResponse.json({ sent, failed, processed: rows.length })
})

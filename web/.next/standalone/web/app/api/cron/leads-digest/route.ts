import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { resendAdapter } from '@/lib/integrations/email/resend'
import { TEMPLATES } from '@/lib/landing/marketing-data'

export const runtime = 'nodejs'

/**
 * Daily digest of demo-qualifier leads. Reads analytics_events from the
 * last 24h where event_type = 'lead_created' AND metadata.source =
 * 'demo_qualifier', formats them as a single HTML email, sends via Resend.
 *
 * Configure on the hosting cron with:
 *   POST https://paragu-ai.com/api/cron/leads-digest
 *   x-cron-secret: <CRON_SECRET>
 *   Crontab: 0 12 * * *  (12:00 UTC = 9:00 Asunción standard time)
 *
 * All schedules in this codebase are expressed in UTC. The Asunción mapping
 * above assumes UTC-3 (standard time); during DST the local hour shifts by
 * one. See docs/runbooks/CRON_STRATEGY.md for the canonical table and the
 * "schedule in UTC, ignore DST" rationale.
 *
 * Required env:
 *   - CRON_SECRET                — header guard
 *   - RESEND_API_KEY             — Resend API key (already in use by commerce)
 *   - LEADS_DIGEST_FROM          — sender, e.g. "Lead bot <leads@paragu-ai.com>"
 *   - LEADS_DIGEST_TO            — recipient(s), comma-separated
 *
 * If any required env is missing the route returns {skipped:true} without
 * erroring — same convention as commerce-email-flush.
 */

const RUBRO_LABEL: Record<string, string> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t.name]),
)

const SIZE_LABEL: Record<string, string> = {
  solo: 'Solo (1)',
  small: '2-5',
  medium: '6-15',
  large: '15+',
}

const PRESENCE_LABEL: Record<string, string> = {
  none: 'Solo IG/WA',
  facebook: 'Facebook',
  'old-site': 'Sitio viejo',
  'new-site': 'Rediseño',
}

type EventRow = {
  id: string
  lead_id: string | null
  created_at: string
  metadata: {
    rubro?: string
    size?: string
    presence?: string
    source?: string
  } | null
  referrer: string | null
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(rows: EventRow[]): string {
  const tableRows = rows
    .map((r) => {
      const rubro = RUBRO_LABEL[r.metadata?.rubro ?? ''] ?? r.metadata?.rubro ?? '—'
      const size = SIZE_LABEL[r.metadata?.size ?? ''] ?? r.metadata?.size ?? '—'
      const presence = PRESENCE_LABEL[r.metadata?.presence ?? ''] ?? r.metadata?.presence ?? '—'
      const time = new Date(r.created_at).toLocaleString('es-PY', {
        hour: '2-digit',
        minute: '2-digit',
      })
      // Referrer is whatever the browser sent — sometimes "direct", sometimes
      // a URL, sometimes garbage. Don't let one bad row blow up the digest.
      let ref = '—'
      if (r.referrer) {
        try {
          ref = new URL(r.referrer).pathname
        } catch {
          ref = r.referrer.slice(0, 60)
        }
      }
      return `
        <tr>
          <td style="padding:8px 12px; border-bottom:1px solid #eee; font-family:monospace; color:#666;">${escapeHtml(time)}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #eee; font-weight:600;">${escapeHtml(rubro)}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #eee;">${escapeHtml(size)}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #eee;">${escapeHtml(presence)}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #eee; color:#999;">${escapeHtml(ref)}</td>
        </tr>`
    })
    .join('')

  return `
<!DOCTYPE html>
<html><body style="font-family:-apple-system, BlinkMacSystemFont, sans-serif; max-width:680px; margin:0 auto; padding:24px; color:#1a1a2e;">
  <h1 style="font-size:22px; margin:0 0 8px;">Demo requests · últimas 24h</h1>
  <p style="color:#666; margin:0 0 24px;">${rows.length} lead(s) capturados desde el qualifier de <a href="https://paragu-ai.com/demo" style="color:#6366f1;">/demo</a>.</p>
  ${
    rows.length === 0
      ? '<p style="color:#999;">Sin actividad en las últimas 24h.</p>'
      : `
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    <thead>
      <tr style="background:#f5f5f7; text-align:left; text-transform:uppercase; font-size:11px; color:#666;">
        <th style="padding:10px 12px;">Hora</th>
        <th style="padding:10px 12px;">Rubro</th>
        <th style="padding:10px 12px;">Equipo</th>
        <th style="padding:10px 12px;">Presencia</th>
        <th style="padding:10px 12px;">Origen</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>`
  }
  <p style="margin-top:32px; font-size:13px; color:#666;">
    Ver todo en el panel: <a href="https://paragu-ai.com/admin/demo-requests" style="color:#6366f1;">/admin/demo-requests</a>
  </p>
</body></html>`
}

export const POST = withRequestLog(async (request, { log }) => {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.LEADS_DIGEST_FROM
  const toRaw = process.env.LEADS_DIGEST_TO
  if (!resendKey || !fromAddress || !toRaw) {
    log.warn('cron.leads_digest.not_configured', {
      resendKey: Boolean(resendKey),
      fromAddress: Boolean(fromAddress),
      toRaw: Boolean(toRaw),
    })
    return NextResponse.json({ skipped: true, reason: 'missing env' })
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('analytics_events')
    .select('id, lead_id, created_at, metadata, referrer')
    .eq('event_type', 'lead_created')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    log.error('cron.leads_digest.read_failed', new Error(error.message))
    return NextResponse.json({ error: 'read_failed' }, { status: 500 })
  }

  const rows: EventRow[] = (data ?? []).filter(
    (r: EventRow) => r.metadata?.source === 'demo_qualifier',
  )

  const html = buildHtml(rows)
  const subject = `[ParaguAI] ${rows.length} demo request(s) — últimas 24h`

  const recipients = toRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (!resendAdapter.sendTransactional) {
    log.error('cron.leads_digest.adapter_missing_send', new Error('resend.sendTransactional not implemented'))
    return NextResponse.json({ error: 'adapter_missing' }, { status: 500 })
  }

  const results: Array<{ to: string; ok: boolean; error?: string }> = []
  for (const to of recipients) {
    const result = await resendAdapter.sendTransactional(to, subject, html, {
      transactionalApiKey: resendKey,
      fromAddress,
      fromName: 'ParaguAI Leads',
    })
    results.push({ to, ok: result.ok, error: result.ok ? undefined : result.error })
  }

  log.info('cron.leads_digest.sent', { rowCount: rows.length, recipients: results })
  return NextResponse.json({ ok: true, leads: rows.length, recipients: results })
})

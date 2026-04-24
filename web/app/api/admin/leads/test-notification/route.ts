/**
 * POST /api/admin/leads/test-notification
 *
 * Sends a mock "new lead" email to every ADMIN_EMAILS recipient, using
 * the same Resend adapter + template as the real flow. Lets admins
 * verify before any real lead arrives that:
 *
 *   - EMAIL_TRANSACTIONAL_KEY + EMAIL_FROM_ADDRESS are set
 *   - Resend accepts the sender domain
 *   - ADMIN_EMAILS actually contains their address
 *   - Gmail/Outlook doesn't flag our mail as spam
 *
 * Idempotent — each call sends exactly one round of emails. No DB write.
 */
import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth/admin'
import { resendAdapter } from '@/lib/integrations/email/resend'
import { logger } from '@/lib/logger'
import { getAppUrl } from '@/lib/env'

export const runtime = 'nodejs'

export async function POST() {
  const admin = await checkAdmin()
  if (!admin.ok) return NextResponse.json({ error: admin.reason }, { status: admin.status })

  const recipients = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'no_admin_emails_configured' }, { status: 400 })
  }

  const config = {
    transactionalApiKey: process.env.EMAIL_TRANSACTIONAL_KEY,
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
    fromName: process.env.EMAIL_FROM_NAME || 'Paragu-AI',
  }
  if (!config.transactionalApiKey || !config.fromAddress) {
    return NextResponse.json({ error: 'email_adapter_not_configured' }, { status: 400 })
  }

  const subject = '[TEST] New lead notification — please ignore'
  const html = `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#1B2A4A;max-width:600px">
    <p style="padding:10px;background:#fef3c7;border-radius:6px;font-size:13px">
      <strong>This is a test email.</strong> Triggered by ${escape(admin.user.email ?? 'unknown admin')}
      from /admin — no real lead was created.
    </p>
    <h2 style="margin:14px 0 8px">Example: new inbound lead</h2>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:4px 10px 4px 0;color:#64748b">Site</td><td><code>nexa-paraguay</code> (en)</td></tr>
      <tr><td style="padding:4px 10px 4px 0;color:#64748b">Name</td><td>Test Lead</td></tr>
      <tr><td style="padding:4px 10px 4px 0;color:#64748b">Email</td><td>test@example.com</td></tr>
      <tr><td style="padding:4px 10px 4px 0;color:#64748b">Program</td><td>Paraguay Business</td></tr>
    </table>
    <h3 style="margin:16px 0 4px;font-size:14px">Objective</h3>
    <p style="white-space:pre-wrap;background:#f8fafc;padding:10px;border-radius:6px;font-size:13px">Sample objective text. Real leads will have what the visitor actually typed here.</p>
    <p style="margin-top:18px">
      <a href="${getAppUrl()}/admin/inbox"
         style="background:#0f172a;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;font-size:13px">
        Open Inbox
      </a>
    </p>
    <p style="margin-top:20px;font-size:11px;color:#94a3b8">
      If you received this email unexpectedly, the test was triggered by an admin verifying the notification flow.
    </p>
  </body></html>`

  const results = await Promise.all(
    recipients.map(async (to) => {
      try {
        const r = await resendAdapter.sendTransactional!(to, subject, html, config)
        return { to, ok: r.ok, error: r.ok ? undefined : r.error }
      } catch (e) {
        return { to, ok: false, error: e instanceof Error ? e.message : String(e) }
      }
    }),
  )

  const ok = results.every((r) => r.ok)
  logger.info('Admin email notification test', {
    by: admin.user.email,
    recipientCount: recipients.length,
    allOk: ok,
    failures: results.filter((r) => !r.ok).map((r) => ({ to: r.to, error: r.error })),
  })

  return NextResponse.json({
    ok,
    sent: results.filter((r) => r.ok).map((r) => r.to),
    failed: results.filter((r) => !r.ok).map((r) => ({ to: r.to, error: r.error })),
  })
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

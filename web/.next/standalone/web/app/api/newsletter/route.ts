/**
 * POST /api/newsletter — newsletter signup endpoint.
 *
 * Calls Mailchimp `/lists/:id/members` with status=pending (double opt-in)
 * so the subscriber receives a confirmation email. Falls back to logging
 * only if MAILCHIMP_API_KEY is unset (dev environment).
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

const Schema = z.object({
  email: z.string().email(),
  consent: z.boolean().refine((v) => v, { message: 'consent_required' }),
  source: z.string().max(120).optional(),
  locale: z.string().max(5).optional(),
  listId: z.string().max(64).optional(),
})

function mailchimpDatacenter(apiKey: string): string | null {
  const m = apiKey.match(/-(us\d+)$/)
  return m ? m[1] : null
}

export const POST = withRequestLog(async (req, { log }) => {
  const parsed = Schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  const { email, source, locale, listId } = parsed.data
  log.info('newsletter signup', { email, source, locale })

  const apiKey = process.env.MAILCHIMP_API_KEY
  const defaultListId = process.env.MAILCHIMP_DEFAULT_LIST_ID
  const list = listId || defaultListId
  if (!apiKey || !list) {
    return NextResponse.json({
      ok: true,
      note: 'Mailchimp not configured (MAILCHIMP_API_KEY + list id). Signup logged only.',
    })
  }

  const dc = mailchimpDatacenter(apiKey)
  if (!dc) {
    return NextResponse.json(
      { error: 'invalid_api_key', detail: 'Key must end in -usXX' },
      { status: 500 },
    )
  }

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${list}/members`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // double opt-in
        merge_fields: { LOCALE: locale || '' },
        tags: source ? [source] : [],
      }),
    })
    const payload = (await res.json().catch(() => ({}))) as { status?: string; detail?: string; title?: string }

    if (!res.ok) {
      // 400 with title=Member Exists is fine — not a real error for UX.
      if (payload.title === 'Member Exists') {
        return NextResponse.json({ ok: true, status: 'already_subscribed' })
      }
      log.warn('mailchimp subscribe failed', {
        status: res.status,
        title: payload.title,
        detail: payload.detail,
      })
      return NextResponse.json(
        { error: 'mailchimp_failed', title: payload.title },
        { status: res.status >= 500 ? 502 : 400 },
      )
    }

    return NextResponse.json({ ok: true, status: 'pending_confirmation' })
  } catch (err) {
    log.warn('mailchimp transport error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'transport' }, { status: 502 })
  }
})

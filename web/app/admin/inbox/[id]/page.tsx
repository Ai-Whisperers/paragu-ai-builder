/**
 * /admin/inbox/[id] — standalone detail view for one lead.
 *
 * The inbox main page's drawer is great for quick triage, but doesn't give
 * a permalink-able URL for a specific lead. This page provides that:
 * bookmark-able, shareable with another admin, deep-linked from the email
 * notification, and rendered server-side so it loads fast.
 *
 * Service-role read via createClient(). Admin-gated.
 */
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { AuditTimeline } from '../audit-timeline'
import { LeadDetailActions } from './lead-detail-actions'
import type { InboxLead } from '../page'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  return {
    title: `Lead ${id.slice(0, 8)} — Inbox`,
    description: 'Inbound consultation lead detail view.',
  }
}

export default async function LeadDetailPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select(
      'id, site_slug, locale, name, email, phone, country, program_interest, objective, source, referer, utm, status, admin_notes, contacted_at, qualified_at, closed_at, close_reason, assigned_to, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle()

  if (error) {
    logger.error('lead detail load failed', { id, error: error.message })
  }
  if (!data) notFound()

  const lead = data as InboxLead

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  const whatsappHref = lead.phone
    ? `https://wa.me/${lead.phone.replace(/\D/g, '')}`
    : null
  const mailHref = `mailto:${lead.email}?subject=${encodeURIComponent(`Re: your ${lead.site_slug} consultation`)}&body=${encodeURIComponent(`Hi ${lead.name},\n\nThanks for reaching out. `)}`

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link
            href="/admin/inbox"
            className="mb-3 inline-block text-xs text-slate-500 hover:text-slate-800 hover:underline"
          >
            ← Back to inbox
          </Link>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {lead.site_slug} · {lead.locale}
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">{lead.name}</h1>
            </div>
            <p className="text-xs text-slate-500">
              Received {formatDate(lead.created_at)}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card label="Email">
            <a href={mailHref} className="text-blue-600 hover:underline">{lead.email}</a>
          </Card>
          {lead.phone && <Card label="Phone">{lead.phone}</Card>}
          {lead.country && <Card label="Country">{lead.country}</Card>}
          {lead.program_interest && <Card label="Program">{lead.program_interest}</Card>}
        </div>

        <div className="flex flex-wrap gap-2">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
            >
              Message on WhatsApp
            </a>
          )}
          <a
            href={mailHref}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Send email
          </a>
        </div>

        {lead.objective && (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Objective
            </p>
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {lead.objective}
            </p>
          </div>
        )}

        <LeadDetailActions lead={lead} adminEmails={adminEmails} />

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Audit trail
          </p>
          <AuditTimeline leadId={lead.id} />
        </div>

        {(lead.source || lead.referer || (lead.utm && Object.keys(lead.utm).length > 0)) && (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Attribution
            </p>
            <dl className="grid gap-2 text-xs font-mono md:grid-cols-2">
              {lead.source && <DRow label="source">{lead.source}</DRow>}
              {lead.referer && <DRow label="referer"><span className="break-all">{lead.referer}</span></DRow>}
              {lead.utm && Object.entries(lead.utm).map(([k, v]) => <DRow key={k} label={k}>{v}</DRow>)}
            </dl>
          </div>
        )}
      </section>
    </main>
  )
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-1 text-sm text-slate-800">{children}</div>
    </div>
  )
}

function DRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 flex-shrink-0 text-slate-500">{label}</dt>
      <dd className="flex-1 text-slate-800">{children}</dd>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

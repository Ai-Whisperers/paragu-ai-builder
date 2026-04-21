import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import {
  loadBusinessContent,
  saveContentSection,
  CONTENT_SECTIONS,
  BusinessContentSchema,
  HeroContentSchema,
  AboutContentSchema,
  TestimonialsContentSchema,
  FaqContentSchema,
  ContactContentSchema,
} from '@/lib/commerce/business-content'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ businessId: string }>(async (_req, _ctx, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const content = await loadBusinessContent(businessId)
  return NextResponse.json({ content })
})

const SectionSchema = z.enum(CONTENT_SECTIONS)

/**
 * PUT /api/admin/content/[businessId] with body { section, value }.
 * Only the named section is replaced; the rest of data_json.content is
 * preserved server-side in saveContentSection's read-modify-write.
 */
export const PUT = withRequestLog<{ businessId: string }>(async (req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const shell = z.object({ section: SectionSchema, value: z.unknown() }).safeParse(json)
  if (!shell.success) {
    return NextResponse.json({ error: 'validation', detail: shell.error.flatten() }, { status: 400 })
  }

  // Validate the section payload against its specific schema so we reject
  // garbage before touching the DB. Keeps saveContentSection fully trusted.
  const sectionSchemas = {
    hero: HeroContentSchema,
    about: AboutContentSchema,
    testimonials: TestimonialsContentSchema,
    faq: FaqContentSchema,
    contact: ContactContentSchema,
  } as const
  const schema = sectionSchemas[shell.data.section]
  const payload = schema.safeParse(shell.data.value)
  if (!payload.success) {
    return NextResponse.json(
      { error: 'validation', section: shell.data.section, detail: payload.error.flatten() },
      { status: 400 },
    )
  }

  try {
    await saveContentSection({
      businessId,
      section: shell.data.section,
      value: payload.data as never, // matching section+value handled by upstream shell validation
    })
    log.info('admin.content.section_saved', { businessId, section: shell.data.section })
    return NextResponse.json({ ok: true, section: shell.data.section })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'save_failed'
    const status = message.startsWith('business_not_found') ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
})

// Reference unused import to silence linter — BusinessContentSchema is exported
// for callers who want to round-trip a full content blob.
void BusinessContentSchema

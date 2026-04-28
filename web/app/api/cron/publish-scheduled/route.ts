import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: Request) {
  if (CRON_SECRET && request.headers.get('x-cron-secret') !== CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createClient('service_role')
  const now = new Date().toISOString()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)

  let published = 0
  for (const post of posts ?? []) {
    const { error } = await supabase
      .from('blog_posts')
      .update({ status: 'published', published_at: now })
      .eq('id', post.id)
    if (!error) published++
  }

  logger.info('[cron:publish-scheduled] completed', { checked: (posts ?? []).length, published })
  return NextResponse.json({ ok: true, checked: (posts ?? []).length, published })
}

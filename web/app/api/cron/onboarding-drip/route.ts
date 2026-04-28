import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOnboardingDrip } from '@/lib/portal/onboarding-emails'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: Request) {
  if (CRON_SECRET && request.headers.get('x-cron-secret') !== CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createClient('service_role')
  const now = new Date()

  const { data: businesses } = await supabase.from('businesses').select('id, created_at').eq('status', 'active')

  let sent = 0
  for (const biz of businesses ?? []) {
    const daysSince = Math.floor((now.getTime() - new Date(biz.created_at).getTime()) / 86_400_000)
    if (daysSince === 0 || daysSince === 2 || daysSince === 5 || daysSince === 9 || daysSince === 14) {
      const dayIndex = [0, 2, 5, 9, 14].indexOf(daysSince)
      if (dayIndex >= 0) {
        await sendOnboardingDrip(biz.id, dayIndex)
        sent++
      }
    }
  }

  logger.info('[cron:onboarding-drip] completed', { checked: (businesses ?? []).length, sent })
  return NextResponse.json({ ok: true, checked: (businesses ?? []).length, sent })
}

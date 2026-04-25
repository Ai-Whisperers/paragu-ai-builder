import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function DashboardRootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/tenant-login?error=unauthorized')
  }

  const { data: tenant } = await supabase
    .from('tenant_users')
    .select('id, business_id')
    .eq('email', user.email)
    .single()

  if (!tenant) {
    redirect('/tenant-login?error=no_account')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('slug')
    .eq('id', tenant.business_id)
    .single()

  if (!business?.slug) {
    redirect('/tenant-login?error=no_business')
  }

  redirect(`/dashboard/${business.slug}`)
}

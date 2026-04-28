import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
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

  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || headerList.get('next-url') || ''

  // Only redirect on exact /dashboard match (not on /dashboard/{slug} subroutes)
  if (!pathname.includes(`/dashboard/${business.slug}`)) {
    redirect(`/dashboard/${business.slug}`)
  }

  return <>{children}</>
}

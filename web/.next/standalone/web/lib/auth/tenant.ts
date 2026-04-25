import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface TenantSession {
  tenantId: string
  businessId: string
  email: string
  name: string
  role: 'owner' | 'manager'
}

export async function getTenantSession(): Promise<TenantSession | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data } = await supabase
    .from('tenant_users')
    .select('id, business_id, email, name, role')
    .eq('email', user.email)
    .single()

  if (!data) return null

  return {
    tenantId: data.id,
    businessId: data.business_id,
    email: data.email,
    name: data.name,
    role: data.role as 'owner' | 'manager',
  }
}

export async function requireTenant(): Promise<TenantSession> {
  const session = await getTenantSession()
  if (!session) redirect('/tenant-login?error=unauthorized')
  return session
}

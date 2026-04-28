export interface PortalNotification {
  id: string
  type: 'booking' | 'order' | 'billing' | 'system'
  title: string
  body: string
  actionUrl?: string
  read: boolean
  created_at: string
}

export async function fetchNotifications(businessId: string): Promise<PortalNotification[]> {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient('service_role')
  const { data } = await supabase
    .from('portal_notifications')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(30)
  return (data ?? []) as PortalNotification[]
}

export async function markRead(notificationId: string): Promise<void> {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient('service_role')
  await supabase.from('portal_notifications').update({ read: true }).eq('id', notificationId)
}

export async function markAllRead(businessId: string): Promise<void> {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient('service_role')
  await supabase.from('portal_notifications').update({ read: true }).eq('business_id', businessId)
}

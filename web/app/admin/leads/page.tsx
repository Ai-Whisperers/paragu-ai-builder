/**
 * Admin Leads Dashboard
 * 
 * Full-featured CRM interface for managing leads:
 * - Filterable table by city, type, status, priority
 * - Search by business name
 * - Lead detail drawer with actions
 * - Generate preview site button
 * - WhatsApp outreach button
 * - Quick status updates
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LeadsDashboardClient } from './leads-dashboard-client'

export const metadata = {
  title: 'Admin - Lead Management | Paragu-AI',
  description: 'CRM dashboard for managing business leads',
}

// Types matching database schema
interface Lead {
  id: string
  business_name: string
  slug: string
  business_type: string
  status: string
  priority_tier: string
  priority_score: number
  city: string
  neighborhood: string | null
  phone: string | null
  whatsapp: string | null
  instagram: string | null
  rating: number | null
  review_count: number | null
  has_website: boolean
  created_at: string
  last_contacted_at: string | null
  google_maps_url: string | null
}

interface Stats {
  total: number
  new: number
  contacted: number
  responded: number
  paying: number
  byType: Record<string, number>
  byCity: Record<string, number>
}

async function getLeads(
  searchParams: { 
    status?: string
    type?: string
    city?: string
    priority?: string
    search?: string
    page?: string
  }
): Promise<{ leads: Lead[]; count: number }> {
  const supabase = await createClient()
  
  const page = parseInt(searchParams.page || '1')
  const limit = 50
  const offset = (page - 1) * limit
  
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('priority_score', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  // Apply filters
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }
  
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('business_type', searchParams.type)
  }
  
  if (searchParams.city && searchParams.city !== 'all') {
    query = query.eq('city', searchParams.city)
  }
  
  if (searchParams.priority && searchParams.priority !== 'all') {
    query = query.eq('priority_tier', searchParams.priority)
  }
  
  if (searchParams.search) {
    query = query.ilike('business_name', `%${searchParams.search}%`)
  }
  
  const { data, error, count } = await query
  
  if (error) {
    console.error('[Admin Leads] Error fetching leads:', error)
    return { leads: [], count: 0 }
  }
  
  return { leads: data as Lead[], count: count || 0 }
}

async function getStats(): Promise<Stats> {
  const supabase = await createClient()
  
  // Get counts by status
  const { data: statusData, error: statusError } = await supabase
    .from('leads')
    .select('status', { count: 'exact' })
  
  if (statusError) {
    console.error('[Admin Leads] Error fetching stats:', statusError)
    return { total: 0, new: 0, contacted: 0, responded: 0, paying: 0, byType: {}, byCity: {} }
  }
  
  // Get counts by type
  const { data: typeData, error: typeError } = await supabase
    .from('leads')
    .select('business_type')
  
  // Get counts by city
  const { data: cityData, error: cityError } = await supabase
    .from('leads')
    .select('city')
  
  // Calculate stats
  const byStatus = (statusData || []).reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const byType = !typeError ? (typeData || []).reduce((acc, row) => {
    acc[row.business_type] = (acc[row.business_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) : {}
  
  const byCity = !cityError ? (cityData || []).reduce((acc, row) => {
    acc[row.city] = (acc[row.city] || 0) + 1
    return acc
  }, {} as Record<string, number>) : {}
  
  return {
    total: statusData?.length || 0,
    new: byStatus['new'] || 0,
    contacted: byStatus['contacted'] || 0,
    responded: byStatus['responded'] || 0,
    paying: byStatus['paying'] || 0,
    byType,
    byCity,
  }
}

async function getFilterOptions() {
  const supabase = await createClient()
  
  // Get unique cities
  const { data: cities, error: citiesError } = await supabase
    .from('leads')
    .select('city')
    .order('city')
  
  // Get unique business types
  const { data: types, error: typesError } = await supabase
    .from('leads')
    .select('business_type')
    .order('business_type')
  
  return {
    cities: [...new Set((cities || []).map(c => c.city))].filter(Boolean),
    types: [...new Set((types || []).map(t => t.business_type))].filter(Boolean),
    statuses: ['new', 'enriched', 'demo_ready', 'contacted', 'responded', 
              'meeting_scheduled', 'onboarding', 'paying', 'churned', 'disqualified'],
    priorities: ['A', 'B', 'C', 'D'],
  }
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Auth check (simplified - should use proper auth middleware)
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) redirect('/login')
  
  // Normalize search params
  const params = {
    status: typeof searchParams.status === 'string' ? searchParams.status : undefined,
    type: typeof searchParams.type === 'string' ? searchParams.type : undefined,
    city: typeof searchParams.city === 'string' ? searchParams.city : undefined,
    priority: typeof searchParams.priority === 'string' ? searchParams.priority : undefined,
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    page: typeof searchParams.page === 'string' ? searchParams.page : '1',
  }
  
  // Fetch data in parallel
  const [{ leads, count }, stats, filterOptions] = await Promise.all([
    getLeads(params),
    getStats(),
    getFilterOptions(),
  ])
  
  const totalPages = Math.ceil(count / 50)
  const currentPage = parseInt(params.page || '1')
  
  return (
    <LeadsDashboardClient
      leads={leads}
      stats={stats}
      filterOptions={filterOptions}
      currentFilters={params}
      pagination={{
        currentPage,
        totalPages,
        totalItems: count,
        itemsPerPage: 50,
      }}
    />
  )
}

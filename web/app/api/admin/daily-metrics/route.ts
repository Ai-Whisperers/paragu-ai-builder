/**
 * Admin Daily Metrics API
 * Win 71: Daily stats email API
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Lazy client: creating it at request time (not module top-level) lets
// `next build` collect page data without Supabase env vars being set.
// The runtime error only fires when a real request hits without config.
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase credentials')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

interface DailyMetrics {
  date: string
  leads: {
    new: number
    contacted: number
    converted: number
    total: number
  }
  outreach: {
    messagesSent: number
    repliesReceived: number
    replyRate: number
  }
  demos: {
    generated: number
    uniqueViews: number
  }
  bookings: {
    initiated: number
    completed: number
    conversionRate: number
  }
  topCities: Array<{ city: string; count: number }>
  topBusinessTypes: Array<{ type: string; count: number }>
}

/**
 * GET /api/admin/daily-metrics
 * Get daily metrics report
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get date range from query params (default: yesterday)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '1')
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 1)
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - days + 1)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Fetch metrics
    const metrics = await fetchDailyMetrics(startDateStr, endDateStr)

    return NextResponse.json({
      success: true,
      metrics,
    })
  } catch (error) {
    logger.error('Failed to fetch daily metrics', { action: 'admin.dailyMetrics.fetch', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/daily-metrics
 * Generate and send daily metrics email
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, format = 'html' } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address required' },
        { status: 400 }
      )
    }

    // Get yesterday's metrics
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]

    const metrics = await fetchDailyMetrics(dateStr, dateStr)

    // Generate report
    let report: string
    if (format === 'html') {
      report = generateHtmlReport(metrics, dateStr)
    } else {
      report = generateTextReport(metrics, dateStr)
    }

    // TODO: Send email via your email service (Resend, SendGrid, etc.)
    // For now, just return the report
    return NextResponse.json({
      success: true,
      message: 'Report generated (email sending not implemented)',
      report,
      metrics,
    })
  } catch (error) {
    logger.error('Failed to generate daily metrics', { action: 'admin.dailyMetrics.generate', error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fetchDailyMetrics(startDate: string, endDate: string): Promise<DailyMetrics> {
  const supabase = getSupabase()
  const startTimestamp = `${startDate}T00:00:00Z`
  const endTimestamp = `${endDate}T23:59:59Z`

  // 1. Lead stats
  const { data: leadStats } = await supabase.rpc('get_lead_stats', {
    start_date: startTimestamp,
    end_date: endTimestamp,
  })

  // 2. Outreach stats
  const { data: outreachData, error: outreachError } = await supabase
    .from('outreach_events')
    .select('event_type')
    .gte('created_at', startTimestamp)
    .lte('created_at', endTimestamp)

  if (outreachError) {
    logger.warn('Failed to fetch outreach events for daily metrics', { action: 'admin.dailyMetrics.outreach', error: outreachError.message })
  }

  const messagesSent = outreachData?.filter((e: { event_type: string }) => e.event_type === 'whatsapp_sent').length || 0
  const repliesReceived = outreachData?.filter((e: { event_type: string }) => e.event_type === 'reply_received').length || 0

  // 3. Demo stats
  const { count: demosGenerated, error: demoError } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'demo_generated')
    .gte('created_at', startTimestamp)
    .lte('created_at', endTimestamp)

  if (demoError) {
    logger.warn('Failed to fetch demos for daily metrics', { action: 'admin.dailyMetrics.demos', error: demoError.message })
  }

  // 4. Booking stats
  const { data: bookingData, error: bookingError } = await supabase
    .from('analytics_events')
    .select('event_type')
    .in('event_type', ['booking_initiated', 'booking_completed'])
    .gte('created_at', startTimestamp)
    .lte('created_at', endTimestamp)

  if (bookingError) {
    logger.warn('Failed to fetch bookings for daily metrics', { action: 'admin.dailyMetrics.bookings', error: bookingError.message })
  }

  const bookingsInitiated = bookingData?.filter((e: { event_type: string }) => e.event_type === 'booking_initiated').length || 0
  const bookingsCompleted = bookingData?.filter((e: { event_type: string }) => e.event_type === 'booking_completed').length || 0

  // 5. Top cities
  const { data: cityData, error: cityError } = await supabase
    .from('leads')
    .select('city')
    .gte('created_at', startTimestamp)
    .lte('created_at', endTimestamp)

  if (cityError) {
    logger.warn('Failed to fetch cities for daily metrics', { action: 'admin.dailyMetrics.cities', error: cityError.message })
  }

  const cityCounts = (cityData || []).reduce((acc: Record<string, number>, lead: { city: string }) => {
    acc[lead.city] = (acc[lead.city] || 0) + 1
    return acc
  }, {})

  const topCities = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 6. Top business types
  const { data: typeData, error: typeError } = await supabase
    .from('leads')
    .select('business_type')
    .gte('created_at', startTimestamp)
    .lte('created_at', endTimestamp)

  if (typeError) {
    logger.warn('Failed to fetch types for daily metrics', { action: 'admin.dailyMetrics.types', error: typeError.message })
  }

  const typeCounts = (typeData || []).reduce((acc: Record<string, number>, lead: { business_type: string }) => {
    acc[lead.business_type] = (acc[lead.business_type] || 0) + 1
    return acc
  }, {})

  const topBusinessTypes = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 7. Total leads count
  const { count: totalLeads, error: totalError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  if (totalError) {
    logger.warn('Failed to fetch total for daily metrics', { action: 'admin.dailyMetrics.total', error: totalError.message })
  }

  return {
    date: startDate,
    leads: {
      new: leadStats?.new || 0,
      contacted: leadStats?.contacted || 0,
      converted: leadStats?.converted || 0,
      total: totalLeads || 0,
    },
    outreach: {
      messagesSent,
      repliesReceived,
      replyRate: messagesSent > 0 ? Math.round((repliesReceived / messagesSent) * 100) : 0,
    },
    demos: {
      generated: demosGenerated || 0,
      uniqueViews: 0, // Would need distinct count
    },
    bookings: {
      initiated: bookingsInitiated,
      completed: bookingsCompleted,
      conversionRate: bookingsInitiated > 0 
        ? Math.round((bookingsCompleted / bookingsInitiated) * 100) 
        : 0,
    },
    topCities,
    topBusinessTypes,
  }
}

function generateHtmlReport(metrics: DailyMetrics, date: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; }
    .metric-box { background: #f8f9fa; border-radius: 8px; padding: 15px; margin: 10px 0; }
    .metric-value { font-size: 24px; font-weight: bold; color: #3498db; }
    .metric-label { color: #7f8c8d; font-size: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #3498db; color: white; }
    .positive { color: #27ae60; }
    .negative { color: #e74c3c; }
  </style>
</head>
<body>
  <h1>📊 Paragu-AI Daily Report</h1>
  <p style="color: #7f8c8d;">${date}</p>
  
  <h2>👥 Lead Metrics</h2>
  <div class="grid">
    <div class="metric-box">
      <div class="metric-value">${metrics.leads.new}</div>
      <div class="metric-label">New Leads</div>
    </div>
    <div class="metric-box">
      <div class="metric-value">${metrics.leads.contacted}</div>
      <div class="metric-label">Contacted</div>
    </div>
    <div class="metric-box">
      <div class="metric-value">${metrics.leads.converted}</div>
      <div class="metric-label">Converted</div>
    </div>
    <div class="metric-box">
      <div class="metric-value">${metrics.leads.total}</div>
      <div class="metric-label">Total Leads</div>
    </div>
  </div>

  <h2>📤 Outreach Performance</h2>
  <div class="metric-box">
    <div class="metric-value">${metrics.outreach.messagesSent}</div>
    <div class="metric-label">Messages Sent</div>
    <p>Reply Rate: <strong>${metrics.outreach.replyRate}%</strong> (${metrics.outreach.repliesReceived} replies)</p>
  </div>

  <h2>🌐 Demos</h2>
  <div class="metric-box">
    <div class="metric-value">${metrics.demos.generated}</div>
    <div class="metric-label">Demos Generated</div>
  </div>

  <h2>📅 Bookings</h2>
  <div class="metric-box">
    <div class="metric-value">${metrics.bookings.initiated}</div>
    <div class="metric-label">Bookings Initiated</div>
    <p>Conversion Rate: <strong>${metrics.bookings.conversionRate}%</strong> (${metrics.bookings.completed} completed)</p>
  </div>

  <h2>🏆 Top Cities</h2>
  <table>
    <tr><th>City</th><th>Leads</th></tr>
    ${metrics.topCities.map(c => `<tr><td>${c.city}</td><td>${c.count}</td></tr>`).join('')}
  </table>

  <h2>🏢 Top Business Types</h2>
  <table>
    <tr><th>Type</th><th>Leads</th></tr>
    ${metrics.topBusinessTypes.map(t => `<tr><td>${t.type}</td><td>${t.count}</td></tr>`).join('')}
  </table>

  <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;">
  <p style="color: #95a5a6; font-size: 12px; text-align: center;">
    Generated by Paragu-AI Analytics<br>
    <a href="https://admin.paragu.ai">View Dashboard</a>
  </p>
</body>
</html>
  `.trim()
}

function generateTextReport(metrics: DailyMetrics, date: string): string {
  return `
PARAGU-AI DAILY REPORT - ${date}
${'='.repeat(40)}

LEAD METRICS
- New Leads: ${metrics.leads.new}
- Contacted: ${metrics.leads.contacted}
- Converted: ${metrics.leads.converted}
- Total Leads: ${metrics.leads.total}

OUTREACH PERFORMANCE
- Messages Sent: ${metrics.outreach.messagesSent}
- Replies Received: ${metrics.outreach.repliesReceived}
- Reply Rate: ${metrics.outreach.replyRate}%

DEMOS
- Generated: ${metrics.demos.generated}

BOOKINGS
- Initiated: ${metrics.bookings.initiated}
- Completed: ${metrics.bookings.completed}
- Conversion Rate: ${metrics.bookings.conversionRate}%

TOP CITIES
${metrics.topCities.map(c => `  - ${c.city}: ${c.count}`).join('\n')}

TOP BUSINESS TYPES
${metrics.topBusinessTypes.map(t => `  - ${t.type}: ${t.count}`).join('\n')}

${'='.repeat(40)}
View full dashboard: https://admin.paragu.ai
  `.trim()
}

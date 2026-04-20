#!/usr/bin/env node
/**
 * Funnel Report Generator
 * Win 70: SQL query for conversion funnel
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

interface FunnelStage {
  stage: string
  count: number
  percentage: number
  dropOff: number
}

interface FunnelReport {
  period: string
  totalLeads: number
  stages: FunnelStage[]
  conversionRate: number
}

async function generateFunnelReport(days: number = 30): Promise<FunnelReport> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString()

  console.log(`📊 Generating funnel report for last ${days} days...\n`)

  // Query 1: Total leads created
  const { count: totalLeads, error: leadsError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDateStr)

  if (leadsError) {
    console.error('Error fetching leads:', leadsError)
    throw leadsError
  }

  // Query 2: Leads with outreach sent
  const { data: outreachData, error: outreachError } = await supabase
    .from('outreach_events')
    .select('lead_id')
    .eq('event_type', 'whatsapp_sent')
    .gte('created_at', startDateStr)

  if (outreachError) {
    console.error('Error fetching outreach:', outreachError)
    throw outreachError
  }

  const uniqueOutreachLeads = new Set(outreachData?.map((o: { lead_id: string }) => o.lead_id)).size

  // Query 3: Demo views
  const { data: demoData, error: demoError } = await supabase
    .from('analytics_events')
    .select('metadata->>leadId')
    .eq('event_type', 'demo_generated')
    .gte('created_at', startDateStr)

  if (demoError) {
    console.error('Error fetching demos:', demoError)
    throw demoError
  }

  const uniqueDemoViews = new Set(demoData?.map((d: { leadId: string }) => d.leadId)).size

  // Query 4: Conversations (replies)
  const { data: replyData, error: replyError } = await supabase
    .from('outreach_events')
    .select('lead_id')
    .eq('event_type', 'reply_received')
    .gte('created_at', startDateStr)

  if (replyError) {
    console.error('Error fetching replies:', replyError)
    throw replyError
  }

  const uniqueReplies = new Set(replyData?.map((r: { lead_id: string }) => r.lead_id)).size

  // Query 5: Meetings scheduled
  const { data: meetingData, error: meetingError } = await supabase
    .from('outreach_events')
    .select('lead_id')
    .eq('event_type', 'meeting_scheduled')
    .gte('created_at', startDateStr)

  if (meetingError) {
    console.error('Error fetching meetings:', meetingError)
    throw meetingError
  }

  const uniqueMeetings = new Set(meetingData?.map((m: { lead_id: string }) => m.lead_id)).size

  // Query 6: Proposals sent
  const { data: proposalData, error: proposalError } = await supabase
    .from('outreach_events')
    .select('lead_id')
    .eq('event_type', 'proposal_sent')
    .gte('created_at', startDateStr)

  if (proposalError) {
    console.error('Error fetching proposals:', proposalError)
    throw proposalError
  }

  const uniqueProposals = new Set(proposalData?.map((p: { lead_id: string }) => p.lead_id)).size

  // Query 7: Conversions (customers)
  const { count: conversions, error: convError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'converted')
    .gte('created_at', startDateStr)

  if (convError) {
    console.error('Error fetching conversions:', convError)
    throw convError
  }

  // Calculate funnel stages
  const total = totalLeads || 0
  const stages: FunnelStage[] = [
    {
      stage: 'Leads Created',
      count: total,
      percentage: 100,
      dropOff: 0,
    },
    {
      stage: 'Outreach Sent',
      count: uniqueOutreachLeads,
      percentage: total > 0 ? Math.round((uniqueOutreachLeads / total) * 100) : 0,
      dropOff: total - uniqueOutreachLeads,
    },
    {
      stage: 'Demo Viewed',
      count: uniqueDemoViews,
      percentage: total > 0 ? Math.round((uniqueDemoViews / total) * 100) : 0,
      dropOff: uniqueOutreachLeads - uniqueDemoViews,
    },
    {
      stage: 'Reply Received',
      count: uniqueReplies,
      percentage: total > 0 ? Math.round((uniqueReplies / total) * 100) : 0,
      dropOff: uniqueDemoViews - uniqueReplies,
    },
    {
      stage: 'Meeting Scheduled',
      count: uniqueMeetings,
      percentage: total > 0 ? Math.round((uniqueMeetings / total) * 100) : 0,
      dropOff: uniqueReplies - uniqueMeetings,
    },
    {
      stage: 'Proposal Sent',
      count: uniqueProposals,
      percentage: total > 0 ? Math.round((uniqueProposals / total) * 100) : 0,
      dropOff: uniqueMeetings - uniqueProposals,
    },
    {
      stage: 'Converted (Customer)',
      count: conversions || 0,
      percentage: total > 0 ? Math.round(((conversions || 0) / total) * 100) : 0,
      dropOff: uniqueProposals - (conversions || 0),
    },
  ]

  const conversionRate = total > 0 ? (((conversions || 0) / total) * 100).toFixed(2) : '0.00'

  return {
    period: `${days} days`,
    totalLeads: total,
    stages,
    conversionRate: parseFloat(conversionRate),
  }
}

async function printFunnelReport() {
  const days = parseInt(process.argv[2]) || 30
  
  try {
    const report = await generateFunnelReport(days)

    console.log('═══════════════════════════════════════════════════')
    console.log('           CONVERSION FUNNEL REPORT')
    console.log('═══════════════════════════════════════════════════')
    console.log(`Period: Last ${report.period}`)
    console.log(`Total Leads: ${report.totalLeads}`)
    console.log(`Overall Conversion Rate: ${report.conversionRate}%`)
    console.log('═══════════════════════════════════════════════════\n')

    console.log('FUNNEL STAGES:')
    console.log('─'.repeat(50))
    
    report.stages.forEach((stage, index) => {
      const barLength = Math.round(stage.percentage / 2)
      const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength)
      
      console.log(`\n${index + 1}. ${stage.stage}`)
      console.log(`   Count: ${stage.count.toLocaleString()}`)
      console.log(`   Conversion: ${stage.percentage}%`)
      console.log(`   ${bar}`)
      
      if (stage.dropOff > 0) {
        console.log(`   ↓ Drop-off: ${stage.dropOff} (${Math.round((stage.dropOff / (stage.count + stage.dropOff)) * 100)}%)`)
      }
    })

    console.log('\n' + '═'.repeat(50))
    console.log('KEY METRICS:')
    console.log('─'.repeat(50))
    
    const outreachRate = report.stages[1].percentage
    const demoRate = report.stages[2].percentage
    const replyRate = report.stages[3].percentage
    const meetingRate = report.stages[4].percentage
    const proposalRate = report.stages[5].percentage
    
    console.log(`Outreach → Demo Rate: ${demoRate}%`)
    console.log(`Demo → Reply Rate: ${replyRate}%`)
    console.log(`Reply → Meeting Rate: ${meetingRate}%`)
    console.log(`Meeting → Proposal Rate: ${proposalRate}%`)
    console.log(`Proposal → Conversion Rate: ${report.conversionRate}%`)
    
    // Identify bottlenecks
    console.log('\n' + '═'.repeat(50))
    console.log('BOTTLENECK ANALYSIS:')
    console.log('─'.repeat(50))
    
    const dropOffRates = report.stages.slice(1).map(s => ({
      stage: s.stage,
      dropOffRate: s.dropOff > 0 ? (s.dropOff / (s.count + s.dropOff)) * 100 : 0
    }))
    
    const biggestBottleneck = dropOffRates.reduce((max, current) => 
      current.dropOffRate > max.dropOffRate ? current : max
    )
    
    console.log(`⚠️ Biggest drop-off: ${biggestBottleneck.stage} (${biggestBottleneck.dropOffRate.toFixed(1)}%)`)
    
    // Recommendations
    console.log('\n' + '═'.repeat(50))
    console.log('RECOMMENDATIONS:')
    console.log('─'.repeat(50))
    
    if (outreachRate < 80) {
      console.log('• Increase outreach rate - consider automated campaigns')
    }
    if (demoRate < 30) {
      console.log('• Improve demo engagement - faster generation, better preview')
    }
    if (replyRate < 20) {
      console.log('• Optimize WhatsApp message templates')
    }
    if (meetingRate < 40) {
      console.log('• Add meeting booking CTAs to demos')
    }
    if (parseFloat(report.conversionRate) < 5) {
      console.log('• Review pricing page clarity and payment flow')
    }
    
    console.log('\n' + '═'.repeat(50))
    
  } catch (error) {
    console.error('❌ Failed to generate report:', error)
    process.exit(1)
  }
}

// Run if called directly
printFunnelReport()

// Export for programmatic use
export { generateFunnelReport }
export type { FunnelReport, FunnelStage }

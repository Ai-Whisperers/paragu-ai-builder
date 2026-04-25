/**
 * Win 74: Outreach Tracking Utility
 * WhatsApp sent/opened tracking for outreach analytics
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Event types for outreach tracking
export const OutreachEventTypes = {
  WHATSAPP_SENT: 'whatsapp_sent',
  WHATSAPP_DELIVERED: 'whatsapp_delivered',
  WHATSAPP_READ: 'whatsapp_read',
  WHATSAPP_FAILED: 'whatsapp_failed',
  REPLY_RECEIVED: 'reply_received',
  DEMO_VIEWED: 'demo_viewed',
  DEMO_SHARED: 'demo_shared',
  MEETING_SCHEDULED: 'meeting_scheduled',
  MEETING_COMPLETED: 'meeting_completed',
  PROPOSAL_SENT: 'proposal_sent',
  PROPOSAL_VIEWED: 'proposal_viewed',
  ONBOARDING_STARTED: 'onboarding_started',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  FOLLOW_UP_SENT: 'follow_up_sent',
  REACTIVATION_SENT: 'reactivation_sent',
} as const

export type OutreachEventType = typeof OutreachEventTypes[keyof typeof OutreachEventTypes]

interface TrackOptions {
  leadId: string
  messageId?: string
  templateName?: string
  metadata?: Record<string, unknown>
  timestamp?: string
}

interface OutreachStats {
  totalSent: number
  totalDelivered: number
  totalRead: number
  totalReplies: number
  deliveryRate: number
  readRate: number
  replyRate: number
  byTemplate: Record<string, {
    sent: number
    delivered: number
    read: number
    replies: number
  }>
  byDay: Record<string, {
    sent: number
    replies: number
  }>
}

interface EngagementTimeline {
  leadId: string
  events: Array<{
    type: OutreachEventType
    timestamp: string
    metadata?: Record<string, unknown>
  }>
  firstContact: string | null
  lastActivity: string | null
  responseTime?: number // hours
}

/**
 * Track an outreach event
 */
export async function trackOutreachEvent(
  supabase: SupabaseClient,
  eventType: OutreachEventType,
  options: TrackOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('outreach_events')
      .insert({
        lead_id: options.leadId,
        event_type: eventType,
        message_id: options.messageId || null,
        template_name: options.templateName || null,
        metadata: options.metadata || {},
        created_at: options.timestamp || new Date().toISOString(),
      })

    if (error) {
      logger.warn('Supabase rejected outreach event insert', {
        action: 'outreach.track',
        error: error.message,
      })
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    logger.warn('Outreach tracking threw — event not persisted', {
      action: 'outreach.track',
      error: error instanceof Error ? error.message : String(error),
    })
    return { success: false, error: String(error) }
  }
}

/**
 * Track WhatsApp message sent
 */
export async function trackWhatsAppSent(
  supabase: SupabaseClient,
  leadId: string,
  templateName: string,
  messageId?: string
): Promise<{ success: boolean; error?: string }> {
  return trackOutreachEvent(supabase, OutreachEventTypes.WHATSAPP_SENT, {
    leadId,
    messageId,
    templateName,
    metadata: { channel: 'whatsapp' },
  })
}

/**
 * Track WhatsApp message delivered
 */
export async function trackWhatsAppDelivered(
  supabase: SupabaseClient,
  leadId: string,
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  return trackOutreachEvent(supabase, OutreachEventTypes.WHATSAPP_DELIVERED, {
    leadId,
    messageId,
    metadata: { channel: 'whatsapp', status: 'delivered' },
  })
}

/**
 * Track WhatsApp message read/opened
 */
export async function trackWhatsAppRead(
  supabase: SupabaseClient,
  leadId: string,
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  return trackOutreachEvent(supabase, OutreachEventTypes.WHATSAPP_READ, {
    leadId,
    messageId,
    metadata: { channel: 'whatsapp', status: 'read' },
  })
}

/**
 * Track reply received from lead
 */
export async function trackReplyReceived(
  supabase: SupabaseClient,
  leadId: string,
  replyContent?: string
): Promise<{ success: boolean; error?: string }> {
  return trackOutreachEvent(supabase, OutreachEventTypes.REPLY_RECEIVED, {
    leadId,
    metadata: { 
      channel: 'whatsapp',
      hasContent: !!replyContent,
      contentLength: replyContent?.length || 0,
    },
  })
}

/**
 * Track demo view
 */
export async function trackDemoViewed(
  supabase: SupabaseClient,
  leadId: string,
  demoUrl: string,
  viewDuration?: number
): Promise<{ success: boolean; error?: string }> {
  return trackOutreachEvent(supabase, OutreachEventTypes.DEMO_VIEWED, {
    leadId,
    metadata: {
      demoUrl,
      viewDuration,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Get outreach statistics for a time period
 */
export async function getOutreachStats(
  supabase: SupabaseClient,
  days: number = 30
): Promise<OutreachStats> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString()

  // Fetch all events in the period
  const { data: events, error } = await supabase
    .from('outreach_events')
    .select('*')
    .gte('created_at', startDateStr)
    .order('created_at', { ascending: true })

  if (error) {
    logger.error('Failed to fetch outreach stats', {
      action: 'outreach.getStats',
      error: error.message,
    })
    throw error
  }

  // Calculate statistics
  const stats: OutreachStats = {
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalReplies: 0,
    deliveryRate: 0,
    readRate: 0,
    replyRate: 0,
    byTemplate: {},
    byDay: {},
  }

  events?.forEach((event: {
    event_type: string
    template_name: string | null
    created_at: string
  }) => {
    // Count by event type
    if (event.event_type === OutreachEventTypes.WHATSAPP_SENT) {
      stats.totalSent++
    } else if (event.event_type === OutreachEventTypes.WHATSAPP_DELIVERED) {
      stats.totalDelivered++
    } else if (event.event_type === OutreachEventTypes.WHATSAPP_READ) {
      stats.totalRead++
    } else if (event.event_type === OutreachEventTypes.REPLY_RECEIVED) {
      stats.totalReplies++
    }

    // Count by template
    const template = event.template_name || 'unknown'
    if (!stats.byTemplate[template]) {
      stats.byTemplate[template] = { sent: 0, delivered: 0, read: 0, replies: 0 }
    }

    if (event.event_type === OutreachEventTypes.WHATSAPP_SENT) {
      stats.byTemplate[template].sent++
    } else if (event.event_type === OutreachEventTypes.WHATSAPP_DELIVERED) {
      stats.byTemplate[template].delivered++
    } else if (event.event_type === OutreachEventTypes.WHATSAPP_READ) {
      stats.byTemplate[template].read++
    } else if (event.event_type === OutreachEventTypes.REPLY_RECEIVED) {
      stats.byTemplate[template].replies++
    }

    // Count by day
    const day = event.created_at.split('T')[0]
    if (!stats.byDay[day]) {
      stats.byDay[day] = { sent: 0, replies: 0 }
    }

    if (event.event_type === OutreachEventTypes.WHATSAPP_SENT) {
      stats.byDay[day].sent++
    } else if (event.event_type === OutreachEventTypes.REPLY_RECEIVED) {
      stats.byDay[day].replies++
    }
  })

  // Calculate rates
  stats.deliveryRate = stats.totalSent > 0 
    ? Math.round((stats.totalDelivered / stats.totalSent) * 100) 
    : 0
  stats.readRate = stats.totalDelivered > 0 
    ? Math.round((stats.totalRead / stats.totalDelivered) * 100) 
    : 0
  stats.replyRate = stats.totalSent > 0 
    ? Math.round((stats.totalReplies / stats.totalSent) * 100) 
    : 0

  return stats
}

/**
 * Get engagement timeline for a specific lead
 */
export async function getLeadEngagementTimeline(
  supabase: SupabaseClient,
  leadId: string
): Promise<EngagementTimeline> {
  const { data: events, error } = await supabase
    .from('outreach_events')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true })

  if (error) {
    logger.error('Failed to fetch engagement timeline', {
      action: 'outreach.getLeadEngagementTimeline',
      leadId,
      error: error.message,
    })
    throw error
  }

  const timelineEvents = (events || []).map((e: {
    event_type: OutreachEventType
    created_at: string
    metadata: Record<string, unknown>
  }) => ({
    type: e.event_type,
    timestamp: e.created_at,
    metadata: e.metadata,
  }))

  const firstContact = timelineEvents[0]?.timestamp || null
  const lastActivity = timelineEvents[timelineEvents.length - 1]?.timestamp || null

  // Calculate response time (hours between first message and first reply)
  let responseTime: number | undefined
  const firstMessage = timelineEvents.find(e => e.type === OutreachEventTypes.WHATSAPP_SENT)
  const firstReply = timelineEvents.find(e => e.type === OutreachEventTypes.REPLY_RECEIVED)
  
  if (firstMessage && firstReply) {
    const messageTime = new Date(firstMessage.timestamp).getTime()
    const replyTime = new Date(firstReply.timestamp).getTime()
    responseTime = Math.round((replyTime - messageTime) / (1000 * 60 * 60) * 10) / 10 // Hours
  }

  return {
    leadId,
    events: timelineEvents,
    firstContact,
    lastActivity,
    responseTime,
  }
}

/**
 * Get leads that haven't replied yet (for follow-up)
 */
export async function getNonResponsiveLeads(
  supabase: SupabaseClient,
  daysSinceContact: number = 3
): Promise<Array<{
  leadId: string
  lastContactDate: string
  daysSince: number
  templateName?: string
}>> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceContact)
  const cutoffStr = cutoffDate.toISOString()

  // Get leads with whatsapp_sent but no reply_received
  const { data: sentEvents, error: sentError } = await supabase
    .from('outreach_events')
    .select('lead_id, created_at, template_name')
    .eq('event_type', OutreachEventTypes.WHATSAPP_SENT)
    .lte('created_at', cutoffStr)

  if (sentError) {
    logger.error('Failed to fetch outreach sent events', {
      action: 'outreach.sentEvents',
      error: sentError.message,
    })
    throw sentError
  }

  // Get all replies
  const { data: replyEvents, error: replyError } = await supabase
    .from('outreach_events')
    .select('lead_id')
    .eq('event_type', OutreachEventTypes.REPLY_RECEIVED)

  if (replyError) {
    logger.error('Failed to fetch outreach reply events', {
      action: 'outreach.replyEvents',
      error: replyError.message,
    })
    throw replyError
  }

  const repliedLeadIds = new Set(replyEvents?.map((r: { lead_id: string }) => r.lead_id) || [])
  
  // Filter to non-responsive leads
  const nonResponsive = (sentEvents || [])
    .filter((e: { lead_id: string }) => !repliedLeadIds.has(e.lead_id))
    .map((e: { lead_id: string; created_at: string; template_name: string }) => ({
      leadId: e.lead_id,
      lastContactDate: e.created_at,
      daysSince: Math.floor((Date.now() - new Date(e.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      templateName: e.template_name || undefined,
    }))

  // Remove duplicates (keep most recent contact)
  const seen = new Set<string>()
  return nonResponsive.filter((lead: { leadId: string }) => {
    if (seen.has(lead.leadId)) return false
    seen.add(lead.leadId)
    return true
  })
}

/**
 * Get best performing templates
 */
export async function getTopTemplates(
  supabase: SupabaseClient,
  days: number = 30,
  limit: number = 5
): Promise<Array<{
  templateName: string
  sent: number
  replies: number
  replyRate: number
}>> {
  const stats = await getOutreachStats(supabase, days)

  return Object.entries(stats.byTemplate)
    .map(([name, data]) => ({
      templateName: name,
      sent: data.sent,
      replies: data.replies,
      replyRate: data.sent > 0 ? Math.round((data.replies / data.sent) * 100) : 0,
    }))
    .sort((a, b) => b.replyRate - a.replyRate)
    .slice(0, limit)
}

/**
 * Hook for React components to track outreach
 */
export function useOutreachTracking(supabase: SupabaseClient) {
  return {
    trackEvent: (eventType: OutreachEventType, options: TrackOptions) => 
      trackOutreachEvent(supabase, eventType, options),
    trackWhatsAppSent: (leadId: string, templateName: string, messageId?: string) =>
      trackWhatsAppSent(supabase, leadId, templateName, messageId),
    trackWhatsAppDelivered: (leadId: string, messageId: string) =>
      trackWhatsAppDelivered(supabase, leadId, messageId),
    trackWhatsAppRead: (leadId: string, messageId: string) =>
      trackWhatsAppRead(supabase, leadId, messageId),
    trackReplyReceived: (leadId: string, replyContent?: string) =>
      trackReplyReceived(supabase, leadId, replyContent),
    trackDemoViewed: (leadId: string, demoUrl: string, viewDuration?: number) =>
      trackDemoViewed(supabase, leadId, demoUrl, viewDuration),
    getStats: (days?: number) => getOutreachStats(supabase, days),
    getTimeline: (leadId: string) => getLeadEngagementTimeline(supabase, leadId),
    getNonResponsiveLeads: (daysSinceContact?: number) => 
      getNonResponsiveLeads(supabase, daysSinceContact),
    getTopTemplates: (days?: number, limit?: number) => 
      getTopTemplates(supabase, days, limit),
  }
}

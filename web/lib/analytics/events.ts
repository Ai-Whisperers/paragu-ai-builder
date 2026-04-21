/**
 * Analytics Events Utility
 * Win 69: Event tracking utility
 */
import { logger } from '@/lib/logger'

// Event types matching the API
export const EventTypes = {
  PAGE_VIEW: 'page_view',
  SECTION_VIEW: 'section_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  PHONE_CLICK: 'phone_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  EMAIL_CLICK: 'email_click',
  SOCIAL_CLICK: 'social_click',
  BOOKING_INITIATED: 'booking_initiated',
  BOOKING_COMPLETED: 'booking_completed',
  OUTREACH_SENT: 'outreach_sent',
  DEMO_GENERATED: 'demo_generated',
  LEAD_CREATED: 'lead_created',
  CONVERSION: 'conversion',
  WEB_VITAL: 'web_vital',
} as const

export type EventType = typeof EventTypes[keyof typeof EventTypes]

interface TrackOptions {
  businessId?: string
  leadId?: string
  pageUrl?: string
  sectionId?: string
  metadata?: Record<string, unknown>
  sessionId?: string
}

interface AnalyticsConfig {
  endpoint: string
  batchSize: number
  flushInterval: number
  enabled: boolean
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  endpoint: '/api/analytics/track',
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  enabled: typeof window !== 'undefined' && !window.location.hostname.includes('localhost'),
}

// In-memory event queue for batching
let eventQueue: Array<{
  eventType: EventType
  timestamp: number
  options: TrackOptions
}> = []

let flushTimer: NodeJS.Timeout | null = null

/**
 * Initialize analytics with custom configuration
 */
export function initAnalytics(config: Partial<AnalyticsConfig> = {}): AnalyticsConfig {
  const mergedConfig = { ...defaultConfig, ...config }
  
  // Start flush timer
  if (mergedConfig.enabled && typeof window !== 'undefined') {
    startFlushTimer(mergedConfig.flushInterval)
  }
  
  return mergedConfig
}

/**
 * Track a single event
 */
export async function trackEvent(
  eventType: EventType,
  options: TrackOptions = {}
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const config = defaultConfig
  
  if (!config.enabled) {
    return { success: false, error: 'Analytics disabled' }
  }
  
  // Add to queue for batching
  eventQueue.push({
    eventType,
    timestamp: Date.now(),
    options,
  })
  
  // Flush if batch size reached
  if (eventQueue.length >= config.batchSize) {
    await flushEvents()
  }
  
  return { success: true }
}

/**
 * Track page view
 */
export function trackPageView(
  pageUrl?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  return trackEvent(EventTypes.PAGE_VIEW, {
    pageUrl: pageUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
    metadata: {
      title: typeof document !== 'undefined' ? document.title : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      ...metadata,
    },
  })
}

/**
 * Track button click
 */
export function trackButtonClick(
  buttonId: string,
  buttonText: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  return trackEvent(EventTypes.BUTTON_CLICK, {
    metadata: {
      buttonId,
      buttonText,
      ...metadata,
    },
  })
}

/**
 * Track section view (for scroll tracking)
 */
export function trackSectionView(
  sectionId: string,
  sectionType?: string
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  return trackEvent(EventTypes.SECTION_VIEW, {
    sectionId,
    metadata: {
      sectionType,
    },
  })
}

/**
 * Track phone/WhatsApp click
 */
export function trackPhoneClick(
  phoneNumber: string,
  type: 'phone' | 'whatsapp' = 'phone'
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const eventType = type === 'whatsapp' ? EventTypes.WHATSAPP_CLICK : EventTypes.PHONE_CLICK
  return trackEvent(eventType, {
    metadata: {
      phoneNumber: phoneNumber.slice(-4), // Last 4 digits only for privacy
    },
  })
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formId: string,
  formType: string,
  success: boolean,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  return trackEvent(EventTypes.FORM_SUBMIT, {
    metadata: {
      formId,
      formType,
      success,
      ...metadata,
    },
  })
}

/**
 * Track booking flow
 */
export function trackBooking(
  step: 'initiated' | 'completed',
  serviceName?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const eventType = step === 'completed' 
    ? EventTypes.BOOKING_COMPLETED 
    : EventTypes.BOOKING_INITIATED
  
  return trackEvent(eventType, {
    metadata: {
      serviceName,
      ...metadata,
    },
  })
}

/**
 * Track lead creation
 */
export function trackLeadCreated(
  leadId: string,
  source: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  return trackEvent(EventTypes.LEAD_CREATED, {
    leadId,
    metadata: {
      source,
      ...metadata,
    },
  })
}

/**
 * Track conversion (lead to customer)
 */
export function trackConversion(
  leadId: string,
  businessId: string,
  value?: number,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  return trackEvent(EventTypes.CONVERSION, {
    leadId,
    businessId,
    metadata: {
      value,
      ...metadata,
    },
  })
}

/**
 * Flush all queued events to the server
 */
export async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return
  
  const eventsToSend = [...eventQueue]
  eventQueue = []
  
  try {
    const response = await fetch(defaultConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        batch: true,
        events: eventsToSend.map(e => ({
          eventType: e.eventType,
          timestamp: new Date(e.timestamp).toISOString(),
          ...e.options,
          pageUrl: e.options.pageUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        })),
      }),
    })
    
    if (!response.ok) {
      // Re-add events to queue for retry
      eventQueue.unshift(...eventsToSend)
      logger.warn('Analytics ingest non-2xx — events re-queued for retry', {
        action: 'analytics.flush',
        httpStatus: response.status,
        statusText: response.statusText,
        eventsRequeued: eventsToSend.length,
      })
    }
  } catch (error) {
    // Re-add events to queue for retry
    eventQueue.unshift(...eventsToSend)
    logger.warn('Analytics ingest transport error — events re-queued for retry', {
      action: 'analytics.flush',
      error: error instanceof Error ? error.message : String(error),
      eventsRequeued: eventsToSend.length,
    })
  }
}

/**
 * Start automatic flush timer
 */
function startFlushTimer(interval: number): void {
  if (flushTimer) {
    clearInterval(flushTimer)
  }
  
  flushTimer = setInterval(() => {
    flushEvents()
  }, interval)
}

/**
 * Stop automatic flush timer
 */
export function stopAnalytics(): void {
  if (flushTimer) {
    clearInterval(flushTimer)
    flushTimer = null
  }
  
  // Final flush
  flushEvents()
}

/**
 * Get current queue size
 */
export function getQueueSize(): number {
  return eventQueue.length
}

/**
 * Hook for React components to track events
 */
export function useAnalytics() {
  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackSectionView,
    trackPhoneClick,
    trackFormSubmit,
    trackBooking,
    trackLeadCreated,
    trackConversion,
    flushEvents,
    getQueueSize,
  }
}

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  initAnalytics()
  
  // Track initial page view
  trackPageView()
  
  // Track page views on navigation (for SPA)
  window.addEventListener('popstate', () => {
    trackPageView()
  })
  
  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    flushEvents()
  })
}

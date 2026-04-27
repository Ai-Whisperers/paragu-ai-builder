/**
 * Reminder Scheduler System
 * 
 * Manages follow-up reminders for leads:
 * - Schedule reminders based on lead status
 * - Recurring reminders for non-responsive leads
 * - Due date tracking and notifications
 */

export interface Reminder {
  id: string
  leadId: string
  type: 'follow_up' | 'meeting' | 'payment' | 'onboarding' | 'custom'
  title: string
  description?: string
  dueDate: Date
  status: 'pending' | 'completed' | 'snoozed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  completedAt?: Date
  snoozedUntil?: Date
  metadata?: Record<string, unknown>
}

export interface ReminderSchedule {
  leadStatus: string
  reminderType: Reminder['type']
  daysAfter: number
  title: string
  description: string
  priority: Reminder['priority']
}

// Default reminder schedules based on lead status
export const DEFAULT_REMINDER_SCHEDULES: ReminderSchedule[] = [
  {
    leadStatus: 'new',
    reminderType: 'follow_up',
    daysAfter: 1,
    title: 'Initial Outreach',
    description: 'Send initial WhatsApp or call to introduce Paragu-AI services',
    priority: 'high'
  },
  {
    leadStatus: 'new',
    reminderType: 'follow_up',
    daysAfter: 3,
    title: 'Follow-up: No Response',
    description: 'Send follow-up message if no response received',
    priority: 'medium'
  },
  {
    leadStatus: 'contacted',
    reminderType: 'follow_up',
    daysAfter: 2,
    title: 'Check Response Status',
    description: 'Verify if lead has responded to initial contact',
    priority: 'high'
  },
  {
    leadStatus: 'contacted',
    reminderType: 'follow_up',
    daysAfter: 5,
    title: 'Second Follow-up',
    description: 'Send second follow-up message',
    priority: 'medium'
  },
  {
    leadStatus: 'responded',
    reminderType: 'meeting',
    daysAfter: 1,
    title: 'Schedule Demo Meeting',
    description: 'Arrange a demo call to showcase the website preview',
    priority: 'high'
  },
  {
    leadStatus: 'meeting_scheduled',
    reminderType: 'meeting',
    daysAfter: 0,
    title: 'Prepare for Meeting',
    description: 'Generate preview site and prepare presentation',
    priority: 'high'
  },
  {
    leadStatus: 'onboarding',
    reminderType: 'onboarding',
    daysAfter: 1,
    title: 'Onboarding Check-in',
    description: 'Follow up on onboarding progress and answer questions',
    priority: 'medium'
  },
  {
    leadStatus: 'onboarding',
    reminderType: 'payment',
    daysAfter: 3,
    title: 'Payment Reminder',
    description: 'Send payment reminder for first subscription',
    priority: 'high'
  },
  {
    leadStatus: 'paying',
    reminderType: 'follow_up',
    daysAfter: 30,
    title: 'Monthly Check-in',
    description: 'Regular monthly check-in with paying customer',
    priority: 'low'
  },
  {
    leadStatus: 'churned',
    reminderType: 'follow_up',
    daysAfter: 30,
    title: 'Win-back Campaign',
    description: 'Reach out to churned customer with special offer',
    priority: 'medium'
  }
]

export class ReminderScheduler {
  private schedules: ReminderSchedule[]

  constructor(schedules: ReminderSchedule[] = DEFAULT_REMINDER_SCHEDULES) {
    this.schedules = schedules
  }

  // Generate reminders for a lead based on their status
  generateRemindersForLead(
    leadId: string,
    leadStatus: string,
    referenceDate: Date = new Date()
  ): Omit<Reminder, 'id' | 'createdAt'>[] {
    const applicableSchedules = this.schedules.filter(s => s.leadStatus === leadStatus)
    
    return applicableSchedules.map(schedule => {
      const dueDate = new Date(referenceDate)
      dueDate.setDate(dueDate.getDate() + schedule.daysAfter)
      
      return {
        leadId,
        type: schedule.reminderType,
        title: schedule.title,
        description: schedule.description,
        dueDate,
        status: 'pending',
        priority: schedule.priority
      }
    })
  }

  // Calculate next reminder date based on recurrence
  calculateNextReminderDate(
    currentDueDate: Date,
    recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  ): Date {
    const nextDate = new Date(currentDueDate)
    
    switch (recurrence) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1)
        break
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14)
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
    }
    
    return nextDate
  }

  // Get overdue reminders
  getOverdueReminders(reminders: Reminder[], asOf: Date = new Date()): Reminder[] {
    return reminders.filter(r => 
      r.status === 'pending' && r.dueDate < asOf
    ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  // Get upcoming reminders
  getUpcomingReminders(
    reminders: Reminder[],
    daysAhead: number = 7,
    asOf: Date = new Date()
  ): Reminder[] {
    const cutoffDate = new Date(asOf)
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead)
    
    return reminders.filter(r => 
      r.status === 'pending' && 
      r.dueDate >= asOf && 
      r.dueDate <= cutoffDate
    ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  // Get reminders by priority
  getRemindersByPriority(reminders: Reminder[], priority: Reminder['priority']): Reminder[] {
    return reminders.filter(r => r.priority === priority)
  }

  // Snooze a reminder
  snoozeReminder(reminder: Reminder, snoozeDays: number): Reminder {
    const snoozedUntil = new Date()
    snoozedUntil.setDate(snoozedUntil.getDate() + snoozeDays)
    
    return {
      ...reminder,
      status: 'snoozed',
      snoozedUntil
    }
  }

  // Complete a reminder
  completeReminder(reminder: Reminder): Reminder {
    return {
      ...reminder,
      status: 'completed',
      completedAt: new Date()
    }
  }

  // Get reminder statistics
  getReminderStats(reminders: Reminder[]): {
    total: number
    pending: number
    completed: number
    overdue: number
    snoozed: number
    highPriority: number
  } {
    const now = new Date()
    
    return {
      total: reminders.length,
      pending: reminders.filter(r => r.status === 'pending').length,
      completed: reminders.filter(r => r.status === 'completed').length,
      overdue: reminders.filter(r => r.status === 'pending' && r.dueDate < now).length,
      snoozed: reminders.filter(r => r.status === 'snoozed').length,
      highPriority: reminders.filter(r => r.priority === 'high' && r.status === 'pending').length
    }
  }

  // Create custom reminder
  createCustomReminder(
    leadId: string,
    title: string,
    description: string,
    dueDate: Date,
    priority: Reminder['priority'] = 'medium'
  ): Omit<Reminder, 'id' | 'createdAt'> {
    return {
      leadId,
      type: 'custom',
      title,
      description,
      dueDate,
      status: 'pending',
      priority
    }
  }
}

// Utility functions for working with reminders
export function formatReminderDate(date: Date): string {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Mañana'
  if (diffDays === -1) return 'Ayer'
  if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`
  if (diffDays <= 7) return `En ${diffDays} días`
  
  return date.toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'short'
  })
}

export function getReminderTypeLabel(type: Reminder['type']): string {
  const labels: Record<Reminder['type'], string> = {
    follow_up: 'Seguimiento',
    meeting: 'Reunión',
    payment: 'Pago',
    onboarding: 'Onboarding',
    custom: 'Personalizado'
  }
  return labels[type]
}

export function getPriorityColor(priority: Reminder['priority']): string {
  const colors: Record<Reminder['priority'], string> = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-blue-600 bg-blue-50'
  }
  return colors[priority]
}

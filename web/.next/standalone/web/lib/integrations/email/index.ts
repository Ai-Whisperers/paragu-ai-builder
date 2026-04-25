import type { EmailAdapter } from './types'
import { mailchimpAdapter } from './mailchimp'
import { resendAdapter } from './resend'

const ADAPTERS: Record<string, EmailAdapter> = {
  mailchimp: mailchimpAdapter,
  resend: resendAdapter,
}

export function getEmailAdapter(name: string | undefined): EmailAdapter | null {
  if (!name) return null
  return ADAPTERS[name.toLowerCase()] || null
}

export type { EmailAdapter, EmailConfig } from './types'

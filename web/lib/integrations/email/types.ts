import type { AdapterResult, Lead } from '../types'

export interface EmailConfig {
  apiKey?: string
  listId?: string
  fromAddress?: string
  fromName?: string
  transactionalApiKey?: string
}

export interface EmailAdapter {
  name: string
  subscribe(lead: Lead, config: EmailConfig): Promise<AdapterResult>
  sendTransactional?(
    to: string,
    subject: string,
    html: string,
    config: EmailConfig,
  ): Promise<AdapterResult>
}

import type { AdapterResult, Lead } from '../types'

export interface CrmAdapter {
  name: string
  submit(lead: Lead, config: CrmConfig): Promise<AdapterResult>
}

export interface CrmConfig {
  apiKey?: string
  portalId?: string
  endpoint?: string
  pipelineId?: string
}

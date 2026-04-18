import type { CrmAdapter } from './types'
import { hubspotAdapter } from './hubspot'
import { pipedriveAdapter } from './pipedrive'
import { notionAdapter } from './notion'

const ADAPTERS: Record<string, CrmAdapter> = {
  hubspot: hubspotAdapter,
  pipedrive: pipedriveAdapter,
  notion: notionAdapter,
}

export function getCrmAdapter(name: string | undefined): CrmAdapter | null {
  if (!name) return null
  return ADAPTERS[name.toLowerCase()] || null
}

export type { CrmAdapter, CrmConfig } from './types'

export interface Lead {
  id?: string
  siteSlug: string
  locale: string
  name: string
  email: string
  phone?: string
  country?: string
  programInterest?: string
  objective?: string
  source?: string
  referer?: string
  utm?: Record<string, string>
  createdAt?: string
}

export interface AdapterResult {
  ok: boolean
  error?: string
  externalId?: string
}

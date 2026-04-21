import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { encryptSecrets, decryptSecrets, preview } from './credential-crypto'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'

export interface CredentialRecord {
  id: string
  businessId: string
  provider: PaymentProvider
  publicConfig: Record<string, unknown>
  status: 'active' | 'paused' | 'archived'
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CredentialWithSecrets extends CredentialRecord {
  secrets: Record<string, string>
}

/** UI-safe view: never includes plaintext secrets, only previews. */
export interface CredentialPublicView extends CredentialRecord {
  secretPreviews: Record<string, string>
}

/** Save (insert-or-update) credentials for a business+provider pair. */
export async function upsertCredentials(opts: {
  businessId: string
  provider: PaymentProvider
  secrets: Record<string, string>
  publicConfig?: Record<string, unknown>
  notes?: string
  status?: 'active' | 'paused' | 'archived'
}): Promise<CredentialRecord> {
  const supabase = await createAdminClient()
  const encrypted = encryptSecrets(opts.secrets)

  const { data, error } = await supabase
    .from('business_payment_credentials')
    .upsert(
      {
        business_id: opts.businessId,
        provider: opts.provider,
        encrypted_secrets: encrypted,
        public_config: opts.publicConfig ?? {},
        notes: opts.notes ?? null,
        status: opts.status ?? 'active',
      },
      { onConflict: 'business_id,provider' },
    )
    .select('*')
    .single()

  if (error || !data) {
    logger.error('[commerce] upsertCredentials failed', {
      businessId: opts.businessId,
      provider: opts.provider,
      error: error?.message,
    })
    throw new Error('credential_upsert_failed')
  }
  return rowToRecord(data)
}

/** Internal: load + decrypt for use by checkout/router. NEVER expose to UI. */
export async function loadCredentialsWithSecrets(
  businessId: string,
  provider: PaymentProvider,
): Promise<CredentialWithSecrets | null> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('business_payment_credentials')
    .select('*')
    .eq('business_id', businessId)
    .eq('provider', provider)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    logger.error('[commerce] loadCredentialsWithSecrets failed', { businessId, provider, error: error.message })
    return null
  }
  if (!data) return null

  return {
    ...rowToRecord(data),
    secrets: decryptSecrets(data.encrypted_secrets),
  }
}

/** UI-safe list of all configured providers for a business. */
export async function listCredentialsForBusiness(businessId: string): Promise<CredentialPublicView[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('business_payment_credentials')
    .select('*')
    .eq('business_id', businessId)
    .order('provider', { ascending: true })

  return (Array.isArray(data) ? data : []).map((row) => {
    const secrets = decryptSecrets(row.encrypted_secrets)
    const previews: Record<string, string> = {}
    for (const [k, v] of Object.entries(secrets)) previews[k] = preview(v)
    return { ...rowToRecord(row), secretPreviews: previews }
  })
}

/** Returns the active providers a business has credentials for. Used by router. */
export async function listAvailableProviders(businessId: string): Promise<PaymentProvider[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('business_payment_credentials')
    .select('provider')
    .eq('business_id', businessId)
    .eq('status', 'active')
  return (Array.isArray(data) ? data : []).map((r) => r.provider as PaymentProvider)
}

/**
 * Providers that have platform-level env fallback credentials configured.
 *
 * Any tenant without per-merchant credentials installed still gets these
 * as usable options — that's how "out of the box every PY tenant accepts
 * Pagopar AND Bancard" works. The adapter itself reads process.env, so
 * availability here is synonymous with "env is set".
 *
 * Pulled from process.env directly (not the `env` module) so it's safe
 * to call in any runtime without pulling the full env validator chain.
 */
export function platformFallbackProviders(): PaymentProvider[] {
  const out: PaymentProvider[] = []
  if (process.env.PAGOPAR_PUBLIC_TOKEN && process.env.PAGOPAR_PRIVATE_TOKEN) {
    out.push('pagopar')
  }
  if (process.env.BANCARD_PUBLIC_KEY && process.env.BANCARD_PRIVATE_KEY) {
    out.push('bancard')
  }
  return out
}

/**
 * Union of merchant-installed credentials + platform env fallbacks.
 *
 * This is the set the router should consider when ranking providers:
 * the merchant's own accounts are preferred (lower-priority wins in
 * tie-breaks via `preferredProvider`), but a tenant who installed only
 * Pagopar still gets Bancard as a failover target when the platform
 * has Bancard env creds set — no admin action required per tenant.
 *
 * Returns `undefined` when neither installed nor fallback creds exist,
 * which signals the router to fall back to the full unrestricted
 * capability set rather than returning an empty list (backwards
 * compatibility with pre-widening behavior).
 */
export async function availableProvidersForCheckout(
  businessId: string,
): Promise<PaymentProvider[] | undefined> {
  const installed = await listAvailableProviders(businessId)
  const fallback = platformFallbackProviders()
  const set = new Set<PaymentProvider>([...installed, ...fallback])
  if (set.size === 0) return undefined
  return Array.from(set)
}

export async function deleteCredentials(businessId: string, provider: PaymentProvider): Promise<void> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('business_payment_credentials')
    .delete()
    .eq('business_id', businessId)
    .eq('provider', provider)
  if (error) throw new Error(error.message)
}

function rowToRecord(data: Record<string, unknown>): CredentialRecord {
  return {
    id: data.id as string,
    businessId: data.business_id as string,
    provider: data.provider as PaymentProvider,
    publicConfig: (data.public_config as Record<string, unknown>) ?? {},
    status: data.status as CredentialRecord['status'],
    notes: (data.notes as string | null) ?? null,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { createOrder, getOrder, CheckoutError } from '@/lib/commerce/orders'
import { rankProvidersForOrder, NoEligibleProviderError } from '@/lib/payments/router'
import { createCheckoutWithFailover, NoAvailableProviderError } from '@/lib/payments/failover'
import { listAvailableProviders } from '@/lib/commerce/payment-credentials'
import { CheckoutInputSchema } from '@/lib/schemas/commerce/order'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'

export const runtime = 'nodejs'

export const POST = withRequestLog<{ site: string }>(async (req, { log }, { site }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const body = await req.text()
  let json: unknown
  try {
    json = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = CheckoutInputSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  // Idempotency: cache {key + body_hash} response for 24h.
  // A replay with the same key but different body is rejected as a conflict
  // — it means the client thinks two distinct POSTs are the same, which is a bug.
  const idempotencyKey = req.headers.get('idempotency-key') ?? null
  const bodyHash = createHash('sha256').update(body).digest('hex')
  const supabase = await createAdminClient()
  if (idempotencyKey) {
    const { data: cached } = await supabase
      .from('idempotency_keys')
      .select('response_status, response_body, body_hash')
      .eq('business_id', business.id)
      .eq('key', idempotencyKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()
    if (cached) {
      if (cached.body_hash !== bodyHash) {
        return NextResponse.json({ error: 'idempotency_body_mismatch' }, { status: 409 })
      }
      return NextResponse.json(cached.response_body, { status: cached.response_status })
    }
  }

  let orderId: string
  try {
    orderId = await createOrder(business.id, parsed.data)
  } catch (err) {
    if (err instanceof CheckoutError) {
      const status = err.code === 'out_of_stock' ? 409 : err.code === 'cart_not_found_or_closed' ? 410 : 400
      return NextResponse.json({ error: err.code }, { status })
    }
    throw err
  }

  const order = await getOrder(business.id, orderId)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  // Restrict the rank to providers the merchant has installed credentials
  // for. Falls back to "no restriction" if the merchant has none configured
  // — in that case the platform's env-level Pagopar tokens are used.
  const installed = await listAvailableProviders(business.id)
  let providers: PaymentProvider[]
  try {
    providers = rankProvidersForOrder(
      order,
      business.preferredProvider as PaymentProvider | undefined,
      installed.length > 0 ? installed : undefined,
    )
  } catch (err) {
    if (err instanceof NoEligibleProviderError) {
      return NextResponse.json({ error: 'no_eligible_payment_provider' }, { status: 422 })
    }
    throw err
  }

  let routingResult
  try {
    routingResult = await createCheckoutWithFailover(order, providers, {
      returnUrl: `${appUrl}/s/es/${site}/orden/${order.id}`,
      webhookUrlFor: (p) => `${appUrl}/api/webhooks/${p}`,
    })
  } catch (err) {
    if (err instanceof NoAvailableProviderError) {
      return NextResponse.json({ error: 'all_providers_unavailable' }, { status: 502 })
    }
    throw err
  }

  const { session, provider, attempted } = routingResult

  await supabase.from('storefront_transactions').insert({
    business_id: business.id,
    order_id: order.id,
    provider,
    provider_preference_id: session.providerRef,
    status: 'created',
    amount_cents: order.totalCents,
    currency: order.currency,
    raw_payload: { failover_attempts: attempted },
  })

  const responseBody = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    redirectUrl: session.redirectUrl,
    sandbox: session.sandbox,
  }

  if (idempotencyKey) {
    await supabase.from('idempotency_keys').insert({
      business_id: business.id,
      key: idempotencyKey,
      body_hash: bodyHash,
      response_status: 200,
      response_body: responseBody,
    })
  }

  log.info('commerce.checkout.preference_created', {
    siteSlug: site,
    orderId: order.id,
    preferenceId: session.providerRef,
  })

  return NextResponse.json(responseBody)
})

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { createOrder, getOrder, CheckoutError } from '@/lib/commerce/orders'
import { rankProvidersForOrder, NoEligibleProviderError } from '@/lib/payments/router'
import { createCheckoutWithFailover, NoAvailableProviderError } from '@/lib/payments/failover'
import { availableProvidersForCheckout } from '@/lib/commerce/payment-credentials'
import { applyDiscount } from '@/lib/commerce/discounts'
import { getCartById } from '@/lib/commerce/cart'
import { computeCartTotals } from '@/lib/commerce/compute-totals'
import { quoteShippingForAddress } from '@/lib/commerce/shipping-zones'
import { CheckoutInputSchema } from '@/lib/schemas/commerce/order'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'
import {
  enqueueOrderEmail,
  enqueueAdminNewOrderEmail,
  resolveAdminEmail,
} from '@/lib/commerce/notifications'
import { recordCommerceFunnelEvent } from '@/lib/commerce/funnel'

// Extend the base CheckoutInputSchema to optionally accept a discountCode.
// The code is validated server-side against discounts table — never trust
// the client-computed discount amount.
const CheckoutWithDiscountSchema = CheckoutInputSchema.extend({
  discountCode: z.string().min(1).max(80).optional(),
})

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
  const parsed = CheckoutWithDiscountSchema.safeParse(json)
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

  // Resolve subtotal once; discount + shipping both need it.
  const cartForTotals = await getCartById(business.id, parsed.data.cartId)
  const { subtotalCents } = computeCartTotals(cartForTotals.items, cartForTotals.currency)

  // Discount (server-validated; client can't smuggle free orders).
  let discountCents = 0
  let freeShipping = false
  if (parsed.data.discountCode) {
    const dResult = await applyDiscount({
      businessId: business.id,
      code: parsed.data.discountCode,
      subtotalCents,
      customerEmail: parsed.data.customer.email,
    })
    if (dResult.valid) {
      discountCents = dResult.discountCents
      freeShipping = dResult.freeShipping
    } else {
      return NextResponse.json({ error: 'invalid_discount', reason: dResult.reason }, { status: 400 })
    }
  }

  // Shipping quote from address + zones. Free if the discount says so.
  let shippingCents = 0
  if (!freeShipping) {
    const addr = parsed.data.shipping.address
    const { amountCents } = await quoteShippingForAddress({
      businessId: business.id,
      country: addr.country,
      region: addr.department,
      subtotalCents,
    })
    shippingCents = amountCents
  }

  let orderId: string
  try {
    orderId = await createOrder(business.id, parsed.data, { discountCents, shippingCents })
  } catch (err) {
    if (err instanceof CheckoutError) {
      const status = err.code === 'out_of_stock' ? 409 : err.code === 'cart_not_found_or_closed' ? 410 : 400
      return NextResponse.json({ error: err.code }, { status })
    }
    throw err
  }

  const order = await getOrder(business.id, orderId)
  void recordCommerceFunnelEvent({
    businessId: business.id,
    eventType: 'order_created',
    orderId: order.id,
    amountCents: order.totalCents,
    currency: order.currency,
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  // Fire-and-forget order-confirmation + admin-notification emails via
  // the outbox. The commerce-email-flush cron picks them up on the next
  // tick and sends via Resend. We do NOT let failures block the payment
  // flow — outbox insert errors log + swallow.
  const storeOrderUrl = `${appUrl}/s/es/${site}/orden/${order.id}`
  const adminDashboardUrl = `${appUrl}/admin/commerce/${business.id}/orders/${order.id}`
  const adminEmail = resolveAdminEmail(business.dataJson)
  await Promise.all([
    enqueueOrderEmail({
      businessId: business.id,
      businessName: business.name,
      orderId: order.id,
      template: 'order_confirmation',
      order,
      storeUrl: storeOrderUrl,
    }).catch((err) =>
      log.warn('commerce.checkout.customer_email_enqueue_failed', {
        err: err instanceof Error ? err.message : String(err),
      }),
    ),
    enqueueAdminNewOrderEmail({
      businessId: business.id,
      businessName: business.name,
      order,
      adminEmail: adminEmail ?? '',
      adminDashboardUrl,
    }).catch((err) =>
      log.warn('commerce.checkout.admin_email_enqueue_failed', {
        err: err instanceof Error ? err.message : String(err),
      }),
    ),
  ])

  // Pick provider via capability matrix; failover on gateway 5xx/timeout.
  //
  // `available` is the UNION of:
  //   1. Providers the merchant has installed active credentials for
  //      (via admin UI → business_payment_credentials).
  //   2. Providers the PLATFORM has env-level fallback tokens set for
  //      (pagopar + bancard whenever their env vars are present).
  //
  // That union is what gives every tenant multi-provider availability
  // out of the box: a merchant with only Pagopar installed still gets
  // Bancard as a failover target when Pagopar returns 5xx, and a
  // merchant with ZERO installed creds still gets both providers
  // ranked via the capability matrix (with `preferredProvider` from
  // site.json as the tie-breaker).
  const available = await availableProvidersForCheckout(business.id)
  let providers: PaymentProvider[]
  try {
    providers = rankProvidersForOrder(
      order,
      business.preferredProvider as PaymentProvider | undefined,
      available,
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

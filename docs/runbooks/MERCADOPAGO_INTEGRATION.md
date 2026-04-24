# MercadoPago Integration - Implementation Guide

> Input specification document for MercadoPago payment integration. Fill out this file and paste it to the chat when providing integration details.

## Overview

This document specifies all information needed to implement MercadoPago payment processing for the Paragu-AI Builder platform. Complete this specification to enable MercadoPago integration in the admin panel and tenant sites.

---

## Section 1: Provider Configuration

Provide the following MercadoPago configuration details:

### MercadoPago Account Details
- **Public Key**: (Paste your MercadoPago public key)
- **Access Token**: (Paste your access token)
- **Account Email**: (Email associated with MercadoPago account)
- **Production Mode**: (Enable/disable production environment)

### Business Details
- **Business Name**: (Name of the business)
- **Business Category**: (Select from: restaurant, cafe, retail, service, etc.)
- **Website URL**: (The generated site URL)

### Integration Preferences
- **Payment Methods to Enable**:
  - [ ] Credit Card (Tarjeta de crédito)
  - [ ] Debit Card (Tarjeta de débito)
  - [ ] Pix (instant payment)
  - [ ] Cash (Efectivo)
- [ ] Other (specify): _______________

### Preferences
- **Auto-return URL**: (If enabled, users return to site after payment - specify URL or disabled)
- **Success Page**: (If enabled, show after payment - specify page or disabled)
- **Failure Page**: (If enabled, show error details - specify page or disabled)
- **Notification Email**: (Email to receive payment notifications)

---

## Section 2: Product/Service Catalog

Define the products or services that can be purchased via MercadoPago:

| Product/Service ID | Name | Price | Currency | Description | Category |
|------------------|------|-------|----------|----------|
| prod_001 | _______________ | _________________ | PYG | (e.g., Menu completo) | Food |
| prod_002 | _______________ | _________________ | PYG | (e.g., Servicio de consultoría) | Services |
| prod_003 | _______________ | _________________ | PYG | (e.g., Clase de yoga) | Classes |
| prod_004 | _______________ | _________________ | PYG | (e.g., Cita médica) | Healthcare |
| prod_005 | _______________ | _________________ | PYG | | (Add more as needed) | |

---

## Section 3: Integration Points

Specify which UI components need MercadoPago integration:

### Admin Panel
- [ ] Tenant payment configuration form (business_id, payment methods)
- [ ] Payment status dashboard (view all transactions)
- [ ] Subscription management (view recurring payments)
- [ ] Webhook handling page (receive MercadoPago notifications)
- [ ] Refund interface (process refunds)

### Tenant Frontend
- [ ] Checkout button on cart/booking pages
- [ ] MercadoPago payment component (render MercadoPago checkout)
- [ ] Payment method selector (show enabled methods)
- [ ] Payment success/error feedback (show after payment)
- [ ] Order status page (check payment status)

### Backend API
- [ ] Create payment intent endpoint (initiate MercadoPago payment)
- [ ] Webhook endpoint (receive MercadoPago notifications)
- [ ] Payment verification endpoint (validate MercadoPago payment ID)
- [ ] Refund endpoint (process MercadoPago refunds)
- [ ] Subscription management endpoints (create/renew/cancel subscriptions)
- [ ] Order status query (check payment by order ID)

---

## Section 4: Backend Implementation Requirements

### Database Schema
The payments table already has the following MercadoPago fields:

| Column | Type | Required | Description |
|--------|------|----------|----------|
| `payment_subscription_id` | TEXT | Yes | MercadoPago subscription/preference ID |
| `payment_payer_id` | TEXT | No | MercadoPago payer/customer ID |
| `payment_payment_id` | TEXT | Yes | MercadoPago payment ID (primary key) |
| `payment_order_id` | TEXT | Yes | MercadoPago order ID |
| `amount` | DECIMAL(10,2) | Yes | Payment amount |
| `currency` | TEXT | Yes | Always 'PYG' for Paraguay |
| `status` | TEXT | Yes | pending/completed/failed/refunded |

### API Endpoints to Implement

**Required Endpoints:**

#### 1. Payment Intent Creation
```
POST /api/payments/intent
Body: {
  business_id: UUID,
  provider: "mercadopago",
  amount: decimal,
  currency: "PYG",
  items: Array of { product_id, quantity }
}

Response: {
  intent_id: UUID,
  mercadopago_preference_id: string,
  redirect_url: string  // MercadoPago checkout URL
}
```

#### 2. Webhook Handler
```
POST /api/payments/webhooks/mercadopago
Headers: x-mercadopago-signature: YOUR_WEBHOOK_SECRET
Body: (MercadoPago webhook payload)
- Validate webhook signature
- Update payment status
- Create order records if needed

Response: { success: true }
```

#### 3. Payment Verification
```
GET /api/payments/verify?payment_id=xxx
Response: {
  payment_id: string,
  status: string,
  amount: decimal
  created_at: timestamp
}
```

#### 4. Order Status Query
```
GET /api/payments/orders/mercadopago?order_id=xxx
Response: {
  order_id: string,
  payment_id: string,
  status: string,
  amount: decimal
}
```

#### 5. Refund Processing
```
POST /api/payments/refund
Body: {
  payment_id: string,
  reason: string,
  amount: decimal
}

Response: { success: true, refund_id: string }
```

### Webhook Events to Handle

| Event | Action | Description |
|-------|--------|----------|
| `payment.created` | Update payment status to 'pending' |
| `payment.approved` | Update payment status to 'completed' |
| `payment.rejected` | Update payment status to 'failed', log reason |
| `payment.voided` | Update payment status to 'refunded' |
| `chargeback.created` | Handle chargeback notifications |

---

## Section 5: Technical Requirements

### MercadoPago SDK
- [ ] MercadoPago JavaScript/TypeScript SDK
- [ ] Install via npm: `npm install @mercadopago/sdk-js`
- [ ] SDK version: _______________

### Configuration Management
- Store MercadoPago public key in Supabase secrets (not in code)
- Store access token in secure storage with encryption
- Environment variable for MercadoPago preference ID

### Security
- [ ] Implement webhook signature verification (x-mercadopago-signature header)
- [ ] Validate all incoming webhook requests
- [ ] Use HTTPS for all MercadoPago API calls
- [ ] Never log full access tokens or payment IDs in application logs
- [ ] Implement IP whitelist for MercadoPago webhooks

### Error Handling
- Handle MercadoPago API errors gracefully
- Display user-friendly error messages in Paraguayan Spanish
- Implement retry logic for failed requests
- Log all errors with appropriate severity levels

### Testing Requirements
- [ ] Sandbox testing (MercadoPago provides sandbox environment)
- [ ] Test webhook delivery (use MercadoPago webhook testing tool)
- [ ] Verify payment flows end-to-end
- [ ] Test refund process
- [ ] Load testing with concurrent payments

---

## Section 6: Design Requirements

### Admin Panel
- [ ] MercadoPago configuration form with validation
- [ ] Payment method selection (checkboxes for enabled methods)
- [ ] Transaction list with filters (date, status, amount)
- [ ] Transaction detail view (show all MercadoPago fields)
- [ ] Refund form (payment_id, amount, reason)
- [ ] Webhook log viewer (show all received webhooks)

### Tenant Frontend
- [ ] MercadoPago checkout component (embedded iframe or redirect)
- [ ] Payment method selector icons/logos
- ] Loading states during payment processing
- [ ] Success/error animations and messaging
- [ ] Order status page with polling mechanism
- [ ] Mobile-responsive checkout

### User Experience
- Clear payment flow instructions before checkout
- Show accepted payment methods with icons
- Display total amount with currency symbol (PYG/Gs.)
- Provide estimated processing time
- Show payment confirmation receipt
- Link to support contact for payment issues

---

## Section 7: Deployment Configuration

### Environment Variables
```bash
MERCADOPAGO_PUBLIC_KEY=your_public_key_here
MERCADOPAGO_ACCESS_TOKEN=your_access_token_here
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret_here
MERCADOPAGO_PREFERENCE_ID=your_preference_id_here
```

### Webhook Configuration
- **Webhook URL**: Must be publicly accessible HTTPS endpoint
- **Webhook Secret**: Generate and configure in MercadoPago dashboard
- **Notifications**: email, SMS, or both (specify)
- **Retry Policy**: automatic retry for failed webhooks

### Feature Flags
```typescript
const MERCADOPAGO_ENABLED = process.env.MERCADOPAGO_ENABLED === 'true';
const ENABLED_PAYMENT_METHODS = ['credit_card', 'debit_card', 'pix', 'cash'];
```

---

## Section 8: Notes & Questions

### Questions for Implementation Team
1. Should MercadoPago use iframe checkout or redirect for consistency?
2. Do we need subscription management for recurring payments?
3. Should we support installments (cuotas) for products?
4. How should we handle multi-item cart payments (single payment vs split payments)?
5. Do we need MercadoPago recurring payments (assinaturas) or one-time only?

### Technical Decisions Needed
- [ ] Payment flow: Single payment vs. Authorization + Capture → Payment?
- [ ] Order creation: Auto-create orders before payment or manual?
- [ ] Webhook retry: Implement exponential backoff with jitter?
- [ ] Error handling: Show MercadoPago error codes or map to friendly messages?
- [ ] Idempotency: How to prevent duplicate payment processing?

---

## Section 9: Completion Checklist

### Phase 1: Configuration
- [ ] MercadoPago account created and configured
- [ ] Public key, access token, webhook secret obtained
- [ ] Environment variables set in Supabase
- [ ] Business details and preferences specified
- [ ] Product/service catalog defined

### Phase 2: Backend Implementation
- [ ] MercadoPago SDK installed and configured
- [ ] Payment intent endpoint implemented
- [ ] Webhook endpoint implemented with signature validation
- [ ] Payment verification endpoint implemented
- [ ] Order status query endpoint implemented
- [ ] Refund endpoint implemented
- [ ] Database migrations applied (payment provider standardization + examples)
- [ ] RLS policies updated for MercadoPago fields

### Phase 3: Admin Panel
- [ ] MercadoPago configuration form built
- [ ] Payment methods selection UI implemented
- [ ] Transaction list with filters built
- [ ] Transaction detail view with MercadoPago fields
- [ ] Refund interface implemented
- [ ] Webhook log viewer built
- [ ] Subscription management interface built

### Phase 4: Tenant Frontend
- [ ] MercadoPago checkout component integrated
- [ ] Payment method selector on cart/booking pages
- [ ] Success/error feedback components
- [ ] Order status page with polling
- [ ] Mobile-responsive checkout flow

### Phase 5: Testing & Deployment
- [ ] Sandbox testing completed
- [ ] Webhook delivery verified
- [ ] End-to-end payment flows tested
- [ ] Production deployment
- [ ] Monitoring and alerting configured
- [ ] User acceptance testing completed

---

## Section 10: Timeline

| Milestone | Target Date | Status | Dependencies |
|-----------|-------------|---------|-------------|
| MercadoPago account setup | ___ | Not Started | Configuration details |
| Backend API implementation | ___ | Not Started | SDK + webhooks |
| Admin panel UI | ___ | Not Started | Admin components |
| Tenant frontend | ___ | Not Started | Checkout + feedback |
| Testing & deployment | ___ | Not Started | Sandbox → Production |

---

**Instructions:**

1. **Fill out ALL sections** marked with `[ ]` checkboxes
2. **Provide ALL MercadoPago credentials** in Section 1
3. **Define products/services** in Section 2
4. **Specify which integration points** are needed in Section 3
5. **Answer questions** in Section 8 to clarify requirements
6. **Propose timeline** in Section 10 when ready to begin implementation

**When Complete:**
Paste this entire file back into the chat. I will use it to:
- Create implementation task breakdown
- Set up MercadoPago configuration in Supabase
- Implement all required backend endpoints
- Build admin and frontend components
- Deploy and test integration

---

_Last updated: April 24, 2026_

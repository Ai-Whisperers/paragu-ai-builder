# Commerce State Machine Reference

> Order state transitions, events, and business logic.

## States

```
                    ┌──────────┐
                    │   cart   │
                    └────┬─────┘
                         │ checkout
                         ▼
                    ┌──────────┐
                    │ pending  │
                    └────┬─────┘
                         │ payment confirmed
                         ▼
                    ┌───────────┐
                    │ confirmed │
                    └─────┬─────┘
                          │
                    ┌─────┴──────┐
                    ▼            ▼
              ┌──────────┐ ┌──────────┐
              │preparing │ │ canceled │
              └─────┬────┘ └──────────┘
                    │
                    ▼
              ┌──────────┐
              │ shipped  │
              └─────┬────┘
                    │
                    ▼
              ┌───────────┐
              │ delivered │
              └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │ completed │
              └───────────┘
```

## Transitions

| From | To | Trigger | Action |
|------|----|---------|--------|
| cart | pending | Checkout submitted | Create order, send confirmation email |
| pending | confirmed | Payment received | Update inventory, notify merchant |
| pending | canceled | Customer/admin cancels | No charge |
| confirmed | preparing | Merchant starts fulfillment | Notify customer |
| confirmed | canceled | Merchant cancels | Refund if paid |
| preparing | shipped | Shipped with tracking | Update tracking fields |
| shipped | delivered | Customer confirms receipt | Mark as delivered |
| delivered | completed | Post-purchase period | Request review |
| any | refunded | Refund processed | Update payment status |

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/commerce/state-machine.ts` | State machine logic |
| `web/lib/commerce/order-events.ts` | Order event audit log |
| `web/lib/commerce/notifications.ts` | State-based notifications |

## Audit Log

Every transition is recorded in `order_events` table:
```sql
INSERT INTO order_events (order_id, event_type, from_status, to_status, metadata)
VALUES ('<order-id>', 'status_change', 'pending', 'confirmed', '{"trigger": "payment_received"}');
```

---

_Last updated: April 24, 2026_

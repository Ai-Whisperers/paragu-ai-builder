# E-commerce / Retail — Intake Questionnaire

For online stores, retail shops, product catalogs, physical + online stores.

## Business

```json
{
  "id": "store_name",
  "kind": "text",
  "label": "Store name",
  "required": true
},
{
  "id": "product_category",
  "kind": "select",
  "label": "Main product category",
  "options": [
    { "value": "clothing", "label": "Clothing / Fashion" },
    { "value": "electronics", "label": "Electronics / Tech" },
    { "value": "home", "label": "Home & Decor" },
    { "value": "food", "label": "Food & Beverages" },
    { "value": "beauty", "label": "Beauty & Cosmetics" },
    { "value": "health", "label": "Health & Wellness" },
    { "value": "sports", "label": "Sports & Outdoors" },
    { "value": "toys", "label": "Toys & Games" },
    { "value": "adult", "label": "Adult / Intimate" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
},
{
  "id": "product_count",
  "kind": "number",
  "label": "Number of products",
  "min": 1,
  "max": 10000,
  "helpText": "For the initial catalog. Can be expanded later."
},
{
  "id": "has_physical_store",
  "kind": "radio",
  "label": "Do you have a physical store?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "Online only" }
  ]
}
```

## Payments & Shipping

```json
{
  "id": "payment_methods",
  "kind": "checkbox",
  "label": "Payment methods you want to accept",
  "options": [
    { "value": "mercado_pago", "label": "Mercado Pago" },
    { "value": "transfer", "label": "Bank transfer" },
    { "value": "cash", "label": "Cash on delivery" },
    { "value": "pagopar", "label": "Pagopar (cuotas)" },
    { "value": "bancard", "label": "Bancard" },
    { "value": "paypal", "label": "PayPal" }
  ],
  "required": true
},
{
  "id": "shipping_zones",
  "kind": "textarea",
  "label": "Shipping zones and costs",
  "placeholder": "e.g. Asunciòn: Gs 5,000 (free over Gs 100,000), Interior: Gs 15,000"
},
{
  "id": "has_discounts",
  "kind": "radio",
  "label": "Will you offer discount codes or promotions?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
}
```

## Advanced Features

```json
{
  "id": "wants_subscriptions",
  "kind": "radio",
  "label": "Do you want subscription/recurring orders?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
},
{
  "id": "wants_loyalty",
  "kind": "radio",
  "label": "Do you want a loyalty/rewards program?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
},
{
  "id": "wants_referral",
  "kind": "radio",
  "label": "Do you want a referral program?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
},
{
  "id": "age_restricted",
  "kind": "radio",
  "label": "Age-restricted products (18+)?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
}
```

## Inventory

```json
{
  "id": "inventory_tracking",
  "kind": "radio",
  "label": "Do you need real-time inventory tracking?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No, manual is fine" }
  ]
},
{
  "id": "low_stock_alerts",
  "kind": "radio",
  "label": "Low-stock alerts via email?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
}
```

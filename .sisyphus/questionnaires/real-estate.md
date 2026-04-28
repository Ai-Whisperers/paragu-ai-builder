# Real Estate — Intake Questionnaire

For real estate agencies, property developers, brokers, rental managers.

## Agency

```json
{
  "id": "agency_name",
  "kind": "text",
  "label": "Agency name",
  "required": true
},
{
  "id": "years_active",
  "kind": "number",
  "label": "Years active",
  "min": 0,
  "max": 50
},
{
  "id": "agent_count",
  "kind": "number",
  "label": "Number of agents",
  "min": 1,
  "max": 100
},
{
  "id": "property_types",
  "kind": "checkbox",
  "label": "Property types handled",
  "options": [
    { "value": "houses", "label": "Houses" },
    { "value": "apartments", "label": "Apartments / Departments" },
    { "value": "land", "label": "Land / Terrain" },
    { "value": "commercial", "label": "Commercial properties" },
    { "value": "rural", "label": "Rural / Farm properties" },
    { "value": "luxury", "label": "Luxury properties" }
  ]
}
```

## Listings

```json
{
  "id": "listing_count",
  "kind": "number",
  "label": "Number of active listings",
  "min": 0,
  "max": 5000
},
{
  "id": "listing_service",
  "kind": "radio",
  "label": "How do you want to manage listings?",
  "options": [
    { "value": "api", "label": "Fetch from our database automatically" },
    { "value": "manual", "label": "Add manually on the website" },
    { "value": "both", "label": "Both" }
  ],
  "required": true
},
{
  "id": "price_currency",
  "kind": "radio",
  "label": "Price display currency",
  "options": [
    { "value": "usd", "label": "USD" },
    { "value": "pyg", "label": "PYG (Guaraníes)" },
    { "value": "both", "label": "Both" }
  ]
}
```

## Transactions

```json
{
  "id": "transaction_types",
  "kind": "checkbox",
  "label": "Transaction types",
  "options": [
    { "value": "sale", "label": "Sales" },
    { "value": "rental", "label": "Rentals" },
    { "value": "temporary", "label": "Temporary / Short-term" }
  ]
},
{
  "id": "areas_covered",
  "kind": "textarea",
  "label": "Areas / cities you cover",
  "placeholder": "e.g. Asunción, Villa Morra, San Lorenzo, Luque"
}
```

## Mortgage

```json
{
  "id": "mortgage_calculator",
  "kind": "radio",
  "label": "Show mortgage calculator on property pages?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
}
```

# Relocation / Immigration / Legal — Intake Questionnaire

For relocation services, immigration lawyers, residency consultants, legal firms.

## Client Profile

```json
{
  "id": "nationality",
  "kind": "select",
  "label": "Country of origin",
  "options": [
    { "value": "netherlands", "label": "Netherlands" },
    { "value": "belgium", "label": "Belgium" },
    { "value": "luxembourg", "label": "Luxembourg" },
    { "value": "germany", "label": "Germany" },
    { "value": "spain", "label": "Spain" },
    { "value": "uk", "label": "United Kingdom" },
    { "value": "usa", "label": "United States" },
    { "value": "other_eu", "label": "Other EU country" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
},
{
  "id": "age",
  "kind": "select",
  "label": "Age range",
  "options": [
    { "value": "under_30", "label": "Under 30" },
    { "value": "30_45", "label": "30-45" },
    { "value": "45_60", "label": "45-60" },
    { "value": "over_60", "label": "Over 60" }
  ],
  "required": true
},
{
  "id": "family_members",
  "kind": "number",
  "label": "Number of family members relocating with you",
  "min": 0,
  "max": 15
},
{
  "id": "has_children",
  "kind": "radio",
  "label": "Do you have school-age children?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
}
```

## Relocation Goal

```json
{
  "id": "primary_goal",
  "kind": "select",
  "label": "Primary relocation goal",
  "options": [
    { "value": "residency", "label": "Permanent residency / tax residency" },
    { "value": "business", "label": "Set up a company and operate from Paraguay" },
    { "value": "investor", "label": "Invest in Paraguay (real estate, assets)" },
    { "value": "land", "label": "Buy land / rural property" },
    { "value": "lifestyle", "label": "Lifestyle change / retirement" },
    { "value": "multiple", "label": "Multiple goals" }
  ],
  "required": true
},
{
  "id": "timeline",
  "kind": "select",
  "label": "Desired timeline",
  "options": [
    { "value": "asap", "label": "ASAP (1-2 months)" },
    { "value": "quarter", "label": "Next quarter (3-6 months)" },
    { "value": "year", "label": "Within the year" },
    { "value": "researching", "label": "Just researching" }
  ],
  "required": true
}
```

## Income & Business

```json
{
  "id": "income_source",
  "kind": "select",
  "label": "Income source",
  "options": [
    { "value": "employed", "label": "Employee (salary)" },
    { "value": "self_employed", "label": "Self-employed / Freelance" },
    { "value": "business_owner", "label": "Business owner / Founder" },
    { "value": "investor", "label": "Investor (dividends, rent, trading)" },
    { "value": "retired", "label": "Retired / Pension" },
    { "value": "crypto", "label": "Crypto / Digital assets" }
  ],
  "required": true
},
{
  "id": "annual_income",
  "kind": "select",
  "label": "Annual income range (USD)",
  "options": [
    { "value": "under_50k", "label": "Under $50,000" },
    { "value": "50k_100k", "label": "$50,000 - $100,000" },
    { "value": "100k_250k", "label": "$100,000 - $250,000" },
    { "value": "250k_500k", "label": "$250,000 - $500,000" },
    { "value": "over_500k", "label": "Over $500,000" }
  ],
  "required": true
},
{
  "id": "has_company",
  "kind": "radio",
  "label": "Do you already have an offshore company?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
}
```

## Services Needed

```json
{
  "id": "services_needed",
  "kind": "checkbox",
  "label": "Services you need",
  "options": [
    { "value": "residency", "label": "Permanent residency processing" },
    { "value": "cedula", "label": "Cédula (ID card)" },
    { "value": "company", "label": "Company incorporation" },
    { "value": "bank_account", "label": "Bank account opening" },
    { "value": "ruc", "label": "RUC (tax ID) registration" },
    { "value": "accounting", "label": "Accounting / tax filing" },
    { "value": "land_search", "label": "Land / property search" },
    { "value": "legal_advice", "label": "Legal advisory" }
  ],
  "required": true
}
```

## Currently Considering

```json
{
  "id": "previous_visit",
  "kind": "radio",
  "label": "Have you visited Paraguay before?",
  "options": [
    { "value": "yes", "label": "Yes, multiple times" },
    { "value": "once", "label": "Yes, once" },
    { "value": "no", "label": "No, first time" }
  ]
},
{
  "id": "languages",
  "kind": "checkbox",
  "label": "Languages you speak",
  "options": [
    { "value": "spanish", "label": "Spanish" },
    { "value": "english", "label": "English" },
    { "value": "dutch", "label": "Dutch" },
    { "value": "german", "label": "German" },
    { "value": "portuguese", "label": "Portuguese" },
    { "value": "french", "label": "French" }
  ]
},
{
  "id": "notes",
  "kind": "textarea",
  "label": "Additional notes or questions",
  "placeholder": "Any specific concerns or questions about the process..."
}
```

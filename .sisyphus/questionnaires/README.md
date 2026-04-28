# Client Questionnaires

This directory contains standardized intake questionnaires for every business vertical. Each file is a complete question set ready to be copied into a tenant's content JSON file.

## How to use

1. Pick the questionnaire for the client's business type (e.g. `peluqueria.md` for a salon)
2. Copy the `questions` array into the tenant's locale content file at `sites/<slug>/content/<locale>.json`
3. Add the `intake-questionnaire` section to the corresponding page config at `sites/<slug>/pages/<page>.json`
4. The section renders automatically — no code changes needed

## Questionnaire structure

Each questionnaire is an array of `IntakeQuestion` objects:

```json
{
  "id": "unique_field_name",
  "kind": "text | textarea | radio | checkbox | select | number",
  "label": "Question text shown to the client",
  "placeholder": "Placeholder text (optional)",
  "helpText": "Helper text below the field (optional)",
  "required": true,
  "options": [
    { "value": "option_value", "label": "Option label shown" }
  ],
  "min": 0,
  "max": 1000000
}
```

## Question kinds

| Kind | Renders as | Use for |
|---|---|---|
| `text` | Single-line input | Names, short answers |
| `textarea` | Multi-line input | Descriptions, long answers |
| `radio` | Radio button group | Single choice from options |
| `checkbox` | Checkbox group | Multiple choices from options |
| `select` | Dropdown | Single choice, many options |
| `number` | Number input | Budgets, quantities, counts |

## Questionnaires available

| File | Vertical | Use case |
|---|---|---|
| `general-business.md` | All | Generic small business website |
| `peluqueria.md` | Beauty/Salon | Hair salon, barbershop, esthetics |
| `restaurant.md` | Food & Beverage | Restaurant, cafe, bar |
| `relocation.md` | Relocation/Legal | Residency, immigration, legal services |
| `ecommerce.md` | Retail/E-commerce | Online store, product catalog |
| `professional-services.md` | B2B Professional | Consulting, law, accounting |
| `healthcare.md` | Health & Medical | Clinic, dental, vet |
| `real-estate.md` | Real Estate | Property listings, agency |
| `fitness.md` | Fitness & Wellness | Gym, yoga, pilates, studio |
| `portfolio.md` | Creative Portfolio | Photographer, designer, artist |

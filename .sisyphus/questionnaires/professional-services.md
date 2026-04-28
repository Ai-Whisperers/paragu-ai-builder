# Professional Services — Intake Questionnaire

For lawyers, accountants, consultants, architects, engineers, agencies, notaries.

## Firm Info

```json
{
  "id": "firm_name",
  "kind": "text",
  "label": "Firm / practice name",
  "required": true
},
{
  "id": "practice_area",
  "kind": "select",
  "label": "Primary practice area",
  "options": [
    { "value": "law", "label": "Law / Legal" },
    { "value": "accounting", "label": "Accounting / Tax" },
    { "value": "consulting", "label": "Business consulting" },
    { "value": "architecture", "label": "Architecture / Design" },
    { "value": "engineering", "label": "Engineering" },
    { "value": "it_consulting", "label": "IT / Tech consulting" },
    { "value": "marketing", "label": "Marketing / Advertising" },
    { "value": "real_estate", "label": "Real estate / Property" },
    { "value": "financial", "label": "Financial advisory" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
},
{
  "id": "years_established",
  "kind": "number",
  "label": "Years established",
  "min": 0,
  "max": 100
},
{
  "id": "team_size",
  "kind": "number",
  "label": "Team size",
  "min": 1,
  "max": 500,
  "helpText": "For the team/about section."
}
```

## Services

```json
{
  "id": "services_list",
  "kind": "textarea",
  "label": "List your main services (one per line)",
  "placeholder": "e.g. Corporate law\nTax planning\nContract review\nM&A advisory",
  "helpText": "We'll create service cards for each one."
},
{
  "id": "service_format",
  "kind": "radio",
  "label": "Service format",
  "options": [
    { "value": "hourly", "label": "Hourly billing" },
    { "value": "fixed", "label": "Fixed fee per project" },
    { "value": "both", "label": "Both" },
    { "value": "consultation", "label": "Free consultation, then custom quote" }
  ]
},
{
  "id": "show_prices",
  "kind": "radio",
  "label": "Show prices on website?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "range", "label": "Show starting from" },
    { "value": "no", "label": "No prices" }
  ]
}
```

## Credentials & Trust

```json
{
  "id": "licenses",
  "kind": "textarea",
  "label": "Licenses, certifications, bar numbers",
  "placeholder": "e.g. CPA License #12345, Bar Association of Paraguay"
},
{
  "id": "languages",
  "kind": "checkbox",
  "label": "Languages your team speaks",
  "options": [
    { "value": "spanish", "label": "Spanish" },
    { "value": "english", "label": "English" },
    { "value": "portuguese", "label": "Portuguese" },
    { "value": "german", "label": "German" },
    { "value": "dutch", "label": "Dutch" },
    { "value": "guarani", "label": "Guaraní" }
  ]
},
{
  "id": "has_case_studies",
  "kind": "radio",
  "label": "Do you have case studies or client results to share?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "Not yet" }
  ]
}
```

## Booking

```json
{
  "id": "consultation_type",
  "kind": "select",
  "label": "How do clients book consultations?",
  "options": [
    { "value": "calendly", "label": "Calendly / online booking" },
    { "value": "whatsapp", "label": "WhatsApp" },
    { "value": "phone", "label": "Phone call" },
    { "value": "form", "label": "Contact form" }
  ],
  "required": true
}
```

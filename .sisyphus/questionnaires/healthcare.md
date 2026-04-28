# Healthcare / Medical — Intake Questionnaire

For clinics, dental practices, veterinary clinics, specialists, labs.

## Practice Info

```json
{
  "id": "practice_name",
  "kind": "text",
  "label": "Practice / clinic name",
  "required": true
},
{
  "id": "specialty",
  "kind": "select",
  "label": "Medical specialty",
  "options": [
    { "value": "general_dental", "label": "General dentistry" },
    { "value": "specialty_dental", "label": "Dental specialty (ortho, implant, etc.)" },
    { "value": "general_medicine", "label": "General medicine / family" },
    { "value": "pediatrics", "label": "Pediatrics" },
    { "value": "dermatology", "label": "Dermatology" },
    { "value": "gynecology", "label": "Gynecology / Obstetrics" },
    { "value": "ophthalmology", "label": "Ophthalmology / Optometry" },
    { "value": "veterinary", "label": "Veterinary" },
    { "value": "psychology", "label": "Psychology / Psychiatry" },
    { "value": "physical_therapy", "label": "Physical therapy / Rehabilitation" },
    { "value": "cosmetic", "label": "Cosmetic / Aesthetic medicine" },
    { "value": "laboratory", "label": "Clinical laboratory" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
},
{
  "id": "doctors_count",
  "kind": "number",
  "label": "Number of doctors / specialists",
  "min": 1,
  "max": 50
}
```

## Services

```json
{
  "id": "services_details",
  "kind": "textarea",
  "label": "List your main services/procedures",
  "placeholder": "e.g. General checkup, Dental cleaning, Root canal, Whitening"
},
{
  "id": "emergency_service",
  "kind": "radio",
  "label": "Do you offer emergency services?",
  "options": [
    { "value": "yes_24h", "label": "Yes, 24/7" },
    { "value": "yes_hours", "label": "Yes, during business hours" },
    { "value": "no", "label": "No" }
  ]
}
```

## Booking & Patients

```json
{
  "id": "booking_method",
  "kind": "select",
  "label": "How do patients book appointments?",
  "options": [
    { "value": "phone", "label": "Phone call" },
    { "value": "whatsapp", "label": "WhatsApp" },
    { "value": "online", "label": "Online booking" },
    { "value": "walkin", "label": "Walk-ins" }
  ],
  "required": true
},
{
  "id": "insurance_accepted",
  "kind": "textarea",
  "label": "Insurance plans accepted",
  "placeholder": "e.g. IPS, San Cristóbal, Migdal"
},
{
  "id": "new_patients",
  "kind": "radio",
  "label": "Accepting new patients?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "limited", "label": "Limited" },
    { "value": "no", "label": "Not at this time" }
  ]
}
```

## Credentials

```json
{
  "id": "licenses_registrations",
  "kind": "textarea",
  "label": "Licenses, registrations, certifications",
  "placeholder": "e.g. MSPBS #12345, Board Certified"
}
```

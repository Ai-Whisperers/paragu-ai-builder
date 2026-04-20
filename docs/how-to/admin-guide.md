# Admin Guide

Guide for using the Paragu-AI Builder admin dashboard.

## Accessing the Dashboard

Navigate to `/admin` in your deployment:

```
Production: https://paragu-ai.pages.dev/admin
Local: http://localhost:3000/admin
```

## Dashboard Overview

The admin dashboard provides:

- **Lead Management:** View and manage business leads
- **Site Generation:** Create preview sites for leads
- **Analytics:** Track conversion metrics
- **Settings:** Configure platform settings

## Lead Management

### Viewing Leads

Navigate to `/admin/leads` to see all leads:

**Columns:**
- **Negocio:** Business name and priority tier
- **Tipo:** Business type (peluqueria, gimnasio, etc.)
- **Ubicación:** City and neighborhood
- **Score:** Priority score (0-100)
- **Estado:** Current status
- **Contacto:** Quick contact actions
- **Acciones:** View details and generate preview

### Filtering Leads

Use the filter bar to find specific leads:

| Filter | Options |
|--------|---------|
| Estado | new, contacted, paying, churned, etc. |
| Tipo | peluqueria, gimnasio, spa, etc. |
| Ciudad | Asunción, Luque, San Lorenzo, etc. |
| Prioridad | A, B, C, D |

**Search:** Use the search box to find by business name.

### Lead Statuses

| Status | Description | Next Action |
|--------|-------------|-------------|
| new | Just imported | Review and prioritize |
| enriched | Data enhanced | Generate preview |
| demo_ready | Preview generated | Send to lead |
| contacted | Initial outreach | Follow up |
| responded | Lead replied | Schedule meeting |
| meeting_scheduled | Meeting set | Prepare demo |
| onboarding | Setting up account | Guide through setup |
| paying | Active customer | Support & retain |
| churned | Cancelled | Win-back campaign |

### Updating Lead Status

1. Click the lead row to open details
2. Click "Cambiar Estado" button
3. Select new status from dropdown
4. (Optional) Add notes about the status change

### Contacting Leads

**Via WhatsApp:**
1. Click the WhatsApp icon (green circle)
2. Opens WhatsApp Web with pre-filled message
3. Personalize and send

**Via Phone:**
1. Click the phone icon (blue circle)
2. Opens phone dialer

**Via Instagram:**
1. Click the Instagram icon (pink circle)
2. Opens Instagram profile

## Generating Preview Sites

### Create Preview

1. Find lead in the list
2. Click "Generar Preview" button
3. System generates site in ~30 seconds
4. Preview URL appears in lead details

### Share Preview

1. Open lead details panel
2. Copy preview URL
3. Send via WhatsApp/email

Preview URLs format:
```
https://paragu-ai.pages.dev/preview/[lead-id]
```

### Preview Features

Previews include:
- Business name and branding
- Services and pricing
- Contact information
- WhatsApp integration
- Mobile-responsive design

## Analytics

### Dashboard Metrics

Located at `/admin/analytics`:

| Metric | Description |
|--------|-------------|
| Total Leads | All leads in system |
| Conversion Rate | % of leads → paying |
| Avg. Time to Convert | Days from first contact |
| Revenue | Estimated from subscriptions |

### Lead Funnel

Visual funnel showing:
1. Total identified businesses
2. Contacted
3. Responded
4. Meeting scheduled
5. Onboarding
6. Paying customers

## Importing Leads

### CSV Import

1. Go to `/admin/leads/import`
2. Upload CSV file with columns:
   - business_name
   - phone
   - city
   - business_type
   - (optional) instagram, address, etc.
3. Map columns to database fields
4. Preview import
5. Confirm import

### CSV Format

```csv
business_name,phone,city,business_type
Salon Maria,+595981123456,Asuncion,peluqueria
Gym Fit,+595981789012,Luque,gimnasio
```

## User Management

### Adding Admin Users

1. Go to `/admin/users`
2. Click "Agregar Usuario"
3. Enter email and role
4. Send invitation

### Roles

| Role | Permissions |
|------|-------------|
| admin | Full access |
| manager | Leads + previews |
| viewer | View only |

## Settings

### Platform Settings

Access at `/admin/settings`:

**General:**
- Site name
- Default language
- Timezone

**Integrations:**
- MercadoPago credentials
- WhatsApp API settings
- Email SMTP settings

**Notifications:**
- New lead alerts
- Payment notifications
- Weekly reports

## Workflows

### Outreach Workflow

```
1. Filter leads by "new" status
2. Sort by priority score (highest first)
3. Click WhatsApp icon to contact
4. Update status to "contacted"
5. Set reminder for follow-up
6. If no response in 3 days, try again
```

### Demo Workflow

```
1. Find lead with "enriched" status
2. Click "Generar Preview"
3. Wait for generation (check status)
4. Open preview URL to verify
5. Copy URL and send via WhatsApp
6. Update status to "demo_ready"
7. Follow up in 2 days
```

### Conversion Workflow

```
1. Lead shows interest → schedule meeting
2. Update status to "meeting_scheduled"
3. During meeting: customize preview
4. If they want to proceed → "onboarding"
5. Help them complete setup
6. Collect payment → "paying"
```

## Best Practices

### Lead Prioritization

Focus on leads with:
- Priority tier A or B
- No existing website
- High review count
- Located in major cities

### Outreach Timing

- **Best days:** Tuesday - Thursday
- **Best times:** 10am - 12pm, 2pm - 4pm
- **Avoid:** Weekends, early mornings

### Message Templates

**Initial Contact:**
```
Hola [name]! Soy de Paragu-AI. Veo que no tienen 
sitio web aún. Podemos crearles uno profesional 
para atraer más clientes. ¿Tienen 5 minutos 
para conversar?
```

**Follow-up:**
```
Hola [name]! Te escribí hace unos días sobre 
crear un sitio web para [business]. ¿Tuviste 
tiempo de ver la demo que te envié?
```

### Data Quality

- Update lead info when contacted
- Add notes about conversations
- Tag leads by interest level
- Mark disqualified leads appropriately

## Troubleshooting

### Can't Access Admin

- Check you're logged in
- Verify your account has admin role
- Try clearing cookies and logging in again

### Lead Not Appearing

- Check filters aren't hiding it
- Verify import was successful
- Check lead status isn't "archived"

### Preview Not Generating

- Check business data is complete
- Verify token file exists
- Check build logs for errors

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search box |
| `Esc` | Close details panel |
| `Ctrl/Cmd + Enter` | Save changes |
| `?` | Show keyboard shortcuts |

## Support

For dashboard issues:

1. Check browser console for errors
2. Verify you're on latest version
3. Contact: support@paragu-ai.com

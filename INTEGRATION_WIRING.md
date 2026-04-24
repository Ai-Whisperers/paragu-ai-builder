# Integration Wiring Guide

**Purpose**: Replace placeholder integration IDs with real Hubspot, Mailchimp, and GA4 credentials.

**Status**: All 6 production sites have placeholder integration IDs that need to be replaced before production deployment.

---

## Placeholder IDs Currently in Use

### Hubspot
- **Portal ID**: `HS-PORTAL-PARAGUAI`
- **Form ID**: `contact-form-paragu-ai`

### Mailchimp
- **Audience ID**: `audience-paragu-ai-newsletter`

### GA4
- **Measurement ID**: `G-XXXXXXXXXXX` (or `R-XXXXXXXXXX` for de-abasto-a-casa)
- **Stream Name**: `paragu-ai-builder` (or `paragu-ai-builder-de-abasto`)

---

## Sites Using Placeholders

All 6 production sites currently use placeholder IDs:
- nexa-paraguay
- nexa-propiedades
- dayah-litworks
- de-abasto-a-casa
- superspuma
- fun4me

---

## Step-by-Step Replacement

### 1. Get Real Hubspot Credentials

1. Go to [Hubspot Dashboard](https://app.hubspot.com/)
2. Navigate to **Settings → Website → Pages → Domain**
3. Note your **Portal ID** (format: `HS-XXXXXXX`)
4. Navigate to **Marketing → Lead Capture → Forms**
5. Find or create contact form for each site
6. Note the **Form ID** (format: `XXXXXXXX-XXXX-XXXX-XXXX`)

### 2. Get Real Mailchimp Audience IDs

1. Go to [Mailchimp Dashboard](https://admin.mailchimp.com/)
2. Navigate to **Audience → All Contacts**
3. For each site, create or identify the target audience
4. Click audience → Settings → **Audience ID** (format: `XXXXXXXXXX`)

### 3. Get Real GA4 Measurement IDs

1. Go to [Google Analytics](https://analytics.google.com/)
2. Navigate to **Admin → Data Streams → Web**
3. For each site, note the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 4. Update Site Configs

For each production site, update `sites/<site-slug>/site.json`:

```json
{
  "integrations": {
    "hubspot": {
      "portalId": "REAL_PORTAL_ID",
      "formId": "REAL_FORM_ID"
    },
    "mailchimp": {
      "audienceId": "REAL_AUDIENCE_ID"
    },
    "analytics": {
      "ga4": {
        "measurementId": "REAL_MEASUREMENT_ID",
        "streamName": "REAL_STREAM_NAME"
      }
    }
  }
}
```

**Example for nexa-paraguay:**
```json
{
  "integrations": {
    "hubspot": {
      "portalId": "HS-12345678",
      "formId": "abc123-def4-5678-gh901"
    },
    "mailchimp": {
      "audienceId": "87654321"
    },
    "analytics": {
      "ga4": {
        "measurementId": "G-ABCDEFGHIJK",
        "streamName": "nexa-paraguay-production"
      }
    }
  }
}
```

### 5. Test Integrations

After updating configs, test each integration:

**Test Hubspot Form Submission:**
```bash
# Submit test form to each site
curl -X POST https://paragu-ai.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"site":"nexa-paraguay","fullName":"Test User","workEmail":"test@example.com","inquiry":"Test submission"}'
```

**Test GA4 Tracking:**
1. Open each site in browser
2. Open Chrome DevTools → Network tab
3. Look for requests to `google-analytics.com`
4. Verify Measurement ID is real (not `G-XXXXXXXXXXX`)

**Test Mailchimp Newsletter Signup:**
1. Find newsletter signup form on each site
2. Submit test email
3. Verify email received in Mailchimp audience

---

## Site-by-Site Credential Table

| Site | Hubspot Portal ID | Hubspot Form ID | Mailchimp Audience ID | GA4 Measurement ID | GA4 Stream Name |
|-------|-------------------|------------------|---------------------|-------------------|------------------|
| nexa-paraguay | HS-PORTAL-PARAGUAI | contact-form-paragu-ai | audience-paragu-ai-newsletter | G-XXXXXXXXXXX | paragu-ai-builder |
| nexa-propiedades | HS-PORTAL-PARAGUAI | contact-form-paragu-ai | audience-paragu-ai-newsletter | G-XXXXXXXXXXX | paragu-ai-builder |
| dayah-litworks | HS-PORTAL-PARAGUAI | contact-form-paragu-ai | audience-paragu-ai-newsletter | G-XXXXXXXXXXX | paragu-ai-builder |
| de-abasto-a-casa | HS-PORTAL-PARAGUAI | contact-form-paragu-ai | audience-paragu-ai-newsletter | R-XXXXXXXXXX | paragu-ai-builder-de-abasto |
| superspuma | HS-PORTAL-PARAGUAI | contact-form-paragu-ai | audience-paragu-ai-newsletter | R-XXXXXXXXXX | paragu-ai-builder-de-abasto |
| fun4me | HS-PORTAL-PARAGUAI | contact-form-paragu-ai | audience-paragu-ai-newsletter | G-XXXXXXXXXXX | paragu-ai-builder |

---

## Quick Update Command

To update all sites at once with real credentials, create a credentials JSON:

```json
{
  "hubspot": {
    "portalId": "HS-REAL-ID",
    "formId": "REAL-FORM-ID"
  },
  "mailchimp": {
    "audienceId": "REAL-AUDIENCE-ID"
  },
  "ga4": {
    "measurementId": "G-REAL-ID",
    "streamName": "real-stream-name"
  }
}
```

Then run:
```bash
cd web
npx tsx scripts/wire-integrations.ts --credentials ../integrations/real-credentials.json
```

---

## Next Steps After Integration Wiring

1. Test all contact forms submit to Hubspot
2. Verify GA4 tracking fires on page loads
3. Confirm Mailchimp newsletter signups work
4. Run production health check:
   ```bash
   npm run production:health
   ```
5. Deploy to production:
   ```bash
   npm run deploy
   ```

---

**Created**: 2026-04-24
**Status**: READY FOR INTEGRATION WIRING
**Priority**: HIGH (blocking production deployment)

# API Endpoints

Complete reference of all API routes in the Paragu-AI Builder application.

## Base URL

```
Production: https://paragu-ai.pages.dev
Local: http://localhost:3000
```

## Health Check

### GET /api/health
Returns the health status of the API.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-19T12:00:00Z"
}
```

## Business Sites

### GET /[business]
Renders a generated business website.

**Parameters:**
- `business` (path): The unique slug of the business

**Example:** `/salon-maria`

## Admin Dashboard

### GET /admin
Main admin dashboard.

### GET /admin/leads
Lead management dashboard with filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by lead status (new, contacted, paying, etc.)
- `type` (optional): Filter by business type
- `city` (optional): Filter by city
- `priority` (optional): Filter by priority tier (A, B, C, D)
- `search` (optional): Search by business name
- `page` (optional): Page number for pagination (default: 1)

### GET /admin/leads/[id]
View individual lead details.

## API Routes (Server)

### POST /api/webhooks/mercadopago
MercadoPago webhook for payment notifications.

**Headers:**
- `x-signature`: MercadoPago signature for verification

**Body:** Payment notification payload from MercadoPago

### POST /api/leads/import
Import leads from CSV file.

**Body:**
```json
{
  "file": "<CSV file content>",
  "options": {
    "skipExisting": true,
    "dryRun": false
  }
}
```

### GET /api/businesses
List all active businesses.

**Query Parameters:**
- `type` (optional): Filter by business type
- `city` (optional): Filter by city

**Response:**
```json
{
  "data": [
    {
      "slug": "salon-maria",
      "name": "Salon Maria",
      "type": "peluqueria",
      "city": "Asunción"
    }
  ]
}
```

### GET /api/businesses/[slug]
Get details for a specific business.

**Response:**
```json
{
  "slug": "salon-maria",
  "name": "Salon Maria",
  "type": "peluqueria",
  "services": [...],
  "team": [...]
}
```

## Static Generation

### GET /[business]/services
Services page for a business (SSG).

### GET /[business]/galeria
Gallery page for a business (SSG).

### GET /[business]/equipo
Team page for a business (SSG).

### GET /[business]/contacto
Contact page for a business (SSG).

## WebSocket (Real-time)

### /realtime/v1
Supabase Realtime WebSocket connection for live updates.

**Use Cases:**
- Live lead updates
- Booking notifications
- Admin dashboard sync

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

API endpoints are rate-limited per IP:
- 100 requests per minute for general endpoints
- 10 requests per minute for import/export endpoints

## Authentication

Most admin endpoints require authentication via:
- Session cookie (for browser access)
- JWT token in `Authorization: Bearer <token>` header (for API access)

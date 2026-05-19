## WhatsApp AI Agent — Multi-Client Integration

### Overview
Every client website should eventually have its own WhatsApp Business number connected to the AI Agent, so customers can chat naturally for support, sales, and inquiries.

### Architecture
```
Client Website → WhatsApp float button → Client's WhatsApp Business
                                                ↓
                                    Evolution API Instance
                                                ↓
                                    Webhook → WhatsApp AI Agent
                                                ↓
                                    AI (DeepSeek + LightRAG + Business Tools)
                                                ↓
                                    Reply sent via Evolution API
```

### Integration Points Per Client

**1. Static sites (no database):** Add a file `docs/whatsapp-ai-integration.md` with:
- The client's instance name (created via POST /clients)
- Their business info (policies, hours, FAQ) for the AI knowledge base
- QR code for connecting their WhatsApp Business

**2. Sites with existing WhatsApp float:** Replace static WhatsApp number link with a reference to the AI-powered instance. The bot handles initial conversations, escalates to human when needed.

**3. Sites with Supabase (El Viajero, Vete, etc.):** The AI Agent already integrates with Supabase for real-time product/order lookups. Add `docs/whatsapp-ai-integration.md` pointing to the shared supabase project.

### Deployment Steps for Any Client

```bash
# 1. Create Evolution instance + get QR
curl -X POST https://whatsapp-ai.sunstein.cloud/clients \
  -H "Content-Type: application/json" \
  -d '{"name": "CLIENT_NAME", "phone": "CLIENT_PHONE", "mode": "ventas"}'

# 2. Client scans QR with WhatsApp Business app
# 3. Seed business knowledge into LightRAG
curl -X POST http://127.0.0.1:9623/documents/text \
  -H "Content-Type: application/json" \
  -d '{"text": "CLIENT_BUSINESS_INFO", "description": "Client name - business info"}'

# 4. Done. AI handles customer messages.
```

### Current Live Service
- **URL:** https://whatsapp-ai.sunstein.cloud
- **Health:** GET /health
- **Clients:** GET /clients
- **Onboard:** POST /clients

# Hostinger + Cloudflare Setup Guide

## Overview
Host the Paragu-AI Builder on **Hostinger VPS** while using **Cloudflare** for DNS, CDN, and SSL.

## Architecture
```
User → Cloudflare (DNS/CDN/SSL) → Hostinger VPS (Node.js App)
```

---

## Step 1: Sign Up for Hostinger

1. Go to: https://www.hostinger.com/
2. Choose **VPS Hosting** (recommended) or **Cloud Hosting**
3. Recommended plan: **KVM 2** ($6.99/month) or higher
   - 2 vCPU
   - 8GB RAM
   - 100GB SSD
   - This matches your current setup

---

## Step 2: Set Up Hostinger VPS

### 2.1 Create VPS
1. In Hostinger dashboard, click **VPS** → **Create New VPS**
2. Choose **Ubuntu 22.04** as OS
3. Select datacenter (choose closest to your users):
   - São Paulo (for Paraguay/Brazil users)
   - Miami (for general Latin America)
4. Set root password (save this!)

### 2.2 Configure Firewall (Security)
In Hostinger panel, open these ports:
- **22** (SSH)
- **80** (HTTP)
- **443** (HTTPS)
- **3000** (App - internal)

### 2.3 Get VPS IP Address
After creation, note the **IP Address** (e.g., `123.45.67.89`)

---

## Step 3: Deploy to Hostinger

### 3.1 Switch to Node.js Runtime (for VPS)
```bash
cd /home/ai-whisperers/paragu-ai-builder
./switch-runtime.sh vps
```

### 3.2 Build and Deploy Script
Create this script on your local machine:

```bash
#!/bin/bash
# deploy-hostinger.sh

# Configuration
HOSTINGER_IP="YOUR_HOSTINGER_IP"
HOSTINGER_USER="root"
APP_DIR="/opt/paragu-ai-builder"

# Build locally
echo "Building application..."
cd web
npm run build

# Create tarball
echo "Creating deployment package..."
tar -czf /tmp/paragu-ai-deploy.tar.gz \
  .next/standalone/ \
  .next/static/ \
  public/ \
  sites/ \
  src/ \
  Dockerfile.prod \
  package.json

# Upload to Hostinger
echo "Uploading to Hostinger..."
scp /tmp/paragu-ai-deploy.tar.gz $HOSTINGER_USER@$HOSTINGER_IP:/tmp/

# Deploy on Hostinger
echo "Deploying on Hostinger..."
ssh $HOSTINGER_USER@$HOSTINGER_IP << 'REMOTE_COMMANDS'
  # Install Docker if not present
  if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker root
  fi

  # Create app directory
  mkdir -p /opt/paragu-ai-builder
  cd /opt/paragu-ai-builder

  # Extract deployment
  tar -xzf /tmp/paragu-ai-deploy.tar.gz

  # Create environment file
  cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=https://qyvokpribmbrosafntqa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KQ-sFNr7r6AauoG0B4nyTg_vuPHmeCm
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITES_DIR=/opt/paragu-ai-builder/sites
SRC_DIR=/opt/paragu-ai-builder/src
EOF

  # Stop existing container
  docker stop paragu-ai 2>/dev/null || true
  docker rm paragu-ai 2>/dev/null || true

  # Build Docker image
  docker build -f Dockerfile.prod -t paragu-ai-builder:latest .

  # Run container
  docker run -d \
    --name paragu-ai \
    --restart unless-stopped \
    -p 3000:3000 \
    -v /opt/paragu-ai-builder/.env:/app/.env:ro \
    paragu-ai-builder:latest

  # Install and configure nginx
  apt-get update
  apt-get install -y nginx

  # Create nginx config
  cat > /etc/nginx/sites-available/paragu-ai << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_EOF

  # Enable site
  ln -sf /etc/nginx/sites-available/paragu-ai /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default

  # Test and reload nginx
  nginx -t && systemctl reload nginx

  echo "✅ Deployment complete!"
  echo "App running on: http://$HOSTINGER_IP"
REMOTE_COMMANDS

echo "✅ Deployment finished!"
echo "🌐 Your app will be available at: http://$HOSTINGER_IP"
```

Make it executable:
```bash
chmod +x deploy-hostinger.sh
```

---

## Step 4: Configure Cloudflare DNS

### 4.1 Add DNS Records
In your Cloudflare dashboard (paragu-ai.com):

1. Go to **DNS** → **Records**
2. Add these A records:

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | @ | YOUR_HOSTINGER_IP | Proxied | Auto |
| A | www | YOUR_HOSTINGER_IP | Proxied | Auto |
| A | * | YOUR_HOSTINGER_IP | Proxied | Auto |

**Important**: Enable the orange cloud (Proxied) for CDN benefits

### 4.2 SSL/TLS Configuration
1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**
3. Go to **Edge Certificates**
4. Enable **Always Use HTTPS**

### 4.3 Page Rules (Optional)
For better caching:
1. Go to **Rules** → **Page Rules**
2. Add rule: `*paragu-ai.com/static/*`
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month

---

## Step 5: Verify Deployment

### 5.1 Test Direct IP
```bash
curl http://YOUR_HOSTINGER_IP/api/health
```

### 5.2 Test Domain
```bash
curl https://paragu-ai.com/api/health
```

### 5.3 Test Tenant Sites
```bash
# Should all return 200
curl -s -o /dev/null -w "%{http_code}" https://paragu-ai.com/s/nl/nexa-paraguay
curl -s -o /dev/null -w "%{http_code}" https://paragu-ai.com/s/en/nexa-uruguay
curl -s -o /dev/null -w "%{http_code}" https://paragu-ai.com/s/es/nexa-propiedades
```

---

## Benefits of This Setup

### ✅ Hostinger VPS
- **No bundle size limits** (unlike Cloudflare Workers)
- **Full Node.js support** (fs, path modules work)
- **Root access** for full control
- **Better pricing** for resource-heavy apps

### ✅ Cloudflare
- **Free SSL certificates** (auto-renewing)
- **Global CDN** (faster loading worldwide)
- **DDoS protection**
- **DNS management**
- **Web Analytics**

---

## Troubleshooting

### Issue: 521 Web Server is Down
**Solution**: Check if Docker container is running:
```bash
ssh root@YOUR_HOSTINGER_IP "docker ps | grep paragu-ai"
```

### Issue: SSL Certificate Errors
**Solution**: In Cloudflare SSL/TLS, try:
1. Set to **Full** (not Full strict) initially
2. Wait 24 hours for certificate propagation
3. Then switch to Full (strict)

### Issue: Site shows Cloudflare Error
**Solution**: Check nginx is running:
```bash
ssh root@YOUR_HOSTINGER_IP "systemctl status nginx"
```

---

## Cost Comparison

| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| Hostinger VPS (KVM 2) | ~$7 | 2 vCPU, 8GB RAM |
| Cloudflare (Free Plan) | $0 | DNS, CDN, SSL |
| **Total** | **~$7/month** | **Production ready** |

vs. Current VPS: $0 (but less reliable)
vs. Cloudflare Workers Unlimited: $50/month

---

## Next Steps

1. **Sign up for Hostinger**: https://www.hostinger.com/vps-hosting
2. **Get your VPS IP** from Hostinger dashboard
3. **Update DNS** in Cloudflare with the new IP
4. **Run the deploy script** above
5. **Test all sites** are working

Want me to help you customize the deployment script for your specific setup?

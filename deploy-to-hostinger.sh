#!/bin/bash
# Deploy Paragu-AI Builder to Hostinger VPS
# Usage: ./deploy-to-hostinger.sh

set -e

# Configuration
HOSTINGER_IP="72.61.44.159"
HOSTINGER_USER="root"
APP_DIR="/opt/paragu-ai-builder"
DOMAIN="paragu-ai.com"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     DEPLOYING PARAGU-AI BUILDER TO HOSTINGER VPS         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 Target: $HOSTINGER_IP"
echo "📁 App Directory: $APP_DIR"
echo ""

# Step 1: Switch to Node.js runtime for VPS
echo "🔄 Step 1: Switching to Node.js runtime..."
cd /home/ai-whisperers/paragu-ai-builder
./switch-runtime.sh vps

# Step 2: Build application
echo "🔨 Step 2: Building application..."
cd web
npm run build 2>&1 | tail -20

# Step 3: Create deployment package
echo "📦 Step 3: Creating deployment package..."
cd /home/ai-whisperers/paragu-ai-builder
tar -czf /tmp/paragu-ai-deploy.tar.gz \
  web/.next/standalone/ \
  web/.next/static/ \
  web/public/ \
  sites/ \
  src/ \
  Dockerfile.prod \
  web/package.json \
  switch-runtime.sh

echo "   Package size: $(du -h /tmp/paragu-ai-deploy.tar.gz | cut -f1)"

# Step 4: Upload to Hostinger
echo "📤 Step 4: Uploading to Hostinger VPS..."
scp /tmp/paragu-ai-deploy.tar.gz $HOSTINGER_USER@$HOSTINGER_IP:/tmp/

# Step 5: Deploy on Hostinger
echo "🚀 Step 5: Deploying on Hostinger..."
ssh $HOSTINGER_USER@$HOSTINGER_IP << 'REMOTE_COMMANDS'
  set -e
  
  echo "   Creating app directory..."
  mkdir -p /opt/paragu-ai-builder
  cd /opt/paragu-ai-builder
  
  echo "   Extracting deployment package..."
  tar -xzf /tmp/paragu-ai-deploy.tar.gz
  
  echo "   Creating environment file..."
  cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=https://qyvokpribmbrosafntqa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KQ-sFNr7r6AauoG0B4nyTg_vuPHmeCm
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDkxMjU2OCwiZXhwIjoyMDYwNDg4NTY4fQ.0gIuM_EUg8g3vql1Xg6b6r8z4JdX9k3v4q0gI1g0gI0
SITES_DIR=/opt/paragu-ai-builder/sites
SRC_DIR=/opt/paragu-ai-builder/src
EOF

  echo "   Stopping existing container..."
  docker stop paragu-ai 2>/dev/null || true
  docker rm paragu-ai 2>/dev/null || true
  
  echo "   Building Docker image..."
  docker build -f Dockerfile.prod -t paragu-ai-builder:latest . 2>&1 | tail -10
  
  echo "   Starting container..."
  docker run -d \
    --name paragu-ai \
    --restart unless-stopped \
    -p 3000:3000 \
    --env-file .env \
    paragu-ai-builder:latest
  
  echo "   Waiting for container to start..."
  sleep 5
  
  echo "   Container status:"
  docker ps | grep paragu-ai
REMOTE_COMMANDS

# Step 6: Install and configure nginx
echo "🌐 Step 6: Installing nginx..."
ssh $HOSTINGER_USER@$HOSTINGER_IP << 'REMOTE_COMMANDS'
  set -e
  
  # Install nginx if not present
  if ! command -v nginx &> /dev/null; then
    echo "   Installing nginx..."
    apt-get update -qq
    apt-get install -y -qq nginx
  fi
  
  # Create nginx config
  echo "   Configuring nginx..."
  cat > /etc/nginx/sites-available/paragu-ai << 'NGINX_EOF'
server {
    listen 80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Proxy to Next.js app
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
        proxy_read_timeout 86400;
    }
    
    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

  # Enable site
  ln -sf /etc/nginx/sites-available/paragu-ai /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
  
  # Test and reload nginx
  echo "   Testing nginx configuration..."
  nginx -t
  
  echo "   Reloading nginx..."
  systemctl reload nginx || systemctl start nginx
  
  echo "   Nginx status:"
  systemctl status nginx --no-pager | head -5
REMOTE_COMMANDS

# Step 7: Verify deployment
echo "✅ Step 7: Verifying deployment..."
sleep 3

echo ""
echo "   Testing health endpoint..."
if curl -s -o /dev/null -w "%{http_code}" http://$HOSTINGER_IP/api/health | grep -q "200"; then
  echo "   ✅ Health check passed!"
else
  echo "   ⚠️  Health check failed - checking container logs..."
  ssh $HOSTINGER_USER@$HOSTINGER_IP "docker logs paragu-ai --tail 20"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ DEPLOYMENT COMPLETE!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Your app is now running at:"
echo "   http://$HOSTINGER_IP"
echo ""
echo "📋 Next Steps:"
echo "   1. Update Cloudflare DNS to point to $HOSTINGER_IP"
echo "   2. Configure SSL (Cloudflare will handle this)"
echo "   3. Test all tenant sites:"
echo "      - http://$HOSTINGER_IP/s/nl/nexa-paraguay"
echo "      - http://$HOSTINGER_IP/s/en/nexa-uruguay"
echo "      - http://$HOSTINGER_IP/s/es/nexa-propiedades"
echo ""
echo "🔧 Useful Commands:"
echo "   SSH:        ssh root@$HOSTINGER_IP"
echo "   Logs:       ssh root@$HOSTINGER_IP 'docker logs paragu-ai -f'"
echo "   Restart:    ssh root@$HOSTINGER_IP 'docker restart paragu-ai'"
echo ""

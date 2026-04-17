#!/bin/bash
#
# Cloudflare Pages Deployment Script for Paragu-AI Builder
# 
# This script builds and deploys to Cloudflare Pages
# 

set -e

echo "🚀 Cloudflare Pages Deployment Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from web/ directory${NC}"
    echo "Run: cd web && ./deploy-cloudflare.sh"
    exit 1
fi

echo -e "${BLUE}Step 1: Building for Cloudflare...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Checking Cloudflare authentication...${NC}"

# Check if already logged in
if npx wrangler whoami > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Already authenticated with Cloudflare${NC}"
    ACCOUNT_INFO=$(npx wrangler whoami 2>/dev/null | grep -E "Account|Email" | head -2)
    echo "  $ACCOUNT_INFO"
else
    echo -e "${YELLOW}⚠ Not authenticated with Cloudflare${NC}"
    echo ""
    echo "You need to login first. Choose an option:"
    echo ""
    echo "Option A: Login with Wrangler CLI (Recommended)"
    echo "  Run: npx wrangler login"
    echo "  This will open a browser to authenticate"
    echo ""
    echo "Option B: Use GitHub Integration (Easiest)"
    echo "  Go to: https://dash.cloudflare.com"
    echo "  Create a Pages project from your GitHub repo"
    echo "  Build command: cd web && npm run build"
    echo "  Build output: web/dist"
    echo ""
    echo "Option C: Use API Token"
    echo "  Set environment variable:"
    echo "  export CLOUDFLARE_API_TOKEN=your_token"
    echo ""
    
    read -p "Do you want to login now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Opening browser for authentication..."
        npx wrangler login
    else
        echo -e "${YELLOW}Deployment cancelled. Authenticate first, then run this script again.${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Step 3: Deploying to Cloudflare Pages...${NC}"

# Try to deploy
PROJECT_NAME="paragu-ai"

# Check if project exists
echo "Checking for existing project: $PROJECT_NAME"
if npx wrangler pages project list 2>/dev/null | grep -q "$PROJECT_NAME"; then
    echo -e "${GREEN}✓ Project exists${NC}"
else
    echo -e "${YELLOW}⚠ Project doesn't exist, will create on first deploy${NC}"
fi

# Deploy
echo ""
echo "Deploying build output..."
npx wrangler pages deploy dist --project-name="$PROJECT_NAME" --branch="main"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}======================================${NC}"
    echo -e "${GREEN}    🎉 DEPLOYMENT SUCCESSFUL! 🎉${NC}"
    echo -e "${GREEN}======================================${NC}"
    echo ""
    echo "Your site is now live at:"
    echo "  https://paragu-ai.pages.dev"
    echo ""
    echo "Admin dashboard:"
    echo "  https://paragu-ai.pages.dev/admin/leads"
    echo ""
    echo "Nexa Paraguay:"
    echo "  https://paragu-ai.pages.dev/s/nl/nexa-paraguay"
    echo ""
else
    echo -e "${RED}✗ Deployment failed${NC}"
    echo "Check the error messages above"
    exit 1
fi

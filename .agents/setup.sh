#!/bin/bash
#
# AI Agent Environment Setup Script
# Run this to configure your environment for working on Paragu-AI Builder
#

set -e

echo "🤖 Setting up AI Agent environment for Paragu-AI Builder..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 20 ]; then
        echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
    else
        echo -e "${RED}✗ Node.js version must be >= 20${NC}"
        echo "Current: $(node --version)"
        exit 1
    fi
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check npm
echo ""
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ npm $(npm --version)${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check git
echo ""
echo "3️⃣  Checking git..."
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ git $(git --version | cut -d' ' -f3)${NC}"
else
    echo -e "${YELLOW}⚠ git not found (optional but recommended)${NC}"
fi

# Install dependencies
echo ""
echo "4️⃣  Installing dependencies..."
cd web
npm install --silent
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check TypeScript
echo ""
echo "5️⃣  Checking TypeScript..."
npx tsc --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript available${NC}"
else
    echo -e "${YELLOW}⚠ TypeScript check failed${NC}"
fi

# Run typecheck
echo ""
echo "6️⃣  Running type check..."
if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Type check passed${NC}"
else
    echo -e "${YELLOW}⚠ Type check has errors (see output below)${NC}"
    npm run typecheck || true
fi

# Check for environment file
echo ""
echo "7️⃣  Checking environment configuration..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓ .env.local exists${NC}"
else
    echo -e "${YELLOW}⚠ .env.local not found${NC}"
    echo "   Copy .env.example to .env.local and add your Supabase credentials"
fi

# Check critical files exist
echo ""
echo "8️⃣  Verifying critical files..."
CRITICAL_FILES=(
    "../src/registry/index.json"
    "../CLAUDE.md"
    "../AGENTS.md"
    "../supabase/migrations/000_complete_schema.sql"
    "next.config.mjs"
    "package.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file missing${NC}"
    fi
done

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "                   SETUP COMPLETE ✅"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "You can now start working on the project:"
echo ""
echo "  Quick commands:"
echo "    npm run dev           # Start development server"
echo "    npm run build         # Build for production"
echo "    npm run typecheck     # Check TypeScript"
echo ""
echo "  AI-specific commands:"
echo "    npm run import:leads  # Import leads from CSV"
echo "    npm run deploy:setup  # Guided deployment setup"
echo ""
echo "  Documentation:"
echo "    cat ../AGENTS.md      # AI agent guide"
echo "    cat ../CLAUDE.md      # Technical architecture"
echo ""
echo "  Common AI tasks:"
echo "    - Add business type: Edit src/registry/"
echo "    - Add section: Create web/components/sections/"
echo "    - Fix build: npm run typecheck && npm run build"
echo "    - Deploy: npm run deploy"
echo ""
echo "═══════════════════════════════════════════════════════════════"

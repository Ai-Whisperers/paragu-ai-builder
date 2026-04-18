#!/bin/bash
# Switch between Cloudflare (edge) and VPS (nodejs) runtime configurations

set -e

WEB_DIR="/home/ai-whisperers/paragu-ai-builder/web"
TARGET="${1:-vps}"

if [ "$TARGET" == "cloudflare" ]; then
    echo "Switching to Cloudflare Edge Runtime..."
    RUNTIME="edge"
elif [ "$TARGET" == "vps" ]; then
    echo "Switching to VPS Node.js Runtime..."
    RUNTIME="nodejs"
else
    echo "Usage: $0 [cloudflare|vps]"
    exit 1
fi

# Find all files with runtime exports and update them
find "$WEB_DIR/app" -name "*.tsx" -o -name "*.ts" | while read -r file; do
    if grep -q "export const runtime = 'edge'\|export const runtime = 'nodejs'" "$file" 2>/dev/null; then
        sed -i "s/export const runtime = 'edge'/export const runtime = '$RUNTIME'/g" "$file"
        sed -i "s/export const runtime = 'nodejs'/export const runtime = '$RUNTIME'/g" "$file"
        echo "  Updated: $file"
    fi
done

echo "✅ Runtime switched to: $RUNTIME"

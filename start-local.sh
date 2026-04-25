#!/bin/bash
# Start Paragu-AI Builder locally

echo "🚀 Starting Paragu-AI Builder..."
echo ""

# Kill any existing processes on port 3000
fuser -k 3000/tcp 2>/dev/null
sleep 2

# Change to web directory
cd /home/ai-whisperers/paragu-ai-builder/web

# Start Next.js dev server
echo "Starting Next.js development server..."
echo "This may take 10-20 seconds..."
echo ""

npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 15

# Check if server is running
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Server is running!"
    echo ""
    echo "🌐 Access the site at:"
    echo "   http://localhost:3000/s/nl/nexa-paraguay"
    echo ""
    echo "📊 Health check:"
    echo "   http://localhost:3000/api/health"
    echo ""
    echo "Press Ctrl+C to stop the server"
    wait $SERVER_PID
else
    echo "❌ Server failed to start"
    echo "Check logs: tail -f /tmp/nextjs.log"
    exit 1
fi
#!/bin/bash
# Chemical Thinking - Server Startup Script
# Run this to start the API server and ngrok tunnel

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="/tmp"

echo "=========================================="
echo "  Chemical Thinking Server Startup"
echo "=========================================="

# Check if API is already running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ API already running on port 8000"
else
    echo "Starting API server..."
    cd "$SCRIPT_DIR/app/backend"
    nohup python3 main.py > "$LOG_DIR/chem-api.log" 2>&1 &
    sleep 3
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ API started successfully"
    else
        echo "✗ API failed to start. Check $LOG_DIR/chem-api.log"
    fi
fi

# Check if ngrok is already running
if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['tunnels'][0]['public_url'])" 2>/dev/null)
    echo "✓ ngrok already running: $NGROK_URL"
else
    echo "Starting ngrok tunnel..."
    nohup ngrok http 8000 > "$LOG_DIR/ngrok.log" 2>&1 &
    sleep 5
    if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
        NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['tunnels'][0]['public_url'])" 2>/dev/null)
        echo "✓ ngrok started: $NGROK_URL"
    else
        echo "✗ ngrok failed to start. Check $LOG_DIR/ngrok.log"
    fi
fi

echo ""
echo "=========================================="
echo "  Server Status"
echo "=========================================="
echo ""
echo "API:     http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Public:  $NGROK_URL"
echo ""
echo "Logs:"
echo "  API:   $LOG_DIR/chem-api.log"
echo "  ngrok: $LOG_DIR/ngrok.log"
echo ""
echo "To stop: pkill -f 'python.*main.py' && pkill ngrok"
echo "=========================================="

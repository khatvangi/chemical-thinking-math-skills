#!/bin/bash
# Chemical Thinking - Quick Start Script

echo "==================================="
echo "  Chemical Thinking Course Setup   "
echo "==================================="

# Check for required tools
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "⚠️  $1 not found. Please install it."
        return 1
    fi
    echo "✓ $1 found"
    return 0
}

echo ""
echo "Checking dependencies..."
check_command python3
check_command pip
check_command quarto

# Check Ollama
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✓ Ollama running"
    MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | head -5)
    echo "  Available models: $MODELS"
else
    echo "⚠️  Ollama not running. Start with: ollama serve"
fi

echo ""
echo "==================================="
echo "  Quick Commands                   "
echo "==================================="
echo ""
echo "1. Start backend API:"
echo "   cd app/backend && pip install -r requirements.txt && python main.py"
echo ""
echo "2. Preview Quarto site:"
echo "   cd site && quarto preview"
echo ""
echo "3. Build static site:"
echo "   cd site && quarto render"
echo ""
echo "4. Run recommended math model:"
echo "   ollama run qwen2.5-math:7b"
echo ""
echo "==================================="

# Option to start everything
read -p "Start backend server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd app/backend
    pip install -r requirements.txt -q
    echo "Starting API server on http://localhost:8000..."
    python main.py
fi

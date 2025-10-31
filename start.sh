#!/bin/bash

# Halloween Vocabulary Game - Start Script

echo "🎃 Starting Halloween Vocabulary Game..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

# Install requirements
echo "📥 Installing dependencies..."
pip install -r requirements.txt --quiet

echo ""
echo "🚀 Starting the game server..."
echo "📱 Open your browser and go to: http://localhost:5000"
echo "⚠️  Press Ctrl+C to stop the server"
echo ""

# Run the app
python app.py

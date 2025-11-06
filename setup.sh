#!/bin/bash

# ChatBot Copilot - Quick Start Script
# This script sets up the entire project

echo "🚀 ChatBot Copilot - Quick Start"
echo "================================"

# Check Python version
python3 --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Python 3 is required. Please install Python 3.8+"
    exit 1
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Creating .env file from template..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env with your configuration"
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Return to root
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your MongoDB and Google Cloud credentials"
echo "2. Start MongoDB: mongod"
echo "3. Start Flask backend: cd backend && python app.py"
echo "4. Open frontend in browser: frontend/index.html"
echo ""
echo "🎉 Happy coding!"

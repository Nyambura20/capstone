#!/bin/bash

echo "🎓 EduMentor AI Setup Script"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file..."
    cat > backend/.env << EOF
# Google Gemini API Key
# Get yours free at: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Backend Configuration  
DEBUG=True
HOST=127.0.0.1
PORT=8000
EOF
    echo "✅ Created backend/.env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add your Gemini API key!"
    echo "   Get it free from: https://makersuite.google.com/app/apikey"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -q -r backend/requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get your free Gemini API key from:"
echo "   https://makersuite.google.com/app/apikey"
echo ""
echo "2. Edit backend/.env and replace 'your_gemini_api_key_here' with your actual key"
echo ""
echo "3. Start the servers:"
echo "   Terminal 1: uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"
echo "   Terminal 2: python3 -m http.server --directory frontend 3000"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🚀 Ready to provide real AI-powered education!"

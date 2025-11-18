#!/bin/bash
# 🔥 EduMentor Firebase Deployment Script

set -e  # Exit on error

echo "🔥 EduMentor Firebase Deployment"
echo "================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI installed"
echo ""

# Check if logged in
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "Please login to Firebase:"
    firebase login
fi

echo "✅ Authenticated"
echo ""

# Copy backend to functions
echo "📦 Preparing backend for deployment..."
rm -rf functions/backend 2>/dev/null || true
mkdir -p functions
cp -r backend functions/backend

# Copy .env file
if [ -f backend/.env ]; then
    cp backend/.env functions/backend/.env
    echo "✅ Environment variables copied"
else
    echo "⚠️  Warning: backend/.env not found"
    echo "   Make sure to set GEMINI_API_KEY as Firebase secret:"
    echo "   firebase functions:secrets:set GEMINI_API_KEY"
fi

# Install dependencies in functions venv
echo "📦 Installing Python dependencies..."
cd functions
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
cd ..

echo ""
echo "🚀 Deploying to Firebase..."
firebase deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be live at:"
firebase hosting:channel:open live 2>/dev/null || echo "   Check Firebase Console for URL"
echo ""
echo "📊 Monitor your app:"
echo "   firebase functions:log --follow"
echo ""

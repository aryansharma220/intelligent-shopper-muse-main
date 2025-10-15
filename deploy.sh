#!/bin/bash

# Deployment script for Vercel
echo "🚀 Starting deployment process..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run build
echo "🔨 Building application..."
npm run build:production

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
    echo "📊 Build stats:"
    ls -la dist/
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 Deployment ready!"
echo "📁 Deploy the 'dist' folder to your hosting provider"
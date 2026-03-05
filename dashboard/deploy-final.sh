#!/bin/bash
# Final deployment script for Trading Dashboard

set -e

echo "🚀 MAC IS COOKING - Trading Dashboard Deployment"
echo "================================================"
echo ""

# Check for Vercel token
if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️  VERCEL_TOKEN not set"
    echo ""
    echo "To get a token:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Create a new token"
    echo "3. Run: export VERCEL_TOKEN=your_token"
    echo "4. Then run this script again"
    echo ""
    echo "Or deploy manually:"
    echo "  vercel login"
    echo "  vercel --prod"
    exit 1
fi

echo "📦 Step 1: Building application..."
npm run build

echo ""
echo "📋 Step 2: Copying API endpoints..."
cp -r api dist/
cp public/* dist/ 2>/dev/null || true

echo ""
echo "🌐 Step 3: Deploying to Vercel..."
npx vercel --token "$VERCEL_TOKEN" --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your dashboard should be available at:"
echo "  https://maciscooking-trading.vercel.app"
echo ""
echo "🔑 Default password: maciscooking2024"
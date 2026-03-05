#!/bin/bash
# Deploy script for Trading Dashboard

echo "Building Trading Dashboard..."
npm run build

echo "Copying API and assets..."
cp -r api dist/
cp public/* dist/ 2>/dev/null || true

echo "Deploying to Vercel..."
vercel --prod

echo "Done!"
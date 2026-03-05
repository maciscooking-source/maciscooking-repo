#!/bin/bash
# Deploy to Vercel using API

VERCEL_TOKEN="$1"

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Usage: ./deploy-api.sh <vercel-token>"
  echo "Get your token from: https://vercel.com/account/tokens"
  exit 1
fi

echo "Creating deployment..."

# Create deployment
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "maciscooking-trading",
    "project": "maciscooking-trading",
    "target": "production",
    "files": []
  }'

echo "Deployment complete!"
#!/bin/bash
# Deploy backend to Render.com

echo "=============================================="
echo "Deploying Trading Dashboard Backend"
echo "=============================================="

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "Installing Render CLI..."
    npm install -g @render/cli
fi

# Login to Render (if needed)
echo ""
echo "Step 1: Login to Render"
echo "If not logged in, run: render login"
render login

# Create new web service
echo ""
echo "Step 2: Creating web service..."
cd /Users/mac/clawd/dashboard

# Deploy using render.yaml or manually
echo ""
echo "Manual deployment steps:"
echo "1. Go to https://dashboard.render.com/"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repo or upload files"
echo "4. Set build command: pip install -r backend_requirements.txt"
echo "5. Set start command: python backend_api.py"
echo "6. Set environment variable: POLYGON_API_KEY"
echo "7. Click 'Create Web Service'"
echo ""
echo "Or use Render CLI:"
echo "render deploy --service mac-trading-api"

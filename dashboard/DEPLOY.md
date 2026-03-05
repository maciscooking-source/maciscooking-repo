# Deployment Instructions

## Quick Deploy

### Prerequisites
1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Login: `vercel login`

### Deploy Now
```bash
cd /Users/mac/clawd/dashboard
vercel --prod
```

This will deploy to: `maciscooking-trading.vercel.app`

## Environment Variables

If you want to use a custom domain or API URL, create a `.env` file:

```
VITE_API_URL=https://your-api-url.com
```

## GitHub Integration (Optional)

1. Push this repo to GitHub
2. Connect GitHub repo in Vercel dashboard
3. Auto-deploy on every push to main

## Manual Build

```bash
npm install
npm run build
# Serve dist/ folder on any static host
```
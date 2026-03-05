# MAC IS COOKING - Trading Dashboard

A professional trading alerts dashboard with real-time watchlist, strategy status, and PWA support.

## Features

- **Dark Theme Trading Terminal** - Professional look with dark UI
- **Real-time Watchlist** - 10 popular symbols with live prices
- **Active Alerts Panel** - Scrollable list of trading alerts with sound notifications
- **Strategy Status** - VWAP, EMA, RSI indicator status
- **Password Protection** - Simple auth gate
- **PWA Support** - Mobile "Add to Home Screen" support
- **Auto-refresh** - Updates every 30 seconds

## Password

**Default password:** `maciscooking2024`

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Git + Vercel Git Integration

1. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/maciscooking-trading.git
git push -u origin main
```

2. Import project in Vercel dashboard
3. Deploy

### Option 3: Manual Deploy

```bash
./deploy.sh
```

## API Endpoints

- `GET /api/alerts` - Returns all active alerts
- `GET /api/watchlist` - Returns watchlist with simulated prices
- `GET /api/status` - Returns system health and strategy status

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Axios
- Recharts
- Vercel Serverless Functions

## Project Structure

```
dashboard/
├── api/                 # Serverless API endpoints
│   ├── alerts.js
│   ├── watchlist.js
│   └── status.js
├── src/
│   ├── components/      # React components
│   ├── App.jsx
│   └── main.jsx
├── public/              # Static assets
└── dist/                # Build output
```
# Unified Trading Dashboard Backend API

## Architecture

```
┌─────────────────────────────────────────┐
│  React Frontend (Vercel)                │
│  maciscooking-trading.vercel.app        │
└─────────────────────────────────────────┘
                    │
                    ▼ API Calls
┌─────────────────────────────────────────┐
│  Python Backend API (Render/Railway)    │
│  /api/alerts       → All alerts         │
│  /api/watchlist    → TradingView list   │
│  /api/prices       → Real-time prices   │
│  /api/status       → System health      │
└─────────────────────────────────────────┘
                    │
                    ▼ Data Sources
┌─────────────────────────────────────────┐
│  Alert Sources                          │
│  ├── price_action_monitor.py (EMA/RSI) │
│  ├── stockwhale_enhanced_orchestrator   │
│  ├── odte_monitor_v3.py (0DTE PCR)     │
│  ├── double_bottom_detector             │
│  ├── jefetrades_content_monitor         │
│  ├── rocktrading monitor                │
│  └── tradingview_interim (when fixed)  │
└─────────────────────────────────────────┘
```

## API Endpoints

### GET /api/alerts
Returns all recent alerts from all systems:
```json
{
  "alerts": [
    {
      "source": "price_action",
      "symbol": "SPY",
      "strategy": "EMA Crossover",
      "signal": "BUY",
      "price": 580.25,
      "timestamp": "2026-03-03T20:10:00Z",
      "entry": 580.00,
      "stop": 578.50,
      "target": 583.00
    },
    {
      "source": "stockwhale",
      "symbol": "TSLA",
      "signal": "APPROACHING ENTRY",
      "price": 416.50,
      "entry": 390.00,
      "direction": "long"
    }
  ]
}
```

### GET /api/watchlist
Returns TradingView 10-min watchlist with live prices

### GET /api/prices
Real-time prices for all symbols

## Implementation Plan

### Phase 1: Backend API (30 min)
- FastAPI or Flask server
- Read from all alert sources (log files, JSON, etc.)
- Aggregate and serve via REST

### Phase 2: TradingView Integration (20 min)
- Scrape or read TradingView 10-min watchlist
- Update every 30 seconds

### Phase 3: Frontend Updates (20 min)
- Connect to real backend
- Show unified alert feed
- Add source filtering

### Phase 4: Deploy (10 min)
- Backend to Render/Railway
- Frontend update on Vercel

Total: ~80 minutes

## Deliverables
1. backend_api.py - FastAPI server
2. Updated dashboard React code
3. Unified alert feed showing ALL sources
4. Real TradingView watchlist integration
5. Deployed and working

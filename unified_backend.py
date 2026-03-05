#!/usr/bin/env python3
"""
FastAPI Trading Dashboard Backend
Production-ready API for Render.com deployment
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from contextlib import asynccontextmanager

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")
REDIS_URL = os.getenv("REDIS_URL")

TRADINGVIEW_WATCHLIST = [
    "SPY", "QQQ", "IWM", "AAPL", "MSFT", "GOOGL", 
    "AMZN", "NVDA", "TSLA", "META", "AMD", "NFLX", "CRM", "BABA"
]

# In-memory cache for prices
price_cache = {}
cache_time = None
CACHE_DURATION = 60  # seconds


class Alert(BaseModel):
    id: str
    source: str
    type: str
    symbol: str
    message: str
    timestamp: str
    price: Optional[float] = None
    action: Optional[str] = None


class PriceData(BaseModel):
    symbol: str
    price: Optional[float] = None
    change: Optional[float] = None
    changePercent: Optional[float] = None
    volume: Optional[int] = None
    timestamp: str


class StatusResponse(BaseModel):
    status: str
    timestamp: str
    systems: Dict[str, bool]


# Alert Aggregation (stateless - reads from files if they exist)
class AlertAggregator:
    """Aggregates alerts from all trading systems"""
    
    @staticmethod
    def get_price_action_alerts() -> List[Dict]:
        """Read from price_action_monitor logs"""
        alerts = []
        log_file = "/Users/mac/clawd/logs/price_action_monitor.log"
        
        try:
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    lines = f.readlines()[-50:]
                
                for line in lines:
                    if "🎯" in line or "Signal" in line or "EMA" in line or "RSI" in line:
                        alerts.append({
                            "id": f"pa_{hash(line) % 10000}",
                            "source": "Price Action",
                            "type": "EMA Crossover" if "EMA" in line else "RSI Divergence",
                            "symbol": line.split()[2] if len(line.split()) > 2 else "UNKNOWN",
                            "message": line.strip(),
                            "timestamp": datetime.now().isoformat(),
                            "price": None,
                            "action": "BUY" if "BUY" in line else "SELL" if "SELL" in line else "NEUTRAL"
                        })
        except Exception as e:
            print(f"Error reading price action alerts: {e}")
        
        return alerts[-10:]
    
    @staticmethod
    def get_stockwhale_alerts() -> List[Dict]:
        """Read from stockwhale levels"""
        alerts = []
        try:
            levels_file = "/Users/mac/clawd/stockwhale_today_levels.json"
            if os.path.exists(levels_file):
                with open(levels_file, 'r') as f:
                    data = json.load(f)
                
                for symbol, info in data.get("entry_levels", {}).items():
                    alerts.append({
                        "id": f"sw_{symbol}",
                        "source": "Stockwhale",
                        "type": "Daily Level",
                        "symbol": symbol,
                        "price": info.get("entry"),
                        "action": info.get("direction", "").upper(),
                        "message": f"{symbol} {info.get('direction')} at ${info.get('entry')}",
                        "timestamp": data.get("timestamp", datetime.now().isoformat())
                    })
        except Exception as e:
            print(f"Error reading stockwhale: {e}")
        
        return alerts
    
    @staticmethod
    def get_odte_alerts() -> List[Dict]:
        """Read from 0DTE monitor"""
        alerts = []
        log_file = "/Users/mac/clawd/logs/odte_v3.log"
        
        try:
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    lines = f.readlines()[-30:]
                
                for line in lines:
                    if "BULLISH" in line or "BEARISH" in line:
                        parts = line.split()
                        symbol = parts[1] if len(parts) > 1 else "SPY"
                        sentiment = "BULLISH" if "BULLISH" in line else "BEARISH"
                        
                        alerts.append({
                            "id": f"odte_{hash(line) % 10000}",
                            "source": "0DTE Flow",
                            "type": "PCR Signal",
                            "symbol": symbol,
                            "action": sentiment,
                            "message": f"{symbol} 0DTE PCR: {sentiment}",
                            "timestamp": datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"Error reading ODTE: {e}")
        
        return alerts[-5:]
    
    @staticmethod
    def get_all_alerts() -> List[Dict]:
        """Aggregate all alerts"""
        all_alerts = []
        all_alerts.extend(AlertAggregator.get_price_action_alerts())
        all_alerts.extend(AlertAggregator.get_stockwhale_alerts())
        all_alerts.extend(AlertAggregator.get_odte_alerts())
        
        # Sort by timestamp
        all_alerts.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return all_alerts[:20]


class PriceFeed:
    """Fetches real-time prices from Polygon"""
    
    @staticmethod
    def get_prices(symbols: List[str]) -> Dict[str, Dict]:
        """Get current prices for symbols"""
        global price_cache, cache_time
        
        # Check cache
        if cache_time and (datetime.now() - cache_time).seconds < CACHE_DURATION:
            return price_cache
        
        prices = {}
        
        for symbol in symbols:
            try:
                url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/prev"
                resp = requests.get(url, params={"apikey": POLYGON_API_KEY}, timeout=5)
                
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("results"):
                        result = data["results"][0]
                        prices[symbol] = {
                            "symbol": symbol,
                            "price": result["c"],
                            "change": result["c"] - result["o"],
                            "changePercent": round(((result["c"] - result["o"]) / result["o"]) * 100, 2),
                            "volume": result["v"],
                            "timestamp": datetime.now().isoformat()
                        }
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
        
        # Update cache
        price_cache = prices
        cache_time = datetime.now()
        
        return prices


# Create FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    print("🚀 Trading Dashboard API starting...")
    yield
    print("👋 Trading Dashboard API shutting down...")


app = FastAPI(
    title="Trading Dashboard API",
    description="Unified backend for trading alerts and market data",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins - update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=Dict)
async def root():
    """API root - health check"""
    return {
        "status": "online",
        "service": "Trading Dashboard API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health", response_model=Dict)
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "polygon_api": bool(POLYGON_API_KEY)
    }


@app.get("/api/alerts", response_model=Dict[str, List[Alert]])
async def get_alerts():
    """Get all aggregated alerts"""
    alerts = AlertAggregator.get_all_alerts()
    return {"alerts": alerts}


@app.get("/api/prices", response_model=Dict[str, Dict[str, PriceData]])
async def get_prices():
    """Get current prices for watchlist"""
    prices = PriceFeed.get_prices(TRADINGVIEW_WATCHLIST)
    return {"prices": prices}


@app.get("/api/watchlist", response_model=Dict[str, List[PriceData]])
async def get_watchlist():
    """Get watchlist with current prices"""
    prices = PriceFeed.get_prices(TRADINGVIEW_WATCHLIST)
    watchlist = [
        prices.get(sym, {"symbol": sym, "price": None, "timestamp": datetime.now().isoformat()})
        for sym in TRADINGVIEW_WATCHLIST
    ]
    return {"watchlist": watchlist}


@app.get("/api/status", response_model=StatusResponse)
async def get_status():
    """Get system status"""
    return StatusResponse(
        status="online",
        timestamp=datetime.now().isoformat(),
        systems={
            "price_action": os.path.exists("/Users/mac/clawd/logs/price_action_monitor.log"),
            "stockwhale": os.path.exists("/Users/mac/clawd/stockwhale_today_levels.json"),
            "odte": os.path.exists("/Users/mac/clawd/logs/odte_v3.log")
        }
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

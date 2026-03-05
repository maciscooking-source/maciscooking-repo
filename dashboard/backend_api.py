#!/usr/bin/env python3
"""
Unified Trading Dashboard Backend API
Aggregates alerts from all trading systems
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Mac Trading Dashboard API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your Vercel domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")
TRADINGVIEW_WATCHLIST = [
    "SPY", "QQQ", "IWM", "AAPL", "MSFT", "GOOGL", 
    "AMZN", "NVDA", "TSLA", "META", "AMD", "NFLX", "CRM", "BABA"
]

# In-memory alert storage (would use Redis/database in production)
alerts_cache: List[Dict] = []
last_update = datetime.now()

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
                    lines = f.readlines()[-100:]  # Last 100 lines
                
                for line in lines:
                    if "🎯" in line and "Signal" in line:
                        # Parse alert from log
                        alerts.append({
                            "source": "price_action",
                            "type": "ema_crossover" if "EMA" in line else "rsi_divergence",
                            "message": line.strip(),
                            "timestamp": datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"Error reading price action alerts: {e}")
        
        return alerts
    
    @staticmethod
    def get_stockwhale_alerts() -> List[Dict]:
        """Read from stockwhale logs"""
        alerts = []
        # Implementation would read stockwhale log/alerts
        return alerts
    
    @staticmethod
    def get_odte_alerts() -> List[Dict]:
        """Read from 0DTE monitor"""
        alerts = []
        log_file = "/Users/mac/clawd/logs/odte_v3.log"
        
        try:
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    lines = f.readlines()[-50:]
                
                for line in lines:
                    if "BULLISH" in line or "BEARISH" in line:
                        alerts.append({
                            "source": "odte_otm",
                            "type": "pcr_signal",
                            "message": line.strip(),
                            "timestamp": datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"Error reading ODTE alerts: {e}")
        
        return alerts
    
    @staticmethod
    def get_double_bottom_alerts() -> List[Dict]:
        """Read from double bottom detector"""
        alerts = []
        log_file = "/Users/mac/clawd/double_bottom_detector/detector.log"
        
        try:
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    lines = f.readlines()[-50:]
                
                for line in lines:
                    if "🎯 DOUBLE BOTTOM" in line:
                        alerts.append({
                            "source": "double_bottom",
                            "type": "pattern_detected",
                            "message": line.strip(),
                            "timestamp": datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"Error reading double bottom alerts: {e}")
        
        return alerts
    
    @staticmethod
    def get_creator_alerts() -> List[Dict]:
        """Read from JEFETRADES and RockTrading"""
        alerts = []
        # Implementation would read content monitor alerts
        return alerts
    
    @staticmethod
    def get_all_alerts() -> List[Dict]:
        """Aggregate all alerts"""
        all_alerts = []
        
        all_alerts.extend(AlertAggregator.get_price_action_alerts())
        all_alerts.extend(AlertAggregator.get_stockwhale_alerts())
        all_alerts.extend(AlertAggregator.get_odte_alerts())
        all_alerts.extend(AlertAggregator.get_double_bottom_alerts())
        all_alerts.extend(AlertAggregator.get_creator_alerts())
        
        # Sort by timestamp (newest first)
        all_alerts.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return all_alerts[:50]  # Return last 50 alerts

class PriceFeed:
    """Fetches real-time prices from Polygon"""
    
    @staticmethod
    def get_prices(symbols: List[str]) -> Dict[str, Dict]:
        """Get current prices for symbols"""
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
                            "price": result["c"],
                            "change": result["c"] - result["o"],
                            "change_percent": ((result["c"] - result["o"]) / result["o"]) * 100,
                            "volume": result["v"],
                            "timestamp": datetime.now().isoformat()
                        }
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
        
        return prices

# API Endpoints

@app.get("/api/alerts")
async def get_alerts():
    """Get all alerts from all systems"""
    return {"alerts": AlertAggregator.get_all_alerts()}

@app.get("/api/watchlist")
async def get_watchlist():
    """Get TradingView watchlist with real prices"""
    prices = PriceFeed.get_prices(TRADINGVIEW_WATCHLIST)
    return {
        "watchlist": [
            {"symbol": sym, **prices.get(sym, {"price": None})}
            for sym in TRADINGVIEW_WATCHLIST
        ]
    }

@app.get("/api/prices")
async def get_prices(symbols: Optional[str] = None):
    """Get prices for specific symbols"""
    if symbols:
        symbol_list = symbols.split(",")
    else:
        symbol_list = TRADINGVIEW_WATCHLIST
    
    return {"prices": PriceFeed.get_prices(symbol_list)}

@app.get("/api/status")
async def get_status():
    """Get system health status"""
    return {
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "systems": {
            "price_action": os.path.exists("/Users/mac/clawd/logs/price_action_monitor.log"),
            "stockwhale": os.path.exists("/Users/mac/clawd/logs/stockwhale.log"),
            "odte": os.path.exists("/Users/mac/clawd/logs/odte_v3.log"),
            "double_bottom": os.path.exists("/Users/mac/clawd/double_bottom_detector/detector.log")
        }
    }

@app.get("/")
async def root():
    return {"message": "Mac Trading Dashboard API", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

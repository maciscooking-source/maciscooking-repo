import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink } from 'lucide-react'
import axios from 'axios'

// Backend API URL - Change this to your backend URL
// For local development: https://maciscooking-api.onrender.com
// For production: https://your-backend-url.com
const API_URL = 'https://maciscooking-api.onrender.com'

const defaultSymbols = [
  { symbol: 'SPY', name: 'SPDR S&P 500', price: 0, change: 0, changePercent: 0 },
  { symbol: 'QQQ', name: 'Invesco QQQ', price: 0, change: 0, changePercent: 0 },
  { symbol: 'IWM', name: 'iShares Russell 2000', price: 0, change: 0, changePercent: 0 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 0, change: 0, changePercent: 0 },
  { symbol: 'MSFT', name: 'Microsoft', price: 0, change: 0, changePercent: 0 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 0, change: 0, changePercent: 0 },
  { symbol: 'TSLA', name: 'Tesla', price: 0, change: 0, changePercent: 0 },
  { symbol: 'AMZN', name: 'Amazon', price: 0, change: 0, changePercent: 0 },
  { symbol: 'META', name: 'Meta Platforms', price: 0, change: 0, changePercent: 0 },
  { symbol: 'AMD', name: 'AMD', price: 0, change: 0, changePercent: 0 },
]

function Watchlist({ onUpdate }) {
  const [symbols, setSymbols] = useState(defaultSymbols)
  const [loading, setLoading] = useState(false)
  const [lastFetch, setLastFetch] = useState(null)

  const fetchPrices = async () => {
    setLoading(true)
    try {
      // Try to fetch from API first
      let data = null
      try {
        const response = await axios.get(`${API_URL}/api/watchlist`, { timeout: 5000 })
        data = response.data
      } catch (e) {
        // Fallback: simulate price updates
        console.log('API unavailable, using simulated data')
      }

      if (data && data.symbols) {
        setSymbols(data.symbols)
      } else {
        // Simulate price movements
        setSymbols(prev => prev.map(sym => {
          const volatility = 0.002
          const change = (Math.random() - 0.5) * 2 * volatility
          const newPrice = sym.price === 0 
            ? 100 + Math.random() * 400 
            : sym.price * (1 + change)
          const newChange = sym.change + change * sym.price
          const changePercent = (newChange / (newPrice - newChange)) * 100
          
          return {
            ...sym,
            price: newPrice,
            change: newChange,
            changePercent: changePercent
          }
        }))
      }
      setLastFetch(new Date())
      onUpdate && onUpdate()
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const openTradingView = (symbol) => {
    window.open(`https://www.tradingview.com/chart/?symbol=${symbol}`, '_blank')
  }

  return (
    <div className="bg-trading-card border border-trading-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-trading-border">
        <h2 className="font-semibold text-trading-text flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-trading-accent" />
          Watchlist
        </h2>
        <button
          onClick={fetchPrices}
          disabled={loading}
          className="p-2 hover:bg-trading-border rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-trading-muted ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
        {symbols.map((sym) => (
          <div
            key={sym.symbol}
            onClick={() => openTradingView(sym.symbol)}
            className="bg-trading-bg border border-trading-border rounded-lg p-3 hover:border-trading-accent/50 cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-bold text-trading-text">{sym.symbol}</div>
                <div className="text-xs text-trading-muted truncate max-w-[80px]">{sym.name}</div>
              </div>
              <ExternalLink className="w-3 h-3 text-trading-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-lg font-mono font-semibold text-trading-text">
              ${sym.price.toFixed(2)}
            </div>
            <div className={`flex items-center gap-1 text-xs ${
              sym.change >= 0 ? 'text-trading-success' : 'text-trading-danger'
            }`}>
              {sym.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{sym.changePercent >= 0 ? '+' : ''}{sym.changePercent.toFixed(2)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Watchlist
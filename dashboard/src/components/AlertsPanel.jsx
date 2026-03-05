import { useState, useEffect, useRef } from 'react'
import { Bell, Filter, Volume2, VolumeX, AlertTriangle, TrendingUp, Activity, BarChart3 } from 'lucide-react'
import axios from 'axios'

// Backend API URL
const API_URL = 'https://maciscooking-api.onrender.com'

const strategyIcons = {
  VWAP: Activity,
  EMA: TrendingUp,
  RSI: BarChart3,
  default: AlertTriangle
}

const strategyColors = {
  VWAP: 'text-blue-400',
  EMA: 'text-purple-400',
  RSI: 'text-orange-400',
  default: 'text-trading-accent'
}

// No mock alerts - will fetch from backend

function AlertsPanel({ onUpdate }) {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const prevAlertsRef = useRef([])

  const playSound = () => {
    if (soundEnabled) {
      const audio = new Audio()
      audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAA=='
      audio.play().catch(() => {})
    }
  }

  const fetchAlerts = async () => {
    try {
      let data = null
      try {
        const response = await axios.get(`${API_URL}/api/alerts`, { timeout: 5000 })
        data = response.data
      } catch (e) {
        console.log('API unavailable, using mock data')
      }

      const newAlerts = data?.alerts || []
      
      // Check for new alerts
      const prevIds = new Set(prevAlertsRef.current.map(a => a.id))
      const hasNew = newAlerts.some(a => !prevIds.has(a.id))
      
      if (hasNew && prevAlertsRef.current.length > 0) {
        playSound()
      }
      
      prevAlertsRef.current = newAlerts
      setAlerts(newAlerts)
      setUnreadCount(newAlerts.filter(a => !a.read).length)
      onUpdate && onUpdate()
    } catch (error) {
      console.error('Error fetching alerts:', error)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [soundEnabled])

  const filteredAlerts = filter === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.strategy === filter)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000 / 60)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  return (
    <div className="bg-trading-card border border-trading-border rounded-xl overflow-hidden h-[500px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-trading-border">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-trading-accent" />
          <h2 className="font-semibold text-trading-text">Active Alerts</h2>
          {unreadCount > 0 && (
            <span className="bg-trading-accent text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-trading-border rounded-lg transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-trading-muted" />
            ) : (
              <VolumeX className="w-4 h-4 text-trading-muted" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-trading-border overflow-x-auto">
        <Filter className="w-4 h-4 text-trading-muted flex-shrink-0" />
        {['ALL', 'VWAP', 'EMA', 'RSI'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
              filter === f 
                ? 'bg-trading-accent text-white' 
                : 'bg-trading-bg text-trading-muted hover:text-trading-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-trading-muted">
            No alerts found
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = strategyIcons[alert.strategy] || strategyIcons.default
            const colorClass = strategyColors[alert.strategy] || strategyColors.default
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all ${
                  alert.read 
                    ? 'bg-trading-bg border-trading-border opacity-70' 
                    : 'bg-trading-bg border-trading-accent/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-trading-card ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-trading-text">{alert.symbol}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        alert.type === 'BUY' 
                          ? 'bg-trading-success/20 text-trading-success' 
                          : 'bg-trading-danger/20 text-trading-danger'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-trading-muted">{alert.strategy}</span>
                    </div>
                    <p className="text-sm text-trading-text truncate">{alert.message}</p>
                    <span className="text-xs text-trading-muted">{formatTime(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AlertsPanel
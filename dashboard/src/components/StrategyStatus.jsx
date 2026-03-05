import { useState, useEffect } from 'react'
import { Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const defaultStrategies = [
  { name: 'VWAP', description: 'Volume Weighted Average Price', status: 'active', lastSignal: '2 min ago' },
  { name: 'EMA', description: 'Exponential Moving Average Crossover', status: 'active', lastSignal: '5 min ago' },
  { name: 'RSI', description: 'Relative Strength Index', status: 'paused', lastSignal: '15 min ago' },
]

function StrategyStatus({ onUpdate }) {
  const [strategies, setStrategies] = useState(defaultStrategies)

  const fetchStatus = async () => {
    try {
      let data = null
      try {
        const response = await axios.get(`${API_URL}/api/status`, { timeout: 5000 })
        data = response.data
      } catch (e) {
        console.log('API unavailable, using default data')
      }

      if (data?.strategies) {
        setStrategies(data.strategies)
      }
      onUpdate && onUpdate()
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-trading-success" />
      case 'paused':
        return <AlertCircle className="w-5 h-5 text-trading-warning" />
      case 'error':
        return <XCircle className="w-5 h-5 text-trading-danger" />
      default:
        return <Activity className="w-5 h-5 text-trading-muted" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-trading-success/10 border-trading-success/30'
      case 'paused':
        return 'bg-trading-warning/10 border-trading-warning/30'
      case 'error':
        return 'bg-trading-danger/10 border-trading-danger/30'
      default:
        return 'bg-trading-bg border-trading-border'
    }
  }

  return (
    <div className="bg-trading-card border border-trading-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-trading-border">
        <h2 className="font-semibold text-trading-text flex items-center gap-2">
          <Activity className="w-5 h-5 text-trading-accent" />
          Strategy Status
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
        {strategies.map((strategy) => (
          <div
            key={strategy.name}
            className={`p-4 rounded-lg border ${getStatusColor(strategy.status)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-trading-text">{strategy.name}</h3>
                <p className="text-xs text-trading-muted">{strategy.description}</p>
              </div>
              {getStatusIcon(strategy.status)}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-trading-muted capitalize">
                {strategy.status}
              </span>
              <span className="text-xs text-trading-muted">
                Last: {strategy.lastSignal}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StrategyStatus
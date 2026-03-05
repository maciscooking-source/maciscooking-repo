import { useState, useEffect } from 'react'
import { Server, Clock, RefreshCw } from 'lucide-react'

function Footer({ lastUpdate }) {
  const [systemStatus, setSystemStatus] = useState({ healthy: true, uptime: '99.9%' })

  useEffect(() => {
    // Simulate system health check
    const checkHealth = () => {
      setSystemStatus({
        healthy: Math.random() > 0.1,
        uptime: '99.9%'
      })
    }
    checkHealth()
    const interval = setInterval(checkHealth, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <footer className="bg-trading-card border-t border-trading-border mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-trading-muted" />
              <span className="text-trading-muted">System:</span>
              {systemStatus.healthy ? (
                <span className="text-trading-success flex items-center gap-1">
                  <span className="w-2 h-2 bg-trading-success rounded-full animate-pulse"></span>
                  Healthy
                </span>
              ) : (
                <span className="text-trading-danger flex items-center gap-1">
                  <span className="w-2 h-2 bg-trading-danger rounded-full"></span>
                  Issues
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-trading-muted">
              <span>Uptime: {systemStatus.uptime}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-trading-muted">
              <Clock className="w-4 h-4" />
              <span>Updated: {formatTime(lastUpdate)}</span>
            </div>
            <RefreshCw className="w-4 h-4 text-trading-muted animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import { useState, useEffect } from 'react'
import { Wifi, WifiOff, LogOut, TrendingUp } from 'lucide-react'

function Header({ onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(timer)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <header className="bg-trading-card border-b border-trading-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-trading-accent/10 px-3 py-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-trading-accent" />
              <span className="font-bold text-trading-text">MAC IS COOKING</span>
            </div>
            <span className="text-trading-muted text-sm hidden sm:block">Trading Terminal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-trading-success" />
              ) : (
                <WifiOff className="w-4 h-4 text-trading-danger" />
              )}
              <span className="text-trading-muted hidden sm:inline">
                {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>

            <div className="text-trading-text font-mono text-lg">
              {formatTime(currentTime)}
            </div>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-trading-border rounded-lg transition-colors text-trading-muted hover:text-trading-text"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Header from './components/Header'
import Watchlist from './components/Watchlist'
import AlertsPanel from './components/AlertsPanel'
import StrategyStatus from './components/StrategyStatus'
import Footer from './components/Footer'

const AUTH_KEY = 'trading_dashboard_auth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    localStorage.setItem(AUTH_KEY, 'true')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  const handleUpdate = () => {
    setLastUpdate(new Date())
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-trading-bg flex flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Watchlist onUpdate={handleUpdate} />
            <StrategyStatus onUpdate={handleUpdate} />
          </div>
          <div className="lg:col-span-1">
            <AlertsPanel onUpdate={handleUpdate} />
          </div>
        </div>
      </main>
      <Footer lastUpdate={lastUpdate} />
    </div>
  )
}

export default App
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

const CORRECT_PASSWORD = 'maciscooking2024'

function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      onLogin()
    } else {
      setError('Invalid password')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-trading-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-trading-card border border-trading-border rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-trading-accent/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-trading-accent" />
          </div>
          <h1 className="text-2xl font-bold text-trading-text mb-2">Trading Dashboard</h1>
          <p className="text-trading-muted">Enter password to access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-trading-bg border border-trading-border rounded-lg px-4 py-3 pr-12 text-trading-text placeholder-trading-muted focus:outline-none focus:border-trading-accent focus:ring-1 focus:ring-trading-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-trading-muted hover:text-trading-text transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="text-trading-danger text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-trading-accent hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
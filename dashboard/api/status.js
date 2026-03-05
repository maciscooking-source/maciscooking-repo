// /api/status.js
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const status = {
    healthy: true,
    uptime: '99.9%',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      api: 'operational',
      websocket: 'operational',
      database: 'operational'
    },
    strategies: [
      { 
        name: 'VWAP', 
        description: 'Volume Weighted Average Price crossover strategy', 
        status: 'active', 
        lastSignal: '2 min ago' 
      },
      { 
        name: 'EMA', 
        description: 'Exponential Moving Average crossover (9/21)', 
        status: 'active', 
        lastSignal: '5 min ago' 
      },
      { 
        name: 'RSI', 
        description: 'Relative Strength Index momentum (14)', 
        status: 'active', 
        lastSignal: '12 min ago' 
      },
    ]
  }

  res.status(200).json(status)
}
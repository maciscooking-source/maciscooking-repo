// /api/alerts.js
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const alerts = [
    { 
      id: 1, 
      symbol: 'SPY', 
      strategy: 'VWAP', 
      type: 'BUY', 
      message: 'Price crossed above VWAP with volume spike', 
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), 
      read: false 
    },
    { 
      id: 2, 
      symbol: 'QQQ', 
      strategy: 'EMA', 
      type: 'SELL', 
      message: '9 EMA crossed below 21 EMA - Bearish signal', 
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), 
      read: false 
    },
    { 
      id: 3, 
      symbol: 'NVDA', 
      strategy: 'RSI', 
      type: 'BUY', 
      message: 'RSI(14) bounced from oversold territory (28)', 
      timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(), 
      read: true 
    },
    { 
      id: 4, 
      symbol: 'AAPL', 
      strategy: 'VWAP', 
      type: 'SELL', 
      message: 'Rejected at VWAP resistance level', 
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), 
      read: true 
    },
    { 
      id: 5, 
      symbol: 'TSLA', 
      strategy: 'EMA', 
      type: 'BUY', 
      message: 'Golden cross forming on 1h timeframe', 
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), 
      read: true 
    },
    { 
      id: 6, 
      symbol: 'AMD', 
      strategy: 'RSI', 
      type: 'SELL', 
      message: 'RSI(14) overbought at 78 - Potential reversal', 
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), 
      read: true 
    },
  ]

  res.status(200).json({ alerts, count: alerts.length })
}
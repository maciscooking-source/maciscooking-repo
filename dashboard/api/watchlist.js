// /api/watchlist.js
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Simulate live price data
  const basePrices = {
    'SPY': 512.34,
    'QQQ': 438.92,
    'IWM': 203.45,
    'AAPL': 175.23,
    'MSFT': 412.67,
    'NVDA': 875.12,
    'TSLA': 198.45,
    'AMZN': 178.23,
    'META': 498.76,
    'AMD': 162.34
  }

  const symbols = Object.entries(basePrices).map(([symbol, basePrice]) => {
    const volatility = 0.005
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice
    const price = basePrice + change
    const changePercent = (change / basePrice) * 100
    
    const names = {
      'SPY': 'SPDR S&P 500',
      'QQQ': 'Invesco QQQ Trust',
      'IWM': 'iShares Russell 2000',
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corp.',
      'NVDA': 'NVIDIA Corp.',
      'TSLA': 'Tesla Inc.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms Inc.',
      'AMD': 'AMD Inc.'
    }

    return {
      symbol,
      name: names[symbol],
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2))
    }
  })

  res.status(200).json({ symbols, updatedAt: new Date().toISOString() })
}
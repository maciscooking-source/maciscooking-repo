import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// API endpoints
app.get('/api/alerts', (req, res) => {
  const alerts = [
    { id: 1, symbol: 'SPY', strategy: 'VWAP', type: 'BUY', message: 'Price crossed above VWAP with volume spike', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: 2, symbol: 'QQQ', strategy: 'EMA', type: 'SELL', message: '9 EMA crossed below 21 EMA - Bearish signal', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false },
    { id: 3, symbol: 'NVDA', strategy: 'RSI', type: 'BUY', message: 'RSI(14) bounced from oversold territory (28)', timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(), read: true },
    { id: 4, symbol: 'AAPL', strategy: 'VWAP', type: 'SELL', message: 'Rejected at VWAP resistance level', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), read: true },
  ];
  res.json({ alerts, count: alerts.length });
});

app.get('/api/watchlist', (req, res) => {
  const basePrices = { 'SPY': 512.34, 'QQQ': 438.92, 'IWM': 203.45, 'AAPL': 175.23, 'MSFT': 412.67, 'NVDA': 875.12, 'TSLA': 198.45, 'AMZN': 178.23, 'META': 498.76, 'AMD': 162.34 };
  const names = { 'SPY': 'SPDR S&P 500', 'QQQ': 'Invesco QQQ Trust', 'IWM': 'iShares Russell 2000', 'AAPL': 'Apple Inc.', 'MSFT': 'Microsoft Corp.', 'NVDA': 'NVIDIA Corp.', 'TSLA': 'Tesla Inc.', 'AMZN': 'Amazon.com Inc.', 'META': 'Meta Platforms Inc.', 'AMD': 'AMD Inc.' };
  
  const symbols = Object.entries(basePrices).map(([symbol, basePrice]) => {
    const change = (Math.random() - 0.5) * 2 * 0.005 * basePrice;
    return { symbol, name: names[symbol], price: Number((basePrice + change).toFixed(2)), change: Number(change.toFixed(2)), changePercent: Number(((change / basePrice) * 100).toFixed(2)) };
  });
  
  res.json({ symbols, updatedAt: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.json({
    healthy: true,
    uptime: '99.9%',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    strategies: [
      { name: 'VWAP', description: 'Volume Weighted Average Price crossover strategy', status: 'active', lastSignal: '2 min ago' },
      { name: 'EMA', description: 'Exponential Moving Average crossover (9/21)', status: 'active', lastSignal: '5 min ago' },
      { name: 'RSI', description: 'Relative Strength Index momentum (14)', status: 'active', lastSignal: '12 min ago' },
    ]
  });
});

// Static files
app.use(express.static('dist'));

// SPA fallback - must be last
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Trading Dashboard running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔑 Password: maciscooking2024`);
});

export default app;
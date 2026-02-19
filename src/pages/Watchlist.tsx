import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Watchlist: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState('');

  const watchlistItems = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 495.32,
      change: 12.45,
      changePercent: 2.58,
      dayHigh: 498.20,
      dayLow: 488.50,
      marketCap: '1.22T',
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      price: 168.75,
      change: -3.22,
      changePercent: -1.87,
      dayHigh: 172.40,
      dayLow: 167.80,
      marketCap: '272.5B',
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 178.92,
      change: 4.56,
      changePercent: 2.62,
      dayHigh: 180.20,
      dayLow: 175.30,
      marketCap: '1.85T',
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      price: 485.20,
      change: -6.75,
      changePercent: -1.37,
      dayHigh: 492.50,
      dayLow: 483.10,
      marketCap: '1.23T',
    },
    {
      symbol: 'NFLX',
      name: 'Netflix Inc.',
      price: 612.45,
      change: 8.92,
      changePercent: 1.48,
      dayHigh: 615.80,
      dayLow: 605.20,
      marketCap: '264.8B',
    },
  ];

  const alerts = [
    { id: 1, symbol: 'NVDA', type: 'price_above', value: 500, active: true },
    { id: 2, symbol: 'AMD', type: 'price_below', value: 165, active: true },
    { id: 3, symbol: 'AMZN', type: 'change_percent', value: 5, active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-white">PortfolioAI</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
                <Link to="/portfolio" className="text-slate-400 hover:text-white transition">Portfolio</Link>
                <Link to="/watchlist" className="text-white font-medium">Watchlist</Link>
                <Link to="/reports" className="text-slate-400 hover:text-white transition">Reports</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <Link to="/profile" className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Watchlist</h1>
            <p className="text-slate-400">Track stocks you're interested in</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition"
          >
            Add to Watchlist
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Total Watching</p>
            <p className="text-3xl font-bold text-white">{watchlistItems.length}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Gainers</p>
            <p className="text-3xl font-bold text-green-500">
              {watchlistItems.filter(item => item.change > 0).length}
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Losers</p>
            <p className="text-3xl font-bold text-red-500">
              {watchlistItems.filter(item => item.change < 0).length}
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Active Alerts</p>
            <p className="text-3xl font-bold text-blue-500">
              {alerts.filter(alert => alert.active).length}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Watchlist Items */}
          <div className="lg:col-span-2 space-y-4">
            {watchlistItems.map((item) => (
              <div
                key={item.symbol}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {item.symbol[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
                      <p className="text-slate-400 text-sm">{item.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mb-1">${item.price.toFixed(2)}</p>
                    <p className={`text-sm font-medium ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Day High</p>
                    <p className="text-white font-medium">${item.dayHigh.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Day Low</p>
                    <p className="text-white font-medium">${item.dayLow.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Market Cap</p>
                    <p className="text-white font-medium">${item.marketCap}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/asset-details/${item.symbol}`}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium text-center transition"
                  >
                    View Details
                  </Link>
                  <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition">
                    Add to Portfolio
                  </button>
                  <button className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Price Alerts */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Price Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{alert.symbol}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={alert.active} className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {alert.type === 'price_above'
                      ? `Price above $${alert.value}`
                      : alert.type === 'price_below'
                      ? `Price below $${alert.value}`
                      : `Change > ${alert.value}%`}
                  </p>
                </div>
              ))}
              <button className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-lg font-medium transition border border-slate-700">
                Create New Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Watchlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add to Watchlist</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Stock Symbol
              </label>
              <input
                type="text"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., AAPL, GOOGL, TSLA"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-lg font-medium transition border border-slate-700"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition">
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
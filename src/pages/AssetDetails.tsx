import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const AssetDetails: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');

  // Mock data
  const assetData = {
    symbol: symbol || 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 180.92,
    change: 2.34,
    changePercent: 1.31,
    shares: 250,
    avgPrice: 145.20,
    totalValue: 45230,
    dayHigh: 182.50,
    dayLow: 178.30,
    volume: '52.4M',
    marketCap: '2.85T',
    peRatio: 29.45,
    dividendYield: 0.52,
  };

  const news = [
    {
      id: 1,
      title: 'Apple announces new product lineup for 2024',
      source: 'TechCrunch',
      time: '2 hours ago',
      sentiment: 'positive',
    },
    {
      id: 2,
      title: 'Analysts raise price target on AAPL stock',
      source: 'Bloomberg',
      time: '5 hours ago',
      sentiment: 'positive',
    },
    {
      id: 3,
      title: 'Tech sector shows strong performance this quarter',
      source: 'Reuters',
      time: '1 day ago',
      sentiment: 'neutral',
    },
  ];

  const aiInsights = {
    score: 8.5,
    recommendation: 'Hold',
    reasons: [
      'Strong financial fundamentals with consistent revenue growth',
      'Market leader in consumer electronics with high brand loyalty',
      'Diversified revenue streams across products and services',
      'Stock currently trading above historical P/E ratio',
    ],
  };

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
                <Link to="/transactions" className="text-slate-400 hover:text-white transition">Transactions</Link>
                <Link to="/ai-insights" className="text-slate-400 hover:text-white transition">AI Insights</Link>
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/portfolio" className="hover:text-white transition">Portfolio</Link>
          <span>/</span>
          <span className="text-white">{assetData.symbol}</span>
        </div>

        {/* Asset Header */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {assetData.symbol[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{assetData.symbol}</h1>
                <p className="text-slate-400">{assetData.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition">
                Buy
              </button>
              <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition">
                Sell
              </button>
              <button className="px-6 py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-lg font-medium transition border border-slate-700">
                Add to Watchlist
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Current Price</p>
              <p className="text-2xl font-bold text-white">${assetData.currentPrice}</p>
              <p className={`text-sm ${assetData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {assetData.change >= 0 ? '+' : ''}{assetData.change} ({assetData.changePercent >= 0 ? '+' : ''}{assetData.changePercent}%)
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Your Shares</p>
              <p className="text-2xl font-bold text-white">{assetData.shares}</p>
              <p className="text-sm text-slate-500">Avg. ${assetData.avgPrice}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${assetData.totalValue.toLocaleString('en-US')}
              </p>
              <p className="text-sm text-green-500">
                +${((assetData.currentPrice - assetData.avgPrice) * assetData.shares).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Day Range</p>
              <p className="text-lg font-bold text-white">
                ${assetData.dayLow} - ${assetData.dayHigh}
              </p>
              <p className="text-sm text-slate-500">Volume: {assetData.volume}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Price Chart</h2>
                <div className="flex gap-2">
                  {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${
                        timeRange === range
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {/* Simplified chart representation */}
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500/40 rounded-t hover:from-blue-500/40 hover:to-blue-500/60 transition"
                    style={{ height: `${Math.random() * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Key Statistics */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Key Statistics</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Market Cap</p>
                  <p className="text-lg font-bold text-white">${assetData.marketCap}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">P/E Ratio</p>
                  <p className="text-lg font-bold text-white">{assetData.peRatio}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Dividend Yield</p>
                  <p className="text-lg font-bold text-white">{assetData.dividendYield}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">52 Week Range</p>
                  <p className="text-lg font-bold text-white">$145 - $195</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">AI Analysis</h2>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">AI Score</span>
                  <span className="text-2xl font-bold text-white">{aiInsights.score}/10</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                    style={{ width: `${aiInsights.score * 10}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                  {aiInsights.recommendation}
                </span>
              </div>
              <div className="space-y-2">
                {aiInsights.reasons.map((reason, index) => (
                  <div key={index} className="flex gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent News */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent News</h2>
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="pb-4 border-b border-slate-700 last:border-0 last:pb-0">
                    <h3 className="text-white font-medium mb-2 hover:text-blue-400 cursor-pointer transition">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All News
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
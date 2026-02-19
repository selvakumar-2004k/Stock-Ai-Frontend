import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'YTD'>('1Y');

  const performanceData = {
    portfolioReturn: 18.5,
    marketReturn: 12.3,
    alpha: 6.2,
    beta: 1.15,
    sharpeRatio: 1.85,
    maxDrawdown: -8.2,
  };

  const savedReports = [
    {
      id: 1,
      title: 'Q4 2024 Performance Review',
      date: '2024-01-15',
      type: 'Performance',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Annual Tax Summary 2024',
      date: '2024-01-10',
      type: 'Tax',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Portfolio Diversification Analysis',
      date: '2024-01-05',
      type: 'Analysis',
      size: '3.2 MB',
    },
  ];

  const sectorPerformance = [
    { sector: 'Technology', allocation: 68, return: 24.5, benchmark: 18.2 },
    { sector: 'Healthcare', allocation: 12, return: 15.3, benchmark: 14.8 },
    { sector: 'Finance', allocation: 10, return: 12.7, benchmark: 11.5 },
    { sector: 'Automotive', allocation: 10, return: 28.3, benchmark: 22.1 },
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
                <Link to="/watchlist" className="text-slate-400 hover:text-white transition">Watchlist</Link>
                <Link to="/reports" className="text-white font-medium">Reports</Link>
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
            <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
            <p className="text-slate-400">Comprehensive portfolio analysis and insights</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition">
            Generate Report
          </button>
        </div>

        {/* Performance Overview */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Performance Overview</h2>
            <div className="flex gap-2">
              {(['1M', '3M', '6M', '1Y', 'YTD'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    selectedPeriod === period
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Portfolio Return</p>
              <p className="text-3xl font-bold text-green-500 mb-1">+{performanceData.portfolioReturn}%</p>
              <p className="text-slate-500 text-sm">vs Market +{performanceData.marketReturn}%</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Alpha</p>
              <p className="text-3xl font-bold text-blue-500 mb-1">+{performanceData.alpha}%</p>
              <p className="text-slate-500 text-sm">Excess return over benchmark</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Sharpe Ratio</p>
              <p className="text-3xl font-bold text-white mb-1">{performanceData.sharpeRatio}</p>
              <p className="text-slate-500 text-sm">Risk-adjusted return</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-900 p-6 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Beta (Market Correlation)</p>
              <p className="text-2xl font-bold text-white mb-1">{performanceData.beta}</p>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(performanceData.beta / 2) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Maximum Drawdown</p>
              <p className="text-2xl font-bold text-red-500 mb-1">{performanceData.maxDrawdown}%</p>
              <p className="text-slate-500 text-sm mt-4">Largest peak-to-trough decline</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Sector Performance */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Sector Performance</h2>
            <div className="space-y-4">
              {sectorPerformance.map((sector) => (
                <div key={sector.sector} className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{sector.sector}</p>
                      <p className="text-slate-500 text-sm">{sector.allocation}% allocation</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${sector.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        +{sector.return}%
                      </p>
                      <p className="text-slate-500 text-sm">vs {sector.benchmark}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      style={{ width: `${(sector.return / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers & Underperformers */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Top & Bottom Performers</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-green-500 font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Top Gainers
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-white font-medium">TSLA</span>
                    <span className="text-green-500 font-bold">+28.3%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-white font-medium">AAPL</span>
                    <span className="text-green-500 font-bold">+24.6%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-red-500 font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  Underperformers
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-white font-medium">JPM</span>
                    <span className="text-red-500 font-bold">+4.6%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-white font-medium">GOOGL</span>
                    <span className="text-red-500 font-bold">+7.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Reports */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Saved Reports</h2>
          <div className="space-y-3">
            {savedReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-slate-900 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{report.title}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-400 hover:text-blue-300 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import stockLogo from '../assets/stock_logo.png';

interface Insight {
  id: number;
  category: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  impact: string;
}

interface Prediction {
  symbol: string;
  name: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  sentiment: string;
}

interface StockAnalysis {
  symbol: string;
  name: string;
  currentPrice: number;
  analysis: string;
  sentiment: string;
  recommendation: string;
  metrics?: {
    volatility?: number;
    momentum?: number;
    trend?: string;
  };
}

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [portfolioScore, setPortfolioScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockAnalysis[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'insights' | 'predictions'>('overview');

  useEffect(() => {
    const getAIData = async () => {
      try {
        setLoading(true);
        const response = await API.get('/portfolios/ai-analysis?stocks=RELIANCE,TCS', {
          timeout: 30000 
        });
        
        console.log("API Data received:", response.data);

        setInsights(response.data.insights || []);
        setPredictions(response.data.predictions || []);
        setPortfolioScore(response.data.score || 0);
      } catch (err: any) {
        if (err.code === 'ECONNABORTED') {
          console.error("AI is taking too long. Try again in a moment.");
        } else {
          console.error("Server Error Detail:", err.response?.data || err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    getAIData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await API.get(`/portfolios/ai-analysis?stocks=${searchQuery.toUpperCase()}`, {
        timeout: 30000
      });
      
      if (response.data.predictions && response.data.predictions.length > 0) {
        setSearchResults(response.data.predictions.map((pred: Prediction) => ({
          symbol: pred.symbol,
          name: pred.name,
          currentPrice: pred.currentPrice,
          analysis: `AI analysis suggests ${pred.sentiment} trend with ${pred.confidence}% confidence`,
          sentiment: pred.sentiment,
          recommendation: `Target price: ₹${pred.predictedPrice.toFixed(2)} (${pred.timeframe})`,
          metrics: {
            volatility: pred.confidence,
            momentum: ((pred.predictedPrice - pred.currentPrice) / pred.currentPrice) * 100,
            trend: pred.sentiment
          }
        })));
      }
    } catch (err: any) {
      console.error("Search Error:", err.response?.data || err.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Helper function to determine if sentiment is bullish
  const isBullish = (sentiment: string) => {
    const bullishTerms = ['bullish', 'growth', 'positive', 'buy', 'strong buy', 'high growth'];
    return bullishTerms.some(term => sentiment.toLowerCase().includes(term));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-3 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-blue-400 font-mono text-lg animate-pulse tracking-widest">ANALYZING PORTFOLIO...</p>
          <p className="text-slate-500 text-sm mt-2">Processing market data with AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
  <div className="w-10 h-10 bg-slate-800 rounded-xl shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center overflow-hidden border border-slate-700">
    <img 
      src={stockLogo} 
      alt="PortfolioAI Logo" 
      className="w-7 h-7 object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all"
    />
  </div>
  <span className="text-xl font-bold tracking-tight text-white">Stock AI</span>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/portfolio" className="text-slate-400 hover:text-white transition-colors">Portfolio</Link>
                <Link to="/ai-insights" className="text-white font-medium">AI Insights</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Enhanced Header with Search */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-white via-blue-200 to-slate-400 bg-clip-text text-transparent">
                AI Intelligence Hub
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">Advanced market analysis powered by machine learning</p>
            </div>
            
            {/* View Selector */}
            <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedView === 'overview'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedView('insights')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedView === 'insights'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Insights
              </button>
              <button
                onClick={() => setSelectedView('predictions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedView === 'predictions'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Predictions
              </button>
            </div>
          </div>

          {/* Advanced Search Bar */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/40">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search stocks for detailed AI analysis (e.g., RELIANCE, TCS, INFY)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analyze
                  </>
                )}
              </button>
            </div>
            
            {/* Search Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 font-medium">Quick search:</span>
              {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ITC'].map((stock) => (
                <button
                  key={stock}
                  onClick={() => {
                    setSearchQuery(stock);
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-lg transition-all border border-slate-700 hover:border-slate-600"
                >
                  {stock}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6 bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analysis Results
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {searchResults.map((result) => {
                  const resultIsBullish = isBullish(result.sentiment);
                  return (
                    <div key={result.symbol} className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700 hover:border-blue-600/50 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">{result.symbol}</h4>
                          <p className="text-slate-400 text-sm">{result.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">₹{result.currentPrice.toFixed(2)}</p>
                            {result.metrics && result.metrics.momentum !== undefined && (
                              <p className={`text-sm font-medium ${result.metrics.momentum >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {result.metrics.momentum >= 0 ? '+' : ''}{result.metrics.momentum.toFixed(2)}%
                              </p>
                            )}
                          </div>
                          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                            resultIsBullish
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {resultIsBullish ? '🚀 Bullish' : '📉 Bearish'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-xs text-slate-500 uppercase font-medium mb-2">AI Analysis</p>
                          <p className="text-sm text-slate-300">{result.analysis}</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-xs text-slate-500 uppercase font-medium mb-2">Recommendation</p>
                          <p className="text-sm text-blue-400 font-medium">{result.recommendation}</p>
                        </div>
                      </div>

                      {result.metrics && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                            <p className="text-xs text-slate-500 mb-1">Confidence</p>
                            <p className="text-lg font-bold text-white">{result.metrics.volatility}%</p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                            <p className="text-xs text-slate-500 mb-1">Momentum</p>
                            <p className={`text-lg font-bold ${(result.metrics.momentum ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {(result.metrics.momentum ?? 0).toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 col-span-2 sm:col-span-1">
                            <p className="text-xs text-slate-500 mb-1">Trend</p>
                            <p className="text-lg font-bold text-white capitalize">{result.metrics.trend}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Health Score - Enhanced */}
        {selectedView === 'overview' && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-700 mb-8 sm:mb-12 shadow-2xl shadow-black/40">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 rounded-full border border-blue-600/20 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Live Analysis</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Portfolio Health Score
                </h2>
                <p className="text-slate-400 max-w-md text-sm sm:text-base">
                  AI-calculated score based on diversification, risk metrics, and sector exposure analysis.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                    <p className="text-sm font-bold text-yellow-400">Moderate</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Diversity</p>
                    <p className="text-sm font-bold text-green-400">High</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Performance</p>
                    <p className="text-sm font-bold text-blue-400">Strong</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-2xl"></div>
                  
                  {/* SVG Circle */}
                  <svg className="w-full h-full transform -rotate-90 relative z-10">
                    <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                    <circle 
                      cx="112" cy="112" r="95" stroke="url(#gradient)" strokeWidth="12" fill="transparent" 
                      strokeDasharray={597}
                      strokeDashoffset={597 - (597 * portfolioScore) / 10}
                      className="transition-all duration-1000 drop-shadow-lg" 
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Score Display */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-6xl sm:text-7xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                      {portfolioScore}
                    </span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">out of 10</span>
                    <div className="mt-3 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < Math.floor(portfolioScore / 2) ? 'bg-blue-500' : 'bg-slate-700'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights and Predictions Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Strategic Insights */}
          {(selectedView === 'overview' || selectedView === 'insights') && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  Strategic Insights
                </h2>
                <span className="px-3 py-1 bg-blue-600/10 text-blue-400 text-xs font-bold rounded-full border border-blue-600/20">
                  {insights.length} Active
                </span>
              </div>
              
              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((item) => (
                    <div key={item.id} className="group bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-700 hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/10">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                          <div className={`w-2 h-2 rounded-full ${
                            item.severity === 'high' ? 'bg-red-500' : 
                            item.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          } animate-pulse`}></div>
                          {item.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          item.impact === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          item.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {item.impact} Impact
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">{item.description}</p>
                      <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 border border-blue-500/20 p-4 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">💡</span>
                          </div>
                          <div>
                            <p className="text-xs text-blue-400 font-bold uppercase mb-1">AI Recommendation</p>
                            <p className="text-sm text-blue-300">{item.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">No insights available at the moment</p>
                </div>
              )}
            </div>
          )}

          {/* AI Forecasts */}
          {(selectedView === 'overview' || selectedView === 'predictions') && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                  AI Forecasts
                </h2>
                <span className="px-3 py-1 bg-purple-600/10 text-purple-400 text-xs font-bold rounded-full border border-purple-600/20">
                  {predictions.length} Stocks
                </span>
              </div>
              
              {predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.map((stock) => {
                    const stockIsBullish = isBullish(stock.sentiment);
                    return (
                      <div key={stock.symbol} className="group bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-700 hover:border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/10">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                              <span className="text-white font-bold text-lg">{stock.symbol[0]}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{stock.symbol}</h4>
                              <p className="text-slate-500 text-sm">{stock.name}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-2 ${
                            stockIsBullish
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {stockIsBullish ? '🚀' : '📉'}
                            {stockIsBullish ? 'Bullish' : 'Bearish'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700 group-hover:border-slate-600 transition-colors">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Current Price</p>
                            <p className="font-mono font-bold text-white text-xl">₹{stock.currentPrice.toFixed(2)}</p>
                          </div>
                          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700 group-hover:border-slate-600 transition-colors">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Target Price</p>
                            <p className={`font-mono font-bold text-xl ${stockIsBullish ? 'text-green-400' : 'text-red-400'}`}>
                              ₹{stock.predictedPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-xs text-slate-400">Confidence Level</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  stock.confidence >= 80 ? 'bg-green-500' : stock.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${stock.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-white min-w-[3rem] text-right">{stock.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">No predictions available at the moment</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
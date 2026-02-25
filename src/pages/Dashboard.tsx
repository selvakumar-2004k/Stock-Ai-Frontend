import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import stockLogo from '../assets/stock_logo.png';

interface Asset {
  id: number;
  symbol: string;
  name?: string;
  shares: number;
  averagePrice: number;
  currentPrice?: number;
  sector?: string;
}

interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  assets: number;
}

interface PortfolioStats {
  totalValue: number;
  totalInvestment: number;
  totalGain: number;
  gainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalInvestment: 0,
    totalGain: 0,
    gainPercent: 0,
    dayChange: 0,
    dayChangePercent: 0,
  });
  const [sectorData, setSectorData] = useState<SectorAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  const getUserEmail = () => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).email : null;
  };

  const formatINR = (val: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(val);

  const calculateStats = (portfolioAssets: Asset[]): PortfolioStats => {
    const totalInvestment = portfolioAssets.reduce(
      (sum, asset) => sum + (asset.averagePrice * asset.shares), 
      0
    );
    
    const totalValue = portfolioAssets.reduce(
      (sum, asset) => sum + ((asset.currentPrice || asset.averagePrice) * asset.shares), 
      0
    );
    
    const totalGain = totalValue - totalInvestment;
    const gainPercent = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0;
    
    // Simulate day change (in real app, this would come from API)
    const dayChange = totalValue * 0.0; // 1.5% example
    const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;
    
    return {
      totalValue,
      totalInvestment,
      totalGain,
      gainPercent,
      dayChange,
      dayChangePercent,
    };
  };

  const calculateSectorAllocation = (portfolioAssets: Asset[]): SectorAllocation[] => {
    const sectorMap = new Map<string, { value: number; assets: number }>();
    
    portfolioAssets.forEach(asset => {
      const sector = asset.sector || 'Others';
      const value = (asset.currentPrice || asset.averagePrice) * asset.shares;
      
      if (sectorMap.has(sector)) {
        const existing = sectorMap.get(sector)!;
        sectorMap.set(sector, {
          value: existing.value + value,
          assets: existing.assets + 1
        });
      } else {
        sectorMap.set(sector, { value, assets: 1 });
      }
    });
    
    const totalValue = portfolioAssets.reduce(
      (sum, asset) => sum + ((asset.currentPrice || asset.averagePrice) * asset.shares),
      0
    );
    
    return Array.from(sectorMap.entries())
      .map(([sector, data]) => ({
        sector,
        value: data.value,
        percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
        assets: data.assets
      }))
      .sort((a, b) => b.value - a.value);
  };

  const fetchPortfolio = async () => {
    const email = getUserEmail();
    if (!email) {
      setError("No user session found. Please login.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await API.get(`/portfolios?email=${email}`);
      const portfolioAssets = Array.isArray(response.data) ? response.data : [];
      
      setAssets(portfolioAssets);
      setStats(calculateStats(portfolioAssets));
      setSectorData(calculateSectorAllocation(portfolioAssets));
      
      // Fetch live prices
      if (portfolioAssets.length > 0) {
        const symbols = portfolioAssets.map(a => a.symbol).join(',');
        try {
          const pricesResponse = await API.get(`/market/prices?symbols=${symbols}`);
          if (pricesResponse.data) {
            const updatedAssets = portfolioAssets.map(asset => ({
              ...asset,
              currentPrice: pricesResponse.data[asset.symbol] || asset.averagePrice
            }));
            setAssets(updatedAssets);
            setStats(calculateStats(updatedAssets));
            setSectorData(calculateSectorAllocation(updatedAssets));
          }
        } catch (priceErr) {
          console.warn("Failed to fetch live prices, using average prices");
        }
      }
    } catch (err: any) {
      console.error("Portfolio fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch portfolio data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPortfolio();
    setRefreshing(false);
  };

  const handleSell = async (asset: Asset) => {
    if (!asset.id) {
      alert("Error: This asset has no ID.");
      return;
    }

    const email = getUserEmail();
    const sellPrice = asset.currentPrice || asset.averagePrice;

    if (window.confirm(`Confirm sale of all ${asset.shares} shares of ${asset.symbol} at ${formatINR(sellPrice)}?`)) {
      try {
        await API.post('/transactions', {
          symbol: asset.symbol,
          type: 'SELL',
          shares: asset.shares,
          price: sellPrice,
          total: asset.shares * sellPrice,
          userEmail: email
        });

        await API.delete(`/portfolios/${asset.id}`);
        
        await fetchPortfolio();
        alert("Trade executed successfully!");
      } catch (err: any) {
        console.error("Transaction failed:", err);
        alert(err.response?.data?.message || "Transaction failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading && assets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-3 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-blue-400 font-mono text-lg animate-pulse tracking-widest">LOADING DASHBOARD...</p>
          <p className="text-slate-500 text-sm mt-2">Syncing your portfolio</p>
        </div>
      </div>
    );
  }

  const topGainer = assets.length > 0 
    ? assets.reduce((max, asset) => {
        const currentGain = ((asset.currentPrice || asset.averagePrice) - asset.averagePrice) / asset.averagePrice * 100;
        const maxGain = ((max.currentPrice || max.averagePrice) - max.averagePrice) / max.averagePrice * 100;
        return currentGain > maxGain ? asset : max;
      })
    : null;

  const topLoser = assets.length > 0
    ? assets.reduce((min, asset) => {
        const currentGain = ((asset.currentPrice || asset.averagePrice) - asset.averagePrice) / asset.averagePrice * 100;
        const minGain = ((min.currentPrice || min.averagePrice) - min.averagePrice) / min.averagePrice * 100;
        return currentGain < minGain ? asset : min;
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              {/* <Link to="/" className="flex items-center gap-3 group">
              <Link to="/" className="flex items-center gap-3 group"> */}
  {/* The container now holds your custom PNG logo */}
  <div className="w-10 h-10 bg-slate-800 rounded-xl shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center overflow-hidden border border-slate-700">
    <img 
      src={stockLogo} 
      alt="PortfolioAI Logo" 
      className="w-7 h-7 object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all"
    />
  </div>
  <span className="text-xl font-bold tracking-tight text-white">Stock AI</span>
{/* </Link>
</Link> */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-white font-medium">Dashboard</Link>
                <Link to="/portfolio" className="text-slate-400 hover:text-white transition-colors">Portfolio</Link>
                <Link to="/ai-insights" className="text-slate-400 hover:text-white transition-colors">AI Insights</Link>
                <Link to="/transactions" className="text-slate-400 hover:text-white transition-colors">Transactions</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* <Link to="/profile" className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/30"></Link> */}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
            <button 
              onClick={handleRefresh} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
            >
              RETRY
            </button>
          </div>
        )}

        {/* Portfolio Value Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-700 mb-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/10 rounded-full border border-green-600/20 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Live Market</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">Total Portfolio Value</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {formatINR(stats.totalValue)}
              </h1>
            </div>
            
            {/* Period Selector */}
            <div className="flex gap-2 bg-slate-950/50 p-1.5 rounded-xl border border-slate-700">
              {(['1D', '1W', '1M', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Today's Change</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-black ${stats.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.dayChange >= 0 ? '+' : ''}{formatINR(stats.dayChange)}
                </p>
                <span className={`text-sm font-bold ${stats.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ({stats.dayChange >= 0 ? '+' : ''}{stats.dayChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Gain/Loss</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-black ${stats.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.totalGain >= 0 ? '+' : ''}{formatINR(stats.totalGain)}
                </p>
                <span className={`text-sm font-bold ${stats.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ({stats.totalGain >= 0 ? '+' : ''}{stats.gainPercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Invested</p>
              <p className="text-2xl font-black text-white">{formatINR(stats.totalInvestment)}</p>
            </div>

            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Assets</p>
              <p className="text-2xl font-black text-white">{assets.length}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Holdings List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 gap-4">
              {topGainer && (
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 p-5 rounded-2xl border border-green-600/20">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p className="text-green-400 text-xs font-bold uppercase">Top Gainer</p>
                  </div>
                  <p className="text-white font-bold text-lg mb-1">{topGainer.symbol}</p>
                  <p className="text-green-400 font-bold">
                    +{(((topGainer.currentPrice || topGainer.averagePrice) - topGainer.averagePrice) / topGainer.averagePrice * 100).toFixed(2)}%
                  </p>
                </div>
              )}

              {topLoser && (
                <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 p-5 rounded-2xl border border-red-600/20">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <p className="text-red-400 text-xs font-bold uppercase">Top Loser</p>
                  </div>
                  <p className="text-white font-bold text-lg mb-1">{topLoser.symbol}</p>
                  <p className="text-red-400 font-bold">
                    {(((topLoser.currentPrice || topLoser.averagePrice) - topLoser.averagePrice) / topLoser.averagePrice * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </div>

            {/* Holdings */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-700 bg-slate-950/50">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  Your Holdings
                </h2>
              </div>

              {assets.length === 0 ? (
                <div className="p-12 sm:p-20 text-center">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Holdings Yet</h3>
                  <p className="text-slate-400 mb-6">Start building your portfolio</p>
                  <Link
                    to="/portfolio"
                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                  >
                    Browse Stocks
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {assets.map((asset) => {
                    const currentVal = asset.currentPrice || asset.averagePrice;
                    const gain = currentVal - asset.averagePrice;
                    const gainPercent = asset.averagePrice > 0 ? (gain / asset.averagePrice) * 100 : 0;
                    const totalValue = currentVal * asset.shares;

                    return (
                      <div
                        key={asset.id}
                        className="group p-5 hover:bg-slate-800/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg flex-shrink-0">
                              {asset.symbol[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-white text-lg truncate">{asset.symbol}</p>
                                {asset.sector && (
                                  <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-600/10 text-blue-400 text-xs rounded-full border border-blue-600/20">
                                    {asset.sector}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {asset.shares} shares • Avg: {formatINR(asset.averagePrice)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="text-right">
                              <p className="font-mono font-bold text-white text-lg mb-1">
                                {formatINR(totalValue)}
                              </p>
                              <div className="flex items-center justify-end gap-1">
                                <span className={`text-xs font-bold ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {gain >= 0 ? '▲' : '▼'}
                                </span>
                                <span className={`text-xs font-bold ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {Math.abs(gainPercent).toFixed(2)}%
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleSell(asset)}
                              className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-600 rounded-xl text-xs font-bold uppercase transition-all opacity-0 group-hover:opacity-100"
                            >
                              Sell
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sector Allocation */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                Sector Allocation
              </h2>
              {sectorData.length > 0 ? (
                <div className="space-y-4">
                  {sectorData.map((sector, index) => (
                    <div key={sector.sector}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm">{sector.sector}</span>
                        <span className="text-slate-400 text-sm">{sector.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            index === 1 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                            index === 2 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          }`}
                          style={{ width: `${sector.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatINR(sector.value)} • {sector.assets} {sector.assets === 1 ? 'asset' : 'assets'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No sector data available</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/portfolio"
                  className="flex items-center gap-3 p-4 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition border border-slate-700 hover:border-blue-600/50"
                >
                  <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Add Investment</p>
                    <p className="text-slate-500 text-xs">Buy new stocks</p>
                  </div>
                </Link>

                <Link
                  to="/ai-insights"
                  className="flex items-center gap-3 p-4 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition border border-slate-700 hover:border-purple-600/50"
                >
                  <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">AI Insights</p>
                    <p className="text-slate-500 text-xs">Get recommendations</p>
                  </div>
                </Link>

                <Link
                  to="/transactions"
                  className="flex items-center gap-3 p-4 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition border border-slate-700 hover:border-green-600/50"
                >
                  <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">View History</p>
                    <p className="text-slate-500 text-xs">All transactions</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
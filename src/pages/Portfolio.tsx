import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import stockLogo from '../assets/stock_logo.png';

// --- INTERFACES ---
interface PortfolioAsset {
  id: number;
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  sector: string;
  currentPrice?: number;
}

interface MarketStock {
  symbol: string;
  name: string;
  price: number;
  sector: string;
}

interface PortfolioStats {
  totalValue: number;
  totalInvestment: number;
  totalGain: number;
  totalGainPercent: number;
  totalAssets: number;
}

const INITIAL_STOCKS: MarketStock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2980.50, sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4150.20, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1675.00, sector: 'Finance' },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1530.45, sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1150.00, sector: 'Finance' },
  { symbol: 'ITC', name: 'ITC Limited', price: 435.00, sector: 'Consumer' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 790.15, sector: 'Finance' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1250.00, sector: 'Telecom' },
  { symbol: 'LICI', name: 'LIC of India', price: 920.00, sector: 'Insurance' },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3550.00, sector: 'Construction' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', price: 580.00, sector: 'IT' },
  { symbol: 'AXISBANK', name: 'Axis Bank', price: 1089.00, sector: 'Finance' },
];

const Portfolio: React.FC = () => {
  // --- STATE ---
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [marketStocks, setMarketStocks] = useState<MarketStock[]>(INITIAL_STOCKS);
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalInvestment: 0,
    totalGain: 0,
    totalGainPercent: 0,
    totalAssets: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<MarketStock | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<PortfolioAsset | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState<'holdings' | 'market'>('holdings');

  const getUserEmail = () => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).email : null;
  };

  // --- UTILITY FUNCTIONS ---
  const formatINR = (val: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(val);

  const calculateStats = (portfolioAssets: PortfolioAsset[]): PortfolioStats => {
    const totalInvestment = portfolioAssets.reduce(
      (sum, asset) => sum + (asset.averagePrice * asset.shares), 
      0
    );
    
    const totalValue = portfolioAssets.reduce(
      (sum, asset) => sum + ((asset.currentPrice || asset.averagePrice) * asset.shares), 
      0
    );
    
    const totalGain = totalValue - totalInvestment;
    const totalGainPercent = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0;
    
    return {
      totalValue,
      totalInvestment,
      totalGain,
      totalGainPercent,
      totalAssets: portfolioAssets.length,
    };
  };

  // --- API CALLS ---
  const fetchLiveMarketData = async (currentAssets: PortfolioAsset[]) => {
    try {
      const symbolList = INITIAL_STOCKS.map(s => s.symbol).join(',');
      const response = await API.get(`/market/prices?symbols=${symbolList}`);
      const livePrices = response.data;

      if (livePrices) {
        // Update Market List with live prices
        setMarketStocks(prev => prev.map(stock => ({
          ...stock,
          price: livePrices[stock.symbol] || stock.price
        })));

        // Update Portfolio Assets with live current prices
        const updatedAssets = currentAssets.map(asset => ({
          ...asset,
          currentPrice: livePrices[asset.symbol] || asset.averagePrice
        }));
        
        setAssets(updatedAssets);
        setStats(calculateStats(updatedAssets));
      }
    } catch (err) {
      console.warn("Live price sync failed, using cached prices", err);
    }
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
      const dbAssets = Array.isArray(response.data) ? response.data : [];
      
      setAssets(dbAssets);
      setStats(calculateStats(dbAssets));
      
      // Fetch live market prices
      await fetchLiveMarketData(dbAssets);
    } catch (err: any) {
      console.error("Portfolio fetch error:", err);
      setError(err.response?.data?.message || "Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPortfolio();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // --- BUY ACTION ---
  const handleOpenBuyModal = (stock: MarketStock) => {
    setSelectedStock(stock);
    setQuantity(1);
    setIsBuyModalOpen(true);
  };

  const handleConfirmBuy = async () => {
    const email = getUserEmail();
    if (!email || !selectedStock) return;

    const tradeData = {
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      shares: quantity,
      averagePrice: selectedStock.price,
      sector: selectedStock.sector,
      type: 'BUY',
      userEmail: email,
      total: selectedStock.price * quantity,
    };

    try {
      await API.post('/portfolios', tradeData);
      await API.post('/transactions', {
        symbol: selectedStock.symbol,
        type: 'BUY',
        shares: quantity,
        price: selectedStock.price,
        total: selectedStock.price * quantity,
        userEmail: email,
      });

      setIsBuyModalOpen(false);
      setSelectedStock(null);
      setQuantity(1);
      await fetchPortfolio();
    } catch (err: any) {
      console.error("Buy failed:", err);
      alert(err.response?.data?.message || "Trade execution failed. Please try again.");
    }
  };

  // --- SELL ACTION ---
  const handleOpenSellModal = (asset: PortfolioAsset) => {
    setSelectedAsset(asset);
    setQuantity(asset.shares);
    setIsSellModalOpen(true);
  };

  const handleConfirmSell = async () => {
    const email = getUserEmail();
    if (!email || !selectedAsset) return;

    const sellPrice = selectedAsset.currentPrice || selectedAsset.averagePrice;

    if (window.confirm(`Confirm sale of ${quantity} shares of ${selectedAsset.symbol} @ ${formatINR(sellPrice)}?`)) {
      try {
        await API.post('/transactions', {
          symbol: selectedAsset.symbol,
          type: 'SELL',
          shares: quantity,
          price: sellPrice,
          total: sellPrice * quantity,
          userEmail: email,
        });

        if (quantity >= selectedAsset.shares) {
          await API.delete(`/portfolios/${selectedAsset.id}`);
        } else {
          await API.put(`/portfolios/${selectedAsset.id}`, {
            shares: selectedAsset.shares - quantity,
          });
        }

        setIsSellModalOpen(false);
        setSelectedAsset(null);
        setQuantity(1);
        await fetchPortfolio();
        alert("Trade executed successfully!");
      } catch (err: any) {
        console.error("Sell failed:", err);
        alert(err.response?.data?.message || "Transaction failed. Please try again.");
      }
    }
  };

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
          <p className="text-blue-400 font-mono text-lg animate-pulse tracking-widest">LOADING PORTFOLIO...</p>
          <p className="text-slate-500 text-sm mt-2">Syncing market data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
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
                <Link to="/portfolio" className="text-white font-medium">Portfolio</Link>
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

        {/* Portfolio Stats Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-700 mb-8 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 rounded-full border border-blue-600/20 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Live Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-white via-blue-200 to-slate-400 bg-clip-text text-transparent">
                Total Portfolio Value
              </h1>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Current Value</p>
              <p className="text-3xl font-black text-white mb-2">{formatINR(stats.totalValue)}</p>
              {stats.totalGain !== 0 && (
                <div className={`flex items-center gap-1 ${stats.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <span className="text-sm">{stats.totalGain >= 0 ? '▲' : '▼'}</span>
                  <span className="text-sm font-bold">
                    {stats.totalGain >= 0 ? '+' : ''}{formatINR(stats.totalGain)}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Invested</p>
              <p className="text-3xl font-black text-white">{formatINR(stats.totalInvestment)}</p>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Return</p>
              <p className={`text-3xl font-black ${stats.totalGainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalGainPercent >= 0 ? '+' : ''}{stats.totalGainPercent.toFixed(2)}%
              </p>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Assets</p>
              <p className="text-3xl font-black text-white">{stats.totalAssets}</p>
            </div>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
          <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedView('holdings')}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                selectedView === 'holdings'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Your Holdings
            </button>
            <button
              onClick={() => setSelectedView('market')}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                selectedView === 'market'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Market Stocks
            </button>
          </div>

          {selectedView === 'market' && (
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className="w-full sm:w-64 px-4 py-3 pl-10 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Your Holdings View */}
        {selectedView === 'holdings' && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            {assets.length === 0 ? (
              <div className="p-12 sm:p-20 text-center">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Holdings Yet</h3>
                <p className="text-slate-400 mb-6">Start building your portfolio by buying stocks from the market</p>
                <button
                  onClick={() => setSelectedView('market')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                >
                  Browse Market Stocks
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-950/50">
                    <tr>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Stock</th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Qty</th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Avg Price</th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Current</th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden md:table-cell">Value</th>
                      <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">P&L</th>
                      <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {assets.map((asset) => {
                      const currentPrice = asset.currentPrice || asset.averagePrice;
                      const totalValue = currentPrice * asset.shares;
                      const pl = (currentPrice - asset.averagePrice) * asset.shares;
                      const plPercent = asset.averagePrice > 0 ? (pl / (asset.averagePrice * asset.shares)) * 100 : 0;

                      return (
                        <tr key={asset.id} className="hover:bg-slate-800/50 transition group">
                          <td className="px-4 sm:px-6 py-5">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg text-sm sm:text-base">
                                {asset.symbol[0]}
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm sm:text-lg">{asset.symbol}</p>
                                <p className="text-xs text-slate-500 hidden sm:block">{asset.name || asset.sector}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-5">
                            <p className="text-white font-mono font-bold text-sm sm:text-base">{asset.shares}</p>
                          </td>
                          <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                            <p className="text-slate-400 font-mono text-sm">{formatINR(asset.averagePrice)}</p>
                          </td>
                          <td className="px-4 sm:px-6 py-5">
                            <p className="text-blue-400 font-mono font-bold text-sm sm:text-base">{formatINR(currentPrice)}</p>
                          </td>
                          <td className="px-4 sm:px-6 py-5 hidden md:table-cell">
                            <p className="text-white font-mono font-bold">{formatINR(totalValue)}</p>
                          </td>
                          <td className="px-4 sm:px-6 py-5 text-right">
                            <p className={`font-mono font-bold text-sm sm:text-base ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {pl >= 0 ? '+' : ''}{formatINR(pl)}
                            </p>
                            <p className={`text-xs font-bold ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {pl >= 0 ? '▲' : '▼'} {Math.abs(plPercent).toFixed(2)}%
                            </p>
                          </td>
                          <td className="px-4 sm:px-6 py-5 text-right">
                            <button
                              onClick={() => handleOpenSellModal(asset)}
                              className="px-3 sm:px-5 py-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-600 rounded-xl text-xs font-bold uppercase transition-all"
                            >
                              Sell
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Market Stocks View */}
        {selectedView === 'market' && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-950/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Stock</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Sector</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Price</th>
                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {marketStocks
                    .filter((stock) => stock.symbol.includes(searchTerm) || stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-slate-800/50 transition group">
                        <td className="px-4 sm:px-6 py-5">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg text-sm sm:text-base">
                              {stock.symbol[0]}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm sm:text-lg">{stock.symbol}</p>
                              <p className="text-xs text-slate-500 line-clamp-1">{stock.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                          <span className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full text-xs font-bold border border-blue-600/20">
                            {stock.sector}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-5">
                          <p className="text-blue-400 font-mono font-bold text-sm sm:text-lg">{formatINR(stock.price)}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-5 text-right">
                          <button
                            onClick={() => handleOpenBuyModal(stock)}
                            className="px-4 sm:px-6 py-2 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/20 hover:border-green-600 rounded-xl text-xs font-bold uppercase transition-all"
                          >
                            Buy
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Buy Modal */}
      {isBuyModalOpen && selectedStock && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-white">Buy Order</h3>
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-700 mb-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl">
                  {selectedStock.symbol[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-base sm:text-lg">{selectedStock.symbol}</p>
                  <p className="text-xs text-slate-500">{selectedStock.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                <span className="text-slate-400 text-sm">Price per share</span>
                <span className="text-blue-400 font-mono font-bold text-base sm:text-lg">{formatINR(selectedStock.price)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-bold mb-3 uppercase">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="bg-blue-600/10 p-4 sm:p-5 rounded-2xl border border-blue-600/20 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold text-sm sm:text-base">Total Cost</span>
                <span className="text-white font-mono font-black text-xl sm:text-2xl">
                  {formatINR(selectedStock.price * quantity)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="flex-1 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBuy}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold shadow-lg shadow-green-600/30 transition text-sm sm:text-base"
              >
                Confirm Buy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {isSellModalOpen && selectedAsset && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-white">Sell Order</h3>
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-700 mb-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl">
                  {selectedAsset.symbol[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-base sm:text-lg">{selectedAsset.symbol}</p>
                  <p className="text-xs text-slate-500">You own {selectedAsset.shares} shares</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                <span className="text-slate-400 text-sm">Current price</span>
                <span className="text-blue-400 font-mono font-bold text-base sm:text-lg">
                  {formatINR(selectedAsset.currentPrice || selectedAsset.averagePrice)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-bold mb-3 uppercase">Quantity to Sell</label>
              <input
                type="number"
                min="1"
                max={selectedAsset.shares}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(selectedAsset.shares, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>

            <div className="bg-red-600/10 p-4 sm:p-5 rounded-2xl border border-red-600/20 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold text-sm sm:text-base">Total Proceeds</span>
                <span className="text-white font-mono font-black text-xl sm:text-2xl">
                  {formatINR((selectedAsset.currentPrice || selectedAsset.averagePrice) * quantity)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="flex-1 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSell}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-600/30 transition text-sm sm:text-base"
              >
                Confirm Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
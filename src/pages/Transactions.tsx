import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'BUY' | 'SELL'>('all');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const savedUser = localStorage.getItem('user');
      const email = savedUser ? JSON.parse(savedUser).email : null;

      if (!email) {
        setTransactions([]);
        return;
      }

      const response = await API.get(`/transactions?email=${email}`);
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const formatINR = (val: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  // Filtering Logic
  const filtered = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type?.toUpperCase() === filterType.toUpperCase();
  });

  // Modern Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-400 font-mono text-lg animate-pulse tracking-widest">SYNCING_LEDGER...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      {/* Optional: Simple Navigation Bar for easy return */}
      <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium text-sm">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              Transaction History
            </h1>
            <p className="text-slate-400 text-sm pl-4">Review all your past trades and ledger entries.</p>
          </div>
          
          {/* Segmented Filter Control */}
          <div className="inline-flex bg-slate-950/50 p-1.5 rounded-xl border border-slate-700/50 self-start sm:self-auto shadow-inner">
            {(['all', 'BUY', 'SELL'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  filterType === type 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type === 'all' ? 'All Trades' : type}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          // Modern Empty State
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 sm:p-20 text-center shadow-xl">
            <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
            <p className="text-slate-400 text-sm">You haven't made any {filterType !== 'all' ? filterType : ''} trades yet.</p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Card Layout (Hidden on screens larger than 'md') */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filtered.map((t) => (
                <div key={t.id} className="bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/50 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-black shadow-inner">
                        {t.symbol[0]}
                      </div>
                      <span className="font-bold text-xl text-white">{t.symbol}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                      t.type?.toUpperCase() === 'BUY' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {t.type?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                      <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Shares</p>
                      <p className="font-mono text-slate-200 font-medium">{t.shares}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                      <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Price</p>
                      <p className="font-mono text-slate-200 font-medium">{formatINR(t.price)}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Value</span>
                    <span className="font-mono font-black text-white text-lg">{formatINR(t.total)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: Table Layout (Hidden on screens smaller than 'md') */}
            <div className="hidden md:block bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-700/50">
                  <tr>
                    <th className="p-6 font-semibold">Asset Symbol</th>
                    <th className="p-6 font-semibold">Order Type</th>
                    <th className="p-6 font-semibold">Quantity</th>
                    <th className="p-6 font-semibold">Price per Share</th>
                    <th className="p-6 text-right font-semibold">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 font-bold text-xs group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                            {t.symbol[0]}
                          </div>
                          <span className="font-bold text-white text-base">{t.symbol}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                          t.type?.toUpperCase() === 'BUY' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {t.type?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-6 font-mono text-slate-300 font-medium">
                        {t.shares}
                      </td>
                      <td className="p-6 font-mono text-slate-400">
                        {formatINR(t.price)}
                      </td>
                      <td className="p-6 text-right">
                        <span className="font-mono font-bold text-white text-lg">{formatINR(t.total)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
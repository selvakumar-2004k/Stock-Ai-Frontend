import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import stockLogo from '../assets/stock_logo.png';

interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  displayName: string;
  avatar?: string;
}

interface PortfolioStats {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  joinDate: string;
  transactionsCount: number;
}



const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User Data
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    displayName: '',
  });

 

  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalGain: 0,
    totalGainPercent: 0,
    joinDate: '',
    transactionsCount: 0,
  });

 

  // Settings States
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    priceAlerts: true,
    newsAlerts: false,
    weeklyReport: true,
    portfolioUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    showPortfolio: false,
    dataAnalytics: true,
  });

  // const achievements = [
  //   { title: 'Early Adopter', description: 'Joined PortfolioAI in the first month', icon: '🌟', unlocked: true },
  //   { title: 'Consistent Investor', description: '50+ consecutive months of investing', icon: '📈', unlocked: true },
  //   { title: 'Diversification Master', description: 'Portfolio across 8+ sectors', icon: '🎯', unlocked: true },
  //   { title: 'High Performer', description: 'Beat market by 10%+ this year', icon: '🏆', unlocked: false },
  // ];

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user from localStorage first
        const savedUser = localStorage.getItem('user');
        let userId = null;
        
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          userId = parsed.id || parsed._id;
          
          // Set initial data from localStorage
          setProfile({
            fullName: parsed.name || parsed.fullName || 'Guest User',
            email: parsed.email || 'guest@portfolio.ai',
            phone: parsed.phone || '',
            location: parsed.location || '',
            bio: parsed.bio || '',
            displayName: parsed.displayName || parsed.name || 'Guest',
          });
        }

        // Fetch latest data from API if we have userId
        if (userId) {
          const response = await API.get(`/users/profile`);
          
          if (response.data) {
            const userData = response.data;
            setProfile({
              id: userData._id || userData.id,
              fullName: userData.name || userData.fullName || 'User',
              email: userData.email || '',
              phone: userData.phone || '',
              location: userData.location || '',
              bio: userData.bio || '',
              displayName: userData.displayName || userData.name || 'User',
              avatar: userData.avatar,
            });

            // Fetch portfolio stats
            try {
              const statsResponse = await API.get('/portfolios/stats');
              if (statsResponse.data) {
                setPortfolioStats({
                  totalValue: statsResponse.data.totalValue || 0,
                  totalGain: statsResponse.data.totalGain || 0,
                  totalGainPercent: statsResponse.data.totalGainPercent || 0,
                  joinDate: new Date(statsResponse.data.joinDate || userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                  transactionsCount: statsResponse.data.transactionsCount || 0,
                });
              }
            } catch (err) {
              console.error('Failed to fetch portfolio stats:', err);
            }

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch user data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Update profile via API
      const response = await API.put('/users/profile', {
        name: profile.fullName,
        displayName: profile.displayName,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
      });

      if (response.data) {
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error.response?.data || error.message);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Update settings via API
      await API.put('/users/settings', {
        twoFactor,
        notifications,
        privacy,
      });

      alert('Settings saved successfully!');
    } catch (error: any) {
      console.error('Failed to update settings:', error.response?.data || error.message);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleChangePassword = () => {
    // Implement password change modal/page
    alert('Password change feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
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
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/portfolio" className="text-slate-400 hover:text-white transition-colors">Portfolio</Link>
                <Link to="/ai-insights" className="text-slate-400 hover:text-white transition-colors">AI Insights</Link>
                <Link to="/profile" className="text-white font-medium">Profile</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white font-bold">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-700 mb-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-2xl shadow-blue-600/30">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {profile.fullName}
              </h1>
              <p className="text-slate-400 mb-3 text-sm sm:text-base">{profile.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-blue-600/10 text-blue-400 rounded-full text-xs font-bold border border-blue-600/20">
                  Member since {portfolioStats.joinDate}
                </span>
                <span className="px-4 py-1.5 bg-green-600/10 text-green-400 rounded-full text-xs font-bold border border-green-600/20">
                  {portfolioStats.transactionsCount} Transactions
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="inline-flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security
              </span>
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  Personal Information
                </h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      ) : (
                        <p className="text-white font-medium text-lg">{profile.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
                      <p className="text-white font-medium text-lg">{profile.email}</p>
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      ) : (
                        <p className="text-white font-medium text-lg">{profile.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm font-medium mb-2">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      ) : (
                        <p className="text-white font-medium text-lg">{profile.location || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                        placeholder="Tell us about your investment journey..."
                      />
                    ) : (
                      <p className="text-white text-base leading-relaxed">{profile.bio || 'No bio provided'}</p>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}
                </div>
              </div>

 


              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/portfolio"
                    className="flex items-center gap-3 p-3 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition border border-slate-700 hover:border-blue-600/50"
                  >
                    <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">View Portfolio</span>
                  </Link>
                  <button className="w-full flex items-center gap-3 p-3 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition border border-slate-700 hover:border-green-600/50">
                    <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">Download Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-6">
            {/* Notifications */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                Notifications
              </h2>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-700">
                    <div>
                      <p className="text-white font-bold text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        {key === 'emailAlerts' && 'Receive important updates via email'}
                        {key === 'priceAlerts' && 'Get notified when prices hit your targets'}
                        {key === 'newsAlerts' && 'Breaking news about your holdings'}
                        {key === 'weeklyReport' && 'Portfolio performance summary every week'}
                        {key === 'portfolioUpdates' && 'Daily portfolio value changes'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          value ? 'left-8' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                Privacy Settings
              </h2>
              <div className="space-y-4">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-700">
                    <div>
                      <p className="text-white font-bold text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        {key === 'publicProfile' && 'Allow others to view your profile'}
                        {key === 'showPortfolio' && 'Display your portfolio to other users'}
                        {key === 'dataAnalytics' && 'Help us improve with usage data'}
                      </p>
                    </div>
                    <button
                      onClick={() => setPrivacy({ ...privacy, [key]: !value })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          value ? 'left-8' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-teal-600 rounded-full"></div>
                Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-3">Time Zone</label>
                  <select className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-3">Currency</label>
                  <select className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="max-w-4xl space-y-6">
            {/* Two-Factor Authentication */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                Two-Factor Authentication
              </h2>
              <div className="flex items-center justify-between p-6 bg-slate-950/50 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">Enable 2FA</p>
                    <p className="text-slate-400 text-sm">Add extra security to your account</p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative w-16 h-8 rounded-full transition-colors ${
                    twoFactor ? 'bg-green-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      twoFactor ? 'left-9' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                Password
              </h2>
              <p className="text-slate-400 mb-6">Regularly update your password to keep your account secure</p>
              <button
                onClick={handleChangePassword}
                className="w-full py-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-blue-600/50 text-white rounded-xl font-bold transition-all"
              >
                Change Password
              </button>
            </div>

           

            {/* Danger Zone */}
            <div className="bg-gradient-to-br from-red-950/20 via-red-900/10 to-red-950/20 p-6 sm:p-8 rounded-2xl border border-red-600/20 shadow-xl">
              <h2 className="text-2xl font-black text-red-400 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-700 rounded-full"></div>
                Danger Zone
              </h2>
              <div className="space-y-4">
                <button className="w-full py-4 bg-slate-950/50 hover:bg-slate-900 border border-slate-700 hover:border-slate-600 text-white rounded-xl font-bold transition-all">
                  Export All Data
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 hover:border-red-600/50 text-red-400 rounded-xl font-bold transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
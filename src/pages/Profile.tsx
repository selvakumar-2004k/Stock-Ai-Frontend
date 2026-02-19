// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Profile: React.FC = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     fullName: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '+1 (555) 123-4567',
//     location: 'San Francisco, CA',
//     bio: 'Experienced investor focused on long-term growth in technology and healthcare sectors.',
//   });

//   const handleSave = () => {
//     setIsEditing(false);
//     // Save logic here
//   };

//   const portfolioStats = {
//     totalValue: 124567.89,
//     totalGain: 28450.23,
//     totalGainPercent: 29.6,
//     joinDate: 'January 15, 2023',
//     transactionsCount: 156,
//   };

//   const investmentProfile = {
//     riskTolerance: 'Moderate-Aggressive',
//     investmentHorizon: '10+ years',
//     primaryGoals: ['Long-term Growth', 'Retirement Planning'],
//     experienceLevel: 'Intermediate',
//   };

//   const achievements = [
//     { title: 'Early Adopter', description: 'Joined PortfolioAI in the first month', icon: '🌟' },
//     { title: 'Consistent Investor', description: '50+ consecutive months of investing', icon: '📈' },
//     { title: 'Diversification Master', description: 'Portfolio across 8+ sectors', icon: '🎯' },
//     { title: 'High Performer', description: 'Beat market by 10%+ this year', icon: '🏆' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Navigation */}
//       <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center gap-8">
//               <Link to="/" className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
//                 <span className="text-xl font-bold text-white">PortfolioAI</span>
//               </Link>
//               <div className="hidden md:flex items-center gap-6">
//                 <Link to="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
//                 <Link to="/portfolio" className="text-slate-400 hover:text-white transition">Portfolio</Link>
//                 <Link to="/profile" className="text-white font-medium">Profile</Link>
//                 <Link to="/settings" className="text-slate-400 hover:text-white transition">Settings</Link>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <button className="p-2 text-slate-400 hover:text-white transition">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                 </svg>
//               </button>
//               <Link to="/profile" className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Profile Header */}
//         <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 mb-6">
//           <div className="flex items-start justify-between mb-6">
//             <div className="flex items-center gap-6">
//               <div className="relative">
//                 <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
//                   JD
//                 </div>
//                 <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </button>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-white mb-1">{profileData.fullName}</h1>
//                 <p className="text-slate-400 mb-2">{profileData.email}</p>
//                 <p className="text-slate-500 text-sm">Member since {portfolioStats.joinDate}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
//             >
//               {isEditing ? 'Cancel' : 'Edit Profile'}
//             </button>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Personal Information */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//               <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
//               <div className="space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-slate-400 text-sm mb-2">Full Name</label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.fullName}
//                         onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
//                         className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
//                       />
//                     ) : (
//                       <p className="text-white font-medium">{profileData.fullName}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-slate-400 text-sm mb-2">Email</label>
//                     {isEditing ? (
//                       <input
//                         type="email"
//                         value={profileData.email}
//                         onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//                         className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
//                       />
//                     ) : (
//                       <p className="text-white font-medium">{profileData.email}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-slate-400 text-sm mb-2">Phone</label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.phone}
//                         onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
//                         className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
//                       />
//                     ) : (
//                       <p className="text-white font-medium">{profileData.phone}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-slate-400 text-sm mb-2">Location</label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.location}
//                         onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
//                         className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
//                       />
//                     ) : (
//                       <p className="text-white font-medium">{profileData.location}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-slate-400 text-sm mb-2">Bio</label>
//                   {isEditing ? (
//                     <textarea
//                       value={profileData.bio}
//                       onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
//                       rows={3}
//                       className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
//                     />
//                   ) : (
//                     <p className="text-white">{profileData.bio}</p>
//                   )}
//                 </div>
//                 {isEditing && (
//                   <button
//                     onClick={handleSave}
//                     className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition"
//                   >
//                     Save Changes
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Investment Profile */}
//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//               <h2 className="text-xl font-bold text-white mb-6">Investment Profile</h2>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-slate-400 text-sm mb-2">Risk Tolerance</p>
//                   <p className="text-white font-medium">{investmentProfile.riskTolerance}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-400 text-sm mb-2">Investment Horizon</p>
//                   <p className="text-white font-medium">{investmentProfile.investmentHorizon}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-400 text-sm mb-2">Experience Level</p>
//                   <p className="text-white font-medium">{investmentProfile.experienceLevel}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-400 text-sm mb-2">Primary Goals</p>
//                   <div className="flex gap-2 flex-wrap">
//                     {investmentProfile.primaryGoals.map((goal, index) => (
//                       <span key={index} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
//                         {goal}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Achievements */}
//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//               <h2 className="text-xl font-bold text-white mb-6">Achievements</h2>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {achievements.map((achievement, index) => (
//                   <div key={index} className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg">
//                     <span className="text-3xl">{achievement.icon}</span>
//                     <div>
//                       <p className="text-white font-medium mb-1">{achievement.title}</p>
//                       <p className="text-slate-400 text-sm">{achievement.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Stats Sidebar */}
//           <div className="space-y-6">
//             {/* Portfolio Stats */}
//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//               <h2 className="text-xl font-bold text-white mb-6">Portfolio Stats</h2>
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-slate-400 text-sm mb-1">Total Value</p>
//                   <p className="text-2xl font-bold text-white">
//                     ${portfolioStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-slate-400 text-sm mb-1">Total Gain</p>
//                   <p className="text-2xl font-bold text-green-500">
//                     +${portfolioStats.totalGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                   </p>
//                   <p className="text-slate-500 text-sm">+{portfolioStats.totalGainPercent}%</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-400 text-sm mb-1">Total Transactions</p>
//                   <p className="text-2xl font-bold text-white">{portfolioStats.transactionsCount}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//               <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
//               <div className="space-y-3">
//                 <Link
//                   to="/settings"
//                   className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition"
//                 >
//                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <span className="text-white">Account Settings</span>
//                 </Link>
//                 <button className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition w-full text-left">
//                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   <span className="text-white">Download Data</span>
//                 </button>
//                 <button className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-red-900/50 rounded-lg transition w-full text-left">
//                   <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                   </svg>
//                   <span className="text-red-400">Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
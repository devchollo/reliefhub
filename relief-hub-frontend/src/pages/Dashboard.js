// // src/pages/Dashboard.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { userAPI, } from '../services/api';
// import { 
//   Heart, Package, Award, MapPin, 
//   Clock, CheckCircle, DollarSign, Users, AlertCircle 
// } from 'lucide-react';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview'); // overview, requests, donations

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);
//       const response = await userAPI.getDashboard();
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Failed to load dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   const stats = [
//     {
//       name: 'Total Donations',
//       value: user?.totalDonations || 0,
//       icon: Heart,
//       color: 'bg-red-500',
//       change: '+12%'
//     },
//     {
//       name: 'Amount Donated',
//       value: `₱${(user?.totalDonationAmount || 0).toLocaleString()}`,
//       icon: DollarSign,
//       color: 'bg-green-500',
//       change: '+23%'
//     },
//     {
//       name: 'Badges Earned',
//       value: user?.badges?.length || 0,
//       icon: Award,
//       color: 'bg-yellow-500',
//       change: 'New!'
//     },
//     {
//       name: 'Requests Helped',
//       value: dashboardData?.requests?.list?.length || 0,
//       icon: Package,
//       color: 'bg-blue-500',
//       change: '+5'
//     }
//   ];

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       'in-progress': 'bg-blue-100 text-blue-800',
//       fulfilled: 'bg-green-100 text-green-800',
//       cancelled: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {user?.name}! 👋
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Here's what's happening with your relief operations
//           </p>
//         </div>

//         {/* Verification Alerts */}
//         {(!user?.isEmailVerified || !user?.isPhoneVerified) && (
//           <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//               <div>
//                 <h3 className="font-semibold text-yellow-900">Complete Your Verification</h3>
//                 <p className="text-sm text-yellow-700 mt-1">
//                   {!user?.isEmailVerified && 'Please verify your email address. '}
//                   {!user?.isPhoneVerified && 'Please verify your phone number.'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.name}</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
//                 </div>
//                 <div className={`${stat.color} p-3 rounded-lg`}>
//                   <stat.icon className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm">
//                 <span className="text-green-600 font-medium">{stat.change}</span>
//                 <span className="text-gray-600 ml-2">from last month</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Badges */}
//         {user?.badges && user.badges.length > 0 && (
//           <div className="mb-8 bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//               <Award className="w-6 h-6 text-yellow-500" />
//               Your Badges
//             </h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {user.badges.map((badge, index) => (
//                 <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
//                   <div className="text-4xl mb-2">🏆</div>
//                   <p className="font-semibold text-gray-900">{badge.name}</p>
//                   <p className="text-xs text-gray-600 mt-1">
//                     {new Date(badge.earnedAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {/* Tab Headers */}
//           <div className="border-b border-gray-200">
//             <div className="flex">
//               <button
//                 onClick={() => setActiveTab('overview')}
//                 className={`px-6 py-4 text-sm font-medium ${
//                   activeTab === 'overview'
//                     ? 'border-b-2 border-blue-500 text-blue-600'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab('requests')}
//                 className={`px-6 py-4 text-sm font-medium ${
//                   activeTab === 'requests'
//                     ? 'border-b-2 border-blue-500 text-blue-600'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 My Requests
//               </button>
//               <button
//                 onClick={() => setActiveTab('donations')}
//                 className={`px-6 py-4 text-sm font-medium ${
//                   activeTab === 'donations'
//                     ? 'border-b-2 border-blue-500 text-blue-600'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 My Donations
//               </button>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'overview' && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//                   <div className="space-y-3">
//                     {dashboardData?.donations?.list?.slice(0, 5).map((donation, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                             <Heart className="w-5 h-5 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               Donated ₱{donation.amount.toLocaleString()}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               To {donation.request?.name} - {donation.request?.type}
//                             </p>
//                           </div>
//                         </div>
//                         <span className="text-sm text-gray-500">
//                           {new Date(donation.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     ))}
//                     {(!dashboardData?.donations?.list || dashboardData.donations.list.length === 0) && (
//                       <div className="text-center py-8 text-gray-500">
//                         <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                         <p>No donations yet. Start helping today!</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'requests' && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold">My Relief Requests</h3>
//                   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                     Create New Request
//                   </button>
//                 </div>
//                 {dashboardData?.requests?.list?.map((request, index) => (
//                   <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                           <Package className="w-6 h-6 text-blue-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900 capitalize">{request.type} Request</h4>
//                           <p className="text-sm text-gray-600">{request.name}</p>
//                         </div>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
//                         {request.status}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-700 mb-3">{request.message}</p>
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center gap-2 text-gray-500">
//                         <MapPin className="w-4 h-4" />
//                         <span>{request.address || 'Location set'}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-500">
//                         <Clock className="w-4 h-4" />
//                         <span>{new Date(request.createdAt).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                     {request.helpers && request.helpers.length > 0 && (
//                       <div className="mt-3 pt-3 border-t border-gray-200">
//                         <p className="text-sm text-green-600 flex items-center gap-2">
//                           <CheckCircle className="w-4 h-4" />
//                           {request.helpers.length} volunteer(s) helped
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 {(!dashboardData?.requests?.list || dashboardData.requests.list.length === 0) && (
//                   <div className="text-center py-12 text-gray-500">
//                     <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
//                     <p className="mb-4">You haven't created any requests yet</p>
//                     <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                       Create Your First Request
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'donations' && (
//               <div className="space-y-4">
//                 <div className="mb-4">
//                   <h3 className="text-lg font-semibold mb-2">Donation History</h3>
//                   {dashboardData?.donations?.stats && (
//                     <div className="grid grid-cols-3 gap-4 mb-6">
//                       <div className="bg-green-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-600">Total Donated</p>
//                         <p className="text-2xl font-bold text-green-600">
//                           ₱{dashboardData.donations.stats.totalAmount?.toLocaleString() || 0}
//                         </p>
//                       </div>
//                       <div className="bg-blue-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-600">Total Donations</p>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {dashboardData.donations.stats.totalCount || 0}
//                         </p>
//                       </div>
//                       <div className="bg-purple-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-600">Lives Impacted</p>
//                         <p className="text-2xl font-bold text-purple-600">
//                           {(dashboardData.donations.stats.totalCount || 0) * 3}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="space-y-3">
//                   {dashboardData?.donations?.list?.map((donation, index) => (
//                     <div key={index} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                             <DollarSign className="w-5 h-5 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-900">
//                               ₱{donation.amount.toLocaleString()}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               {donation.request?.name} - {donation.request?.type}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className={`px-2 py-1 rounded text-xs font-medium ${
//                             donation.paymentStatus === 'completed' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {donation.paymentStatus}
//                           </span>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {new Date(donation.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
//                         <span>Method: {donation.paymentMethod?.toUpperCase()}</span>
//                         <span>Ref: {donation.transactionId?.slice(0, 12)}...</span>
//                       </div>
//                       {donation.notes && (
//                         <p className="text-sm text-gray-600 mt-2 italic">{donation.notes}</p>
//                       )}
//                     </div>
//                   ))}
//                   {(!dashboardData?.donations?.list || dashboardData.donations.list.length === 0) && (
//                     <div className="text-center py-12 text-gray-500">
//                       <DollarSign className="w-16 h-16 mx-auto mb-3 text-gray-300" />
//                       <p className="mb-4">You haven't made any donations yet</p>
//                       <Link 
//                         to="/"
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                       >
//                         Browse Requests
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Link 
//             to = '/'
//             className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left"
//           >
//             <MapPin className="w-8 h-8 mb-3" />
//             <h3 className="text-lg font-semibold mb-2">Browse Requests</h3>
//             <p className="text-sm text-blue-100">Find people who need help</p>
//           </Link>
          
//           <Link 
//             to = '/leaderboard'
//             className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left"
//           >
//             <Award className="w-8 h-8 mb-3" />
//             <h3 className="text-lg font-semibold mb-2">View Leaderboard</h3>
//             <p className="text-sm text-yellow-100">See top contributors</p>
//           </Link>
          
//           <Link 
//             to = '/profile'
//             className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left"
//           >
//             <Users className="w-8 h-8 mb-3" />
//             <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
//             <p className="text-sm text-green-100">Update your information</p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { 
  Heart, Package, Award, MapPin, Clock, CheckCircle, DollarSign, Users, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({ donations: [], requests: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, requests, donations

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDashboard();

      // Normalize donations and requests
      const donations = response.data?.donations?.list || response.data?.donations || [];
      const donationsStats = response.data?.donations?.stats || {
        totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
        totalCount: donations.length
      };

      const requests = response.data?.requests?.list || response.data?.requests || [];

      setDashboardData({ donations, donationsStats, requests });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Donations', value: user?.totalDonations || 0, icon: Heart, color: 'bg-red-500', change: '+12%' },
    { name: 'Amount Donated', value: `₱${(user?.totalDonationAmount || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', change: '+23%' },
    { name: 'Badges Earned', value: user?.badges?.length || 0, icon: Award, color: 'bg-yellow-500', change: 'New!' },
    { name: 'Requests Helped', value: dashboardData.requests.length || 0, icon: Package, color: 'bg-blue-500', change: '+5' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      fulfilled: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your relief operations
          </p>
        </div>

        {/* Verification Alerts */}
        {(!user?.isEmailVerified || !user?.isPhoneVerified) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">Complete Your Verification</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {!user?.isEmailVerified && 'Please verify your email address. '}
                  {!user?.isPhoneVerified && 'Please verify your phone number.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stat.change}</span>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {user?.badges?.length > 0 && (
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Your Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.badges.map((badge, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="font-semibold text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {['overview', 'requests', 'donations'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'overview' ? 'Overview' : tab === 'requests' ? 'My Requests' : 'My Donations'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
                {dashboardData.donations.length > 0 ? (
                  dashboardData.donations.slice(0, 5).map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Donated ₱{donation.amount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            To {donation.request?.name || 'Request'} - {donation.request?.type || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No donations yet. Start helping today!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4">
                {dashboardData.requests.length > 0 ? (
                  dashboardData.requests.map((request, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 capitalize">{request.type} Request</h4>
                            <p className="text-sm text-gray-600">{request.name}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      {request.helpers?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {request.helpers.length} volunteer(s) helped
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="mb-4">You haven't created any requests yet</p>
                    <Link to="/requests" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Create Your First Request
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="space-y-4">
                {dashboardData.donations.length > 0 ? (
                  dashboardData.donations.map((donation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              ₱{donation.amount?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {donation.request?.name || 'Request'} - {donation.request?.type || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            donation.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {donation.paymentStatus || 'N/A'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <DollarSign className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="mb-4">You haven't made any donations yet</p>
                    <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Browse Requests
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/" className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left">
            <MapPin className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Browse Requests</h3>
            <p className="text-sm text-blue-100">Find people who need help</p>
          </Link>

          <Link to="/leaderboard" className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left">
            <Award className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">View Leaderboard</h3>
            <p className="text-sm text-yellow-100">See top contributors</p>
          </Link>

          <Link to="/profile" className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left">
            <Users className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
            <p className="text-sm text-green-100">Update your information</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

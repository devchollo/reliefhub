// src/pages/Leaderboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { leaderboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Award, Download, Users, Building, Building2, Landmark } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [badges, setBadges] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

useEffect(() => {
  loadLeaderboard();
  loadBadges();
  if (user) {
    loadMyRank();
  }
}, [filterType, user, loadLeaderboard]);

  const loadLeaderboard = useCallback(async () => {
  try {
    setLoading(true);
    const response = await leaderboardAPI.get(filterType);
    setLeaderboard(response.data);
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
  } finally {
    setLoading(false);
  }
}, [filterType]);

  const loadMyRank = async () => {
    try {
      const response = await leaderboardAPI.getMyRank();
      setMyRank(response.data);
    } catch (error) {
      console.error('Failed to load rank:', error);
    }
  };

  const loadBadges = async () => {
    try {
      const response = await leaderboardAPI.getBadges();
      setBadges(response.data);
    } catch (error) {
      console.error('Failed to load badges:', error);
    }
  };

  const downloadCertificate = async (badgeId) => {
    try {
      const blob = await leaderboardAPI.downloadCertificate(badgeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${badgeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  const getBadgeColor = (tier) => {
    const colors = {
      platinum: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      silver: 'from-gray-300 to-gray-500',
      bronze: 'from-orange-400 to-orange-600'
    };
    return colors[tier] || colors.bronze;
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'individual': return <Users className="w-4 h-4" />;
      case 'organization': return <Building className="w-4 h-4" />;
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'government': return <Landmark className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hall of Heroes</h1>
          <p className="text-lg text-gray-600">Recognizing our community champions</p>
        </div>

        {/* My Rank Card (if logged in) */}
        {user && myRank && (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Your Rank</p>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold">#{myRank.rank}</span>
                  <div>
                    <p className="text-2xl font-semibold">₱{myRank.totalDonationAmount?.toLocaleString()}</p>
                    <p className="text-blue-100 text-sm">{myRank.totalDonations} donations</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{myRank.percentile}%</div>
                <p className="text-blue-100 text-sm">Top Percentile</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'individual', 'organization', 'company', 'government'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Heroes' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="divide-y divide-gray-200">
            {leaderboard.map((donor, index) => (
              <div
                key={donor.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`text-3xl font-bold min-w-[60px] bg-gradient-to-br ${getBadgeColor(donor.tier)} bg-clip-text text-transparent`}>
                    #{donor.rank}
                  </div>

                  {/* Badge */}
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${getBadgeColor(donor.tier)}`}>
                    <Award className="w-8 h-8 text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl text-gray-900">{donor.name}</h3>
                      {getUserTypeIcon(donor.userType)}
                      <span className="text-sm text-gray-500 capitalize">{donor.userType}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{donor.totalDonations} donations</span>
                      {donor.badges?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-500" />
                          {donor.badges.length} badges
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      ₱{donor.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Donated</p>
                  </div>

                  {/* Certificate Button */}
                  {user && donor.id === user.id && user.badges?.length > 0 && (
                    <button
                      onClick={() => downloadCertificate(user.badges[0]._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Certificate
                    </button>
                  )}
                </div>

                {/* Top 3 Special Styling */}
                {index === 0 && (
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <p className="text-sm text-yellow-700 font-semibold flex items-center gap-2">
                      🏆 #1 Top Contributor - Platinum Hero
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p>No contributors yet. Be the first!</p>
            </div>
          )}
        </div>

        {/* Badge System Info */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Badge System</h2>
          <p className="text-center text-gray-600 mb-8">
            Earn recognition badges by helping others and making donations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                <div className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
                  {badge.requirement}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Ready to make a difference?</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Start Helping Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            <Search className="w-5 h-5" />
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
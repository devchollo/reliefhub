import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReliefMap from '../components/Map/ReliefMap';
import RequestDetailsModal from '../components/Map/RequestDetailsModal';
import RequestForm from '../components/RequestForm';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const handleRequestSuccess = () => {
    setMapKey(prev => prev + 1);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="bg-white shadow-sm z-10" style={{ flexShrink: 0 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ReliefHub</h1>
              <p className="text-sm text-gray-600">Connecting those in need with helpers</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-gray-700">Hello, {user.name}!</span>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              
              <button
                onClick={() => setShowRequestForm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
              >
                Request Help
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ReliefMap key={mapKey} onRequestSelect={setSelectedRequest} />
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onHelp={() => {
            setMapKey(prev => prev + 1);
            setSelectedRequest(null);
          }}
        />
      )}

      {/* Request Form Modal */}
      {showRequestForm && (
        <RequestForm
          onClose={() => setShowRequestForm(false)}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
};

export default Home;
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const RequestDetailsModal = ({ request, onClose, onHelp }) => {
  const { isAuthenticated } = useAuth();
  const [helping, setHelping] = useState(false);
  const [notes, setNotes] = useState('');

  if (!request) return null;

  const handleHelp = async () => {
    if (!isAuthenticated) {
      alert('Please login to help with this request');
      return;
    }

    try {
      setHelping(true);
      await axios.post(`/api/requests/${request._id}/help`, { notes });
      alert('Thank you for helping!');
      if (onHelp) onHelp();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark as helped');
    } finally {
      setHelping(false);
    }
  };

  const typeColors = {
    food: 'bg-red-100 text-red-800',
    water: 'bg-blue-100 text-blue-800',
    shelter: 'bg-yellow-100 text-yellow-800',
    medical: 'bg-green-100 text-green-800',
    money: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
          <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Verified Badge */}
          {request.isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800">Verified Request</span>
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{request.name}</h3>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${typeColors[request.type]}`}>
                {request.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.status}
              </span>
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">{request.message}</p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {request.phone && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
                  {request.phone}
                </a>
              </div>
            )}
            {request.email && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                  {request.email}
                </a>
              </div>
            )}
          </div>

          {/* Address */}
          {request.address && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
              <p className="text-gray-700">{request.address}</p>
            </div>
          )}

          {/* Money Request Info */}
          {request.type === 'money' && (
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">Financial Information</h4>
              {request.donationGoal && (
                <div>
                  <p className="text-sm text-gray-600">Goal Amount</p>
                  <p className="text-lg font-bold text-purple-600">
                    ₱{request.donationGoal.toLocaleString()}
                  </p>
                  {request.totalReceived > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${Math.min((request.totalReceived / request.donationGoal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        ₱{request.totalReceived.toLocaleString()} raised
                      </p>
                    </div>
                  )}
                </div>
              )}
              {request.gcashNumber && (
                <div>
                  <p className="text-sm text-gray-600">GCash Number</p>
                  <p className="font-medium">{request.gcashNumber}</p>
                </div>
              )}
              {request.bankAccount && (
                <div>
                  <p className="text-sm text-gray-600">Bank Account</p>
                  <p className="font-medium">{request.bankAccount}</p>
                </div>
              )}
            </div>
          )}

          {/* Helpers */}
          {request.helpers && request.helpers.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Helpers ({request.helpers.length})
              </h4>
              <div className="space-y-2">
                {request.helpers.slice(0, 3).map((helper, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {helper.user?.name || 'Anonymous'} helped on{' '}
                    {new Date(helper.helpedAt).toLocaleDateString()}
                  </div>
                ))}
                {request.helpers.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{request.helpers.length - 3} more helpers
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Help Section */}
          {isAuthenticated && request.status !== 'fulfilled' && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Offer Help</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about how you helped (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                rows="3"
              />
              <button
                onClick={handleHelp}
                disabled={helping}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {helping ? 'Processing...' : 'Mark as Helped'}
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="border-t pt-6">
              <p className="text-center text-gray-600">
                Please <a href="/login" className="text-blue-600 hover:underline">login</a> to help with this request
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
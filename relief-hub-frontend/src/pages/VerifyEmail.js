import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    // If there's a token in URL, verify automatically
    if (token) {
      handleVerify();
    }
  }, [token]);

  const handleVerify = async () => {
    if (!token) {
      setError('No verification token found');
      return;
    }

    setVerifying(true);
    const result = await verifyEmail(token);
    
    if (result.success) {
      setMessage('Email verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.error);
    }
    setVerifying(false);
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {token ? 'Verifying your email' : 'Verify your email'}
          </h2>
          {!token && (
            <p className="mt-2 text-center text-sm text-gray-600">
              We sent a verification email to <strong>{user?.email}</strong>
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {verifying && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Verifying...</p>
            </div>
          )}

          {!token && !verifying && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Please check your email and click the verification link.
              </p>
              
              <button
                onClick={handleContinue}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
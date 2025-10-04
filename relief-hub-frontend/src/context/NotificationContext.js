import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
                notif.type === 'error' ? 'border-l-4 border-red-500' :
                notif.type === 'success' ? 'border-l-4 border-green-500' :
                'border-l-4 border-blue-500'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notif.message}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notif.id)}
                    className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
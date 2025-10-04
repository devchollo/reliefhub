import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons for different request types
const createCustomIcon = (type) => {
  const colors = {
    food: '#ef4444',
    water: '#3b82f6',
    shelter: '#f59e0b',
    medical: '#10b981',
    money: '#8b5cf6',
    other: '#6b7280'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${colors[type] || colors.other};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to recenter map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const ReliefMap = ({ onRequestSelect }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'pending'
  });
  const [mapCenter, setMapCenter] = useState([10.3157, 123.8854]); // Philippines default
  const setSelectedRequest = useState(null);

  // Fetch requests
  useEffect(() => {
    fetchRequests();
  }, [filters]);

 const fetchRequests = useCallback(async () => {
  try {
    setLoading(true);
    const response = await requestAPI.getAll({
      status: 'pending',
      lat: center.lat,
      lng: center.lng,
      radius: 50
    });
    setRequests(response.data);
  } catch (error) {
    console.error('Failed to fetch requests:', error);
  } finally {
    setLoading(false);
  }
}, [center.lat, center.lng]);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

useEffect(() => {
  fetchRequests();
}, [fetchRequests]);

  const handleMarkerClick = (request) => {
    setSelectedRequest(request);
    if (onRequestSelect) {
      onRequestSelect(request);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Request Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="food">Food</option>
            <option value="water">Water</option>
            <option value="shelter">Shelter</option>
            <option value="medical">Medical</option>
            <option value="money">Financial Aid</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>

        <button
          onClick={getUserLocation}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          My Location
        </button>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600">
            <strong>{requests.length}</strong> requests found
          </p>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap center={mapCenter} />

        {requests.map((request) => {
          const [lng, lat] = request.location.coordinates;
          return (
            <Marker
              key={request._id}
              position={[lat, lng]}
              icon={createCustomIcon(request.type)}
              eventHandlers={{
                click: () => handleMarkerClick(request),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{request.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Type:</span>{' '}
                      <span className="capitalize">{request.type}</span>
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`capitalize ${
                        request.status === 'pending' ? 'text-yellow-600' :
                        request.status === 'in-progress' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {request.status}
                      </span>
                    </p>
                    <p className="text-gray-600 mt-2">{request.message}</p>
                    {request.phone && (
                      <p className="mt-2">
                        <span className="font-medium">Contact:</span> {request.phone}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleMarkerClick(request)}
                    className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1001]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading requests...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReliefMap;
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Relief Hub</span>
            </div>
            <p className="text-sm">
              Connecting relief operations, volunteers, and donors during emergencies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Map</Link></li>
              <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@reliefhub.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +63 XXX XXX XXXX
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Philippines
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Relief Hub. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            Platform fees: 2.5% processing + 2.5% maintenance (5% total)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
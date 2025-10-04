# 🏥 Relief Hub - Quick Start Guide

> A comprehensive platform connecting relief operations, volunteers, and donors during emergencies.

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://relief-hub.vercel.app)
[![Backend Status](https://img.shields.io/badge/backend-online-blue)](https://relief-hub-api.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Overview

Relief Hub is a full-stack web application designed to streamline disaster relief operations in the Philippines. It enables:

- **🆘 Relief Requests**: People in need can pin their location and request specific assistance
- **❤️ Volunteer Coordination**: Donors and volunteers can find and help those in need
- **💰 Monetary Donations**: Secure payment processing via GCash and Stripe
- **🏆 Recognition System**: Leaderboard and badges to recognize contributors
- **📍 Location Services**: Google Maps integration for navigation
- **📊 Tracking**: Complete donation history and impact metrics

---

## 🎯 Features

### For Those Seeking Help
- ✅ Pin location on map
- ✅ Request specific needs (food, water, shelter, medical, money, etc.)
- ✅ Track request status
- ✅ Receive direct assistance
- ✅ Verify GCash/bank account for monetary help

### For Volunteers & Donors
- ✅ Browse requests on interactive map
- ✅ Filter by need type and location
- ✅ Navigate to location (Google Maps, Waze, Apple Maps)
- ✅ Donate money securely
- ✅ Track donation history
- ✅ Earn badges and recognition
- ✅ Download certificates

### Security & Compliance
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ XSS protection
- ✅ Rate limiting
- ✅ Data encryption
- ✅ Philippine Data Privacy Act compliant
- ✅ Transparent fee disclosure

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Stripe.js** - Payment integration
- **Google Maps API** - Maps & location

### Backend
- **Node.js + Express** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **PDFKit** - Certificate generation

### Security Middleware
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **xss-clean** - XSS protection
- **express-mongo-sanitize** - NoSQL injection prevention
- **hpp** - HTTP parameter pollution prevention

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
git
```

### 1. Clone Repositories

```bash
# Backend
git clone https://github.com/yourusername/relief-hub-backend.git
cd relief-hub-backend
npm install

# Frontend
git clone https://github.com/yourusername/relief-hub-frontend.git
cd relief-hub-frontend
npm install
```

### 2. Environment Setup

**Backend** - Create `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reliefhub
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS (Semaphore)
SEMAPHORE_API_KEY=your-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend** - Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 3. Run Development Servers

```bash
# Backend (Terminal 1)
cd relief-hub-backend
npm run dev

# Frontend (Terminal 2)
cd relief-hub-frontend
npm start
```

Open http://localhost:3000 🎉

---

## 📁 Project Structure

### Backend
```
relief-hub-backend/
├── server.js              # Express app entry point
├── package.json
├── .env.example
├── models/
│   ├── User.js           # User schema
│   ├── Request.js        # Relief request schema
│   ├── Donation.js       # Donation schema
│   └── Badge.js          # Badge schema
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── requests.js       # Request CRUD
│   ├── donations.js      # Donation processing
│   ├── users.js          # User management
│   └── leaderboard.js    # Rankings & certificates
├── middleware/
│   └── auth.js           # JWT verification
└── utils/
    ├── email.js          # Email service
    ├── sms.js            # SMS service
    └── validators.js     # Input validation
```

### Frontend
```
relief-hub-frontend/
├── src/
│   ├── App.js            # Main app component
│   ├── components/
│   │   ├── Map.js
│   │   ├── RequestForm.js
│   │   ├── RequestCard.js
│   │   ├── Leaderboard.js
│   │   └── Certificate.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   └── Profile.js
│   ├── services/
│   │   └── api.js        # API client
│   └── utils/
│       └── helpers.js
```

---

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
POST   /api/auth/verify-email      # Verify email
POST   /api/auth/verify-phone      # Verify phone
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
```

### Requests
```
GET    /api/requests               # Get all requests (with filters)
GET    /api/requests/:id           # Get single request
POST   /api/requests               # Create request
PUT    /api/requests/:id           # Update request
DELETE /api/requests/:id           # Delete request
POST   /api/requests/:id/help      # Mark as helped
POST   /api/requests/:id/verify    # Verify request (admin)
```

### Donations
```
POST   /api/donations/stripe       # Create Stripe donation
POST   /api/donations/gcash        # Create GCash donation
POST   /api/donations/webhook/stripe  # Stripe webhook
GET    /api/donations/my-donations # Get user's donations
GET    /api/donations/request/:id  # Get donations for request
```

### Users
```
GET    /api/users/me               # Get current user
PUT    /api/users/me               # Update profile
DELETE /api/users/me               # Delete account
GET    /api/users/dashboard        # Get dashboard stats
PUT    /api/users/change-password  # Change password
```

### Leaderboard
```
GET    /api/leaderboard            # Get top donors
GET    /api/leaderboard/my-rank    # Get user's rank
GET    /api/leaderboard/certificate/:id  # Download certificate
GET    /api/leaderboard/badges     # Get badge requirements
```

---

## 💳 Payment Integration

### Stripe Test Cards
```
Success:           4242 4242 4242 4242
Decline:           4000 0000 0000 0002
Requires Auth:     4000 0025 0000 3155
Insufficient Funds: 4000 0000 0000 9995

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Fee Structure
- **Payment Processing**: 2.5% (industry standard)
- **Platform Maintenance**: ₱0.25 per ₱10 (2.5%)
- **Total Fees**: ~5% of donation
- **Recipient Receives**: 95% of donation

---

## 🏆 Badge System

### Activity Badges (based on number of donations)
- 🤝 **Helper**: 10 donations
- 🏆 **Champion**: 50 donations
- ⭐ **Hero**: 100 donations
- 👑 **Legend**: 500 donations

### Monetary Badges (based on total donated)
- 🥉 **Bronze**: ₱5,000+
- 🥈 **Silver**: ₱25,000+
- 🥇 **Gold**: ₱50,000+
- 💎 **Platinum**: ₱100,000+

---

## 🔒 Security Features

### Protection Against
- ✅ XSS (Cross-Site Scripting)
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ NoSQL Injection
- ✅ Brute Force Attacks
- ✅ Man-in-the-Middle Attacks
- ✅ HTTP Parameter Pollution
- ✅ Clickjacking

### Best Practices
- Password hashing with bcrypt (12 rounds)
- JWT with expiration
- HTTPS only in production
- Rate limiting (100 req/15min)
- Input sanitization
- Secure headers (Helmet)
- CORS restrictions

---

## 📊 Monitoring & Analytics

### Backend Monitoring (Render)
- Real-time logs
- Performance metrics
- Error tracking
- Uptime monitoring

### Frontend Analytics (Vercel)
- Page views
- User flow
- Performance insights
- Error rates

### Database Monitoring (MongoDB Atlas)
- Query performance
- Storage usage
- Connection stats
- Automated backups

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
```bash
# Check MongoDB connection
# Verify environment variables
# Check port availability
netstat -ano | findstr :5000
```

**Frontend can't connect to API**
```bash
# Verify REACT_APP_API_URL in .env.local
# Check CORS settings in backend
# Ensure backend is running
```

**Stripe payments failing**
```bash
# Verify Stripe keys are correct
# Check webhook is properly configured
# Ensure using test cards in development
```

**Emails not sending**
```bash
# Verify Gmail app password
# Check 2FA is enabled
# Test with a different email provider
```

---

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support

Need help? Reach out:

- 📧 Email: support@reliefhub.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](#)
- 📖 Docs: [Full Documentation](#)

---

## 🙏 Acknowledgments

- All volunteers and donors using the platform
- Open source community
- Disaster relief organizations in the Philippines

---

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core platform features
- [x] Payment integration
- [x] Badge system
- [x] Mobile responsive design

### Phase 2 (Q4 2025)
- [ ] Mobile apps (iOS/Android)
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support

### Phase 3 (2026)
- [ ] AI-powered request matching
- [ ] Volunteer scheduling
- [ ] Inventory management
- [ ] Integration with government systems

---

**Made with ❤️ for the Filipino community**

---

## 📞 Emergency Contacts

For urgent relief operations:
- NDRRMC Hotline: 911
- Red Cross: (02) 8527-0000
- DSWD: (02) 8931-8101-07

---

*Last updated: October 4, 2025*